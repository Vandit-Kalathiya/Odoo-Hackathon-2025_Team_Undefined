package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Payload.Request.CreateQuestionRequest;
import com.stackit.chat_manage_service.Payload.Response.QuestionResponse;
import com.stackit.chat_manage_service.Payload.Response.TagResponse;
import com.stackit.chat_manage_service.Payload.Response.UserSummaryResponse;
import com.stackit.chat_manage_service.Repository.QuestionRepository;
import com.stackit.chat_manage_service.Repository.TagRepository;
import com.stackit.chat_manage_service.Repository.UserRepository;
import com.stackit.chat_manage_service.Entity.Question;
import com.stackit.chat_manage_service.Entity.Tag;
import com.stackit.chat_manage_service.Entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Value("${app.richtext.max-length:50000}")
    private int maxContentLength;

    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        log.info("Creating question: {}", request.getTitle());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate and sanitize content
        String sanitizedDescription = sanitizeHtmlContent(request.getDescription());
        if (sanitizedDescription.length() > maxContentLength) {
            throw new RuntimeException("Content exceeds maximum length");
        }

        // Process tags
        Set<Tag> tags = processTags(request.getTags());

        Question question = Question.builder()
                .title(request.getTitle().trim())
                .description(sanitizedDescription)
                .user(user)
                .tags(tags)
                .build();

        Question savedQuestion = questionRepository.save(question);

        // Update tag usage counts
        tags.forEach(tag -> tagRepository.incrementUsageCount(tag.getId()));

        QuestionResponse response = mapToQuestionResponse(savedQuestion);

        // Send WebSocket notification
        webSocketService.broadcastQuestionCreated(response);

        log.info("Question created successfully with ID: {}", savedQuestion.getId());
        return response;
    }

    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id, Long currentUserId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Increment view count if not the question owner
        if (!question.getUser().getId().equals(currentUserId)) {
            questionRepository.incrementViewCount(id);
        }

        return mapToQuestionResponse(question);
    }

    @Transactional(readOnly = true)
    public Page<QuestionResponse> getAllQuestions(Pageable pageable) {
        return questionRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable)
                .map(this::mapToQuestionResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuestionResponse> searchQuestions(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllQuestions(pageable);
        }

        return questionRepository.findByKeyword(keyword.trim(), pageable)
                .map(this::mapToQuestionResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuestionResponse> getQuestionsByTags(List<String> tagNames, Pageable pageable) {
        List<Tag> tags = tagNames.stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Tag not found: " + name)))
                .toList();

        return questionRepository.findByTags(tags, pageable)
                .map(this::mapToQuestionResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuestionResponse> getUnansweredQuestions(Pageable pageable) {
        return questionRepository.findUnansweredQuestions(pageable)
                .map(this::mapToQuestionResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuestionResponse> getRecentQuestions(int days, Pageable pageable) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return questionRepository.findRecentQuestions(since, pageable)
                .map(this::mapToQuestionResponse);
    }

    public QuestionResponse updateQuestion(Long id, CreateQuestionRequest request, Long currentUserId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to update this question");
        }

        // Update basic fields
        question.setTitle(request.getTitle().trim());
        question.setDescription(sanitizeHtmlContent(request.getDescription()));

        // Update tags
        Set<Tag> oldTags = new HashSet<>(question.getTags());
        Set<Tag> newTags = processTags(request.getTags());

        // Decrement usage count for removed tags
        oldTags.stream()
                .filter(tag -> !newTags.contains(tag))
                .forEach(tag -> tagRepository.decrementUsageCount(tag.getId()));

        // Increment usage count for new tags
        newTags.stream()
                .filter(tag -> !oldTags.contains(tag))
                .forEach(tag -> tagRepository.incrementUsageCount(tag.getId()));

        question.setTags(newTags);

        Question savedQuestion = questionRepository.save(question);
        QuestionResponse response = mapToQuestionResponse(savedQuestion);

        // Send WebSocket notification
        webSocketService.broadcastQuestionUpdated(response);

        return response;
    }

    public void acceptAnswer(Long questionId, Long answerId, Long currentUserId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Only question owner can accept answers");
        }

        questionRepository.updateAcceptedAnswer(questionId, answerId);

        // Send WebSocket notification
        webSocketService.broadcastAnswerAccepted(questionId, answerId);

        // Create notification for answer author
        notificationService.createAnswerAcceptedNotification(answerId, currentUserId);
    }

    public void deleteQuestion(Long id, Long currentUserId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to delete this question");
        }

        question.setIsActive(false);
        questionRepository.save(question);

        // Decrement tag usage counts
        question.getTags().forEach(tag -> tagRepository.decrementUsageCount(tag.getId()));

        log.info("Question deleted: {}", id);
    }

    private Set<Tag> processTags(Set<String> tagNames) {
        Set<Tag> tags = new HashSet<>();

        for (String tagName : tagNames) {
            String normalizedName = tagName.trim().toLowerCase();
            Tag tag = tagRepository.findByName(normalizedName)
                    .orElseGet(() -> tagService.createTag(normalizedName));
            tags.add(tag);
        }

        return tags;
    }

    private String sanitizeHtmlContent(String content) {
        // This is a simplified sanitization - in production, use a proper HTML sanitizer like OWASP Java HTML Sanitizer
        return content.trim();
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        // Safely handle tags collection
        Set<TagResponse> tagResponses = new HashSet<>();
        if (question.getTags() != null) {
            try {
                for (Tag tag : question.getTags()) {
                    tagResponses.add(mapToTagResponse(tag));
                }
            } catch (Exception e) {
                log.warn("Error processing tags for question {}: {}", question.getId(), e.getMessage());
                // Continue with empty tags set
            }
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getDescription())
                .viewCount(question.getViewCount())
                .isActive(question.getIsActive())
                .isClosed(question.getIsClosed())
                .closeReason(question.getCloseReason())
                .acceptedAnswerId(question.getAcceptedAnswerId())
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .user(mapToUserSummary(question.getUser()))
                .tags(tagResponses)
                .answerCount(question.getAnswers() != null ? question.getAnswers().size() : 0)
                .hasAcceptedAnswer(question.getAcceptedAnswerId() != null)
                .build();
    }

    private UserSummaryResponse mapToUserSummary(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .reputationScore(user.getReputationScore())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private TagResponse mapToTagResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .usageCount(tag.getUsageCount())
                .isActive(tag.getIsActive())
                .colorCode(tag.getColorCode())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}
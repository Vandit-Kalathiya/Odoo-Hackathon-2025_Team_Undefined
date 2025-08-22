package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Auth.Entities.User;
import com.stackit.chat_manage_service.Auth.Repository.UserRepository;
import com.stackit.chat_manage_service.Entity.Answer;
import com.stackit.chat_manage_service.Entity.Question;
import com.stackit.chat_manage_service.Payload.Response.UserSummaryResponse;
import com.stackit.chat_manage_service.Repository.AnswerRepository;
import com.stackit.chat_manage_service.Repository.QuestionRepository;
import com.stackit.chat_manage_service.Repository.VoteRepository;
import com.stackit.chat_manage_service.Payload.Request.CreateAnswerRequest;
import com.stackit.chat_manage_service.Payload.Response.AnswerResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Value("${app.richtext.max-length:50000}")
    private int maxContentLength;

    public AnswerResponse createAnswer(CreateAnswerRequest request) {
        log.info("Creating answer for question: {}", request.getQuestionId());

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getIsClosed()) {
            throw new RuntimeException("Cannot answer a closed question");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate and sanitize content
        String sanitizedContent = sanitizeHtmlContent(request.getContent());
        if (sanitizedContent.length() > maxContentLength) {
            throw new RuntimeException("Content exceeds maximum length");
        }

        Answer answer = Answer.builder()
                .content(sanitizedContent)
                .question(question)
                .user(user)
                .build();

        Answer savedAnswer = answerRepository.save(answer);
        AnswerResponse response = mapToAnswerResponse(savedAnswer, null);

        // Send WebSocket notification
//        webSocketService.broadcastNewAnswer(response, question);

        System.out.println(question.getUser().getId() + " " + user.getId());

        // Create notification for question owner (if not answering own question)
        if (question.getUser().getId()!= user.getId()) {
            log.info("Creating notification for question owner: {}", question.getUser().getId());
            notificationService.createQuestionAnsweredNotification(question.getId(), user.getId());
        }

        log.info("Answer created successfully with ID: {}", savedAnswer.getId());
        return response;
    }

    @Transactional(readOnly = true)
    public List<AnswerResponse> getAnswersByQuestion(Long questionId, Long currentUserId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        List<Answer> answers = answerRepository.findByQuestionOrderedByScoreAndAcceptance(question);

        return answers.stream()
                .map(answer -> mapToAnswerResponse(answer, currentUserId))
                .toList();
    }

    @Transactional(readOnly = true)
    public AnswerResponse getAnswerById(Long id, Long currentUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        return mapToAnswerResponse(answer, currentUserId);
    }

    @Transactional(readOnly = true)
    public Page<AnswerResponse> getAnswersByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return answerRepository.findByUser(user, pageable)
                .map(answer -> mapToAnswerResponse(answer, null));
    }

    public AnswerResponse updateAnswer(Long id, CreateAnswerRequest request, Long currentUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to update this answer");
        }

        String sanitizedContent = sanitizeHtmlContent(request.getContent());
        if (sanitizedContent.length() > maxContentLength) {
            throw new RuntimeException("Content exceeds maximum length");
        }

        answer.setContent(sanitizedContent);
        answer.setEditedAt(LocalDateTime.now());

        Answer savedAnswer = answerRepository.save(answer);
        AnswerResponse response = mapToAnswerResponse(savedAnswer, currentUserId);

        // Send WebSocket notification
        webSocketService.broadcastAnswerUpdated(response);

        return response;
    }

    public void acceptAnswer(Long answerId, Long currentUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Question question = answer.getQuestion();

        if (!question.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Only question owner can accept answers");
        }

        // Unaccept all other answers for this question
        answerRepository.unacceptAllAnswersForQuestion(question);

        // Accept this answer
        answerRepository.acceptAnswer(answerId);

        // Update question's accepted answer ID
        questionRepository.updateAcceptedAnswer(question.getId(), answerId);

        // Send WebSocket notification
        webSocketService.broadcastAnswerAccepted(question.getId(), answerId);

        // Create notification for answer author
        notificationService.createAnswerAcceptedNotification(answerId, currentUserId);

        log.info("Answer {} accepted for question {}", answerId, question.getId());
    }

    public void deleteAnswer(Long id, Long currentUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to delete this answer");
        }

        answer.setIsActive(false);
        answerRepository.save(answer);

        // If this was the accepted answer, remove acceptance
        if (answer.getIsAccepted()) {
            questionRepository.updateAcceptedAnswer(answer.getQuestion().getId(), null);
        }

        log.info("Answer deleted: {}", id);
    }

    private String sanitizeHtmlContent(String content) {
        // This is a simplified sanitization - in production, use a proper HTML sanitizer like OWASP Java HTML Sanitizer
        return content.trim();
    }

    private AnswerResponse mapToAnswerResponse(Answer answer, Long currentUserId) {
        // Calculate vote counts
        long upvoteCount = voteRepository.countUpvotesByAnswer(answer);
        long downvoteCount = voteRepository.countDownvotesByAnswer(answer);
        int score = (int) (upvoteCount - downvoteCount);

        // Get current user's vote if provided
        String currentUserVote = null;
        if (currentUserId != null) {
            User currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                voteRepository.findByUserAndAnswer(currentUser, answer)
                        .ifPresent(vote -> {
                            // Set currentUserVote to the vote type string
                        });
            }
        }

        return AnswerResponse.builder()
                .id(answer.getId())
                .content(answer.getContent())
                .isAccepted(answer.getIsAccepted())
                .isActive(answer.getIsActive())
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .editedAt(answer.getEditedAt())
                .user(mapToUserSummary(answer.getUser()))
                .questionId(answer.getQuestion().getId())
                .score(score)
                .upvoteCount((int) upvoteCount)
                .downvoteCount((int) downvoteCount)
                .currentUserVote(currentUserVote)
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
}
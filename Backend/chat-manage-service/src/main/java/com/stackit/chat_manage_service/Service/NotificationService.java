package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Entity.Answer;
import com.stackit.chat_manage_service.Entity.Notification;
import com.stackit.chat_manage_service.Entity.Question;
import com.stackit.chat_manage_service.Entity.User;
import com.stackit.chat_manage_service.Entity.enums.NotificationType;
import com.stackit.chat_manage_service.Payload.Response.NotificationResponse;
import com.stackit.chat_manage_service.Payload.Response.UserSummaryResponse;
import com.stackit.chat_manage_service.Repository.AnswerRepository;
import com.stackit.chat_manage_service.Repository.NotificationRepository;
import com.stackit.chat_manage_service.Repository.QuestionRepository;
import com.stackit.chat_manage_service.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final WebSocketService webSocketService;

    @Value("${app.notification.max-unread:100}")
    private int maxUnreadNotifications;

    @Value("${app.notification.cleanup-days:90}")
    private int cleanupDays;

    public void createQuestionAnsweredNotification(Long questionId, Long triggeredByUserId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        User triggeredByUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't create notification if user is answering their own question
        if (question.getUser().getId().equals(triggeredByUserId)) {
            return;
        }

        // Check if notification already exists to avoid duplicates
        if (notificationRepository.existsByUserAndReferenceIdAndType(
                question.getUser(), questionId, NotificationType.QUESTION_ANSWERED)) {
            return;
        }

        String message = String.format("%s answered your question: \"%s\"",
                triggeredByUser.getDisplayName() != null ? triggeredByUser.getDisplayName() : triggeredByUser.getUsername(),
                truncateTitle(question.getTitle()));

        Notification notification = createNotification(
                question.getUser(),
                NotificationType.QUESTION_ANSWERED,
                message,
                questionId,
                "QUESTION",
                "/questions/" + questionId,
                triggeredByUser
        );

        // Send real-time notification
        webSocketService.sendNotificationToUser(question.getUser().getId(), mapToNotificationResponse(notification));
    }

    public void createAnswerAcceptedNotification(Long answerId, Long triggeredByUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User triggeredByUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't create notification if user is accepting their own answer
        if (answer.getUser().getId().equals(triggeredByUserId)) {
            return;
        }

        String message = String.format("Your answer to \"%s\" was accepted!",
                truncateTitle(answer.getQuestion().getTitle()));

        Notification notification = createNotification(
                answer.getUser(),
                NotificationType.ANSWER_ACCEPTED,
                message,
                answerId,
                "ANSWER",
                "/questions/" + answer.getQuestion().getId() + "#answer-" + answerId,
                triggeredByUser
        );

        // Send real-time notification
        webSocketService.sendNotificationToUser(answer.getUser().getId(), mapToNotificationResponse(notification));
    }

    public void createAnswerUpvotedNotification(Long answerId, Long triggeredByUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User triggeredByUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't create notification if user is voting on their own answer
        if (answer.getUser().getId().equals(triggeredByUserId)) {
            return;
        }

        String message = String.format("Your answer to \"%s\" received an upvote!",
                truncateTitle(answer.getQuestion().getTitle()));

        Notification notification = createNotification(
                answer.getUser(),
                NotificationType.ANSWER_UPVOTED,
                message,
                answerId,
                "ANSWER",
                "/questions/" + answer.getQuestion().getId() + "#answer-" + answerId,
                triggeredByUser
        );

        // Send real-time notification
        webSocketService.sendNotificationToUser(answer.getUser().getId(), mapToNotificationResponse(notification));
    }

    public void createAnswerDownvotedNotification(Long answerId, Long triggeredByUserId) {
        Answer answer = answerRepository.findByIdAndIsActiveTrue(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User triggeredByUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't create notification if user is voting on their own answer
        if (answer.getUser().getId().equals(triggeredByUserId)) {
            return;
        }

        String message = String.format("Your answer to \"%s\" received a downvote.",
                truncateTitle(answer.getQuestion().getTitle()));

        Notification notification = createNotification(
                answer.getUser(),
                NotificationType.ANSWER_DOWNVOTED,
                message,
                answerId,
                "ANSWER",
                "/questions/" + answer.getQuestion().getId() + "#answer-" + answerId,
                triggeredByUser
        );

        // Send real-time notification
        webSocketService.sendNotificationToUser(answer.getUser().getId(), mapToNotificationResponse(notification));
    }

    public void createUserMentionedNotification(Long mentionedUserId, Long triggeredByUserId, String content, Long referenceId, String referenceType) {
        User mentionedUser = userRepository.findById(mentionedUserId)
                .orElseThrow(() -> new RuntimeException("Mentioned user not found"));

        User triggeredByUser = userRepository.findById(triggeredByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't create notification if user mentions themselves
        if (mentionedUserId.equals(triggeredByUserId)) {
            return;
        }

        String message = String.format("%s mentioned you in a %s",
                triggeredByUser.getDisplayName() != null ? triggeredByUser.getDisplayName() : triggeredByUser.getUsername(),
                referenceType.toLowerCase());

        String actionUrl = referenceType.equals("QUESTION") ?
                "/questions/" + referenceId :
                "/questions/" + referenceId; // Adjust based on your URL structure

        Notification notification = createNotification(
                mentionedUser,
                NotificationType.USER_MENTIONED,
                message,
                referenceId,
                referenceType,
                actionUrl,
                triggeredByUser
        );

        // Send real-time notification
        webSocketService.sendNotificationToUser(mentionedUserId, mapToNotificationResponse(notification));
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::mapToNotificationResponse);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToNotificationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countUnreadByUser(user);
    }

    public void markNotificationAsRead(Long notificationId, Long userId) {
        // Verify notification belongs to user
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to mark this notification as read");
        }

        if (!notification.getIsRead()) {
            notificationRepository.markAsRead(notificationId, LocalDateTime.now());
            log.info("Notification {} marked as read", notificationId);
        }
    }

    public void markAllNotificationsAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationRepository.markAllAsReadForUser(user, LocalDateTime.now());
        log.info("All notifications marked as read for user: {}", userId);
    }

    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(cleanupDays);
        notificationRepository.deleteOldNotifications(cutoffDate);
        log.info("Cleaned up notifications older than {} days", cleanupDays);
    }

    private Notification createNotification(User user, NotificationType type, String message,
                                            Long referenceId, String referenceType, String actionUrl,
                                            User triggeredByUser) {

        // Limit unread notifications per user
        long unreadCount = notificationRepository.countUnreadByUser(user);
        if (unreadCount >= maxUnreadNotifications) {
            log.warn("User {} has reached maximum unread notifications limit", user.getId());
            return null;
        }

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .actionUrl(actionUrl)
                .triggeredByUser(triggeredByUser)
                .build();

        return notificationRepository.save(notification);
    }

    private String truncateTitle(String title) {
        if (title.length() > 50) {
            return title.substring(0, 47) + "...";
        }
        return title;
    }

    private NotificationResponse mapToNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .triggeredByUser(notification.getTriggeredByUser() != null ?
                        mapToUserSummary(notification.getTriggeredByUser()) : null)
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

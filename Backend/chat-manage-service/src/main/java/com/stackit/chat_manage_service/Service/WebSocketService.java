package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Payload.Response.AnswerResponse;
import com.stackit.chat_manage_service.Payload.Response.NotificationResponse;
import com.stackit.chat_manage_service.Payload.Response.QuestionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast a new question to all connected clients
     */
    public void broadcastQuestionCreated(QuestionResponse question) {
        log.info("Broadcasting new question: {}", question.getId());

        Map<String, Object> message = new HashMap<>();
        message.put("type", "QUESTION_CREATED");
        message.put("data", question);

        messagingTemplate.convertAndSend("/topic/questions", message);
    }

    /**
     * Broadcast question updates to all subscribers
     */
    public void broadcastQuestionUpdated(QuestionResponse question) {
        log.info("Broadcasting question update: {}", question.getId());

        Map<String, Object> message = new HashMap<>();
        message.put("type", "QUESTION_UPDATED");
        message.put("data", question);

        messagingTemplate.convertAndSend("/topic/questions/" + question.getId(), message);
        messagingTemplate.convertAndSend("/topic/questions", message);
    }

    /**
     * Broadcast new answer to question subscribers
     */
    public void broadcastNewAnswer(AnswerResponse answer) {
        log.info("Broadcasting new answer: {} for question: {}", answer.getId(), answer.getQuestionId());

        Map<String, Object> message = new HashMap<>();
        message.put("type", "NEW_ANSWER");
        message.put("data", answer);

        messagingTemplate.convertAndSend("/topic/questions/" + answer.getQuestionId(), message);
    }

    /**
     * Broadcast answer updates to question subscribers
     */
    public void broadcastAnswerUpdated(AnswerResponse answer) {
        log.info("Broadcasting answer update: {} for question: {}", answer.getId(), answer.getQuestionId());

        Map<String, Object> message = new HashMap<>();
        message.put("type", "ANSWER_UPDATED");
        message.put("data", answer);

        messagingTemplate.convertAndSend("/topic/questions/" + answer.getQuestionId(), message);
    }

    /**
     * Broadcast answer acceptance to question subscribers
     */
    public void broadcastAnswerAccepted(Long questionId, Long answerId) {
        log.info("Broadcasting answer acceptance: {} for question: {}", answerId, questionId);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "ANSWER_ACCEPTED");
        message.put("questionId", questionId);
        message.put("answerId", answerId);

        messagingTemplate.convertAndSend("/topic/questions/" + questionId, message);
    }

    /**
     * Broadcast vote changes to question subscribers
     */
    public void broadcastVoteChange(Long answerId, int newScore) {
        log.info("Broadcasting vote change for answer: {} with new score: {}", answerId, newScore);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "VOTE_CHANGED");
        message.put("answerId", answerId);
        message.put("newScore", newScore);

        messagingTemplate.convertAndSend("/topic/answers/" + answerId, message);
    }

    /**
     * Send private notification to a specific user
     */
    public void sendNotificationToUser(Long userId, NotificationResponse notification) {
        log.info("Sending notification to user: {}", userId);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "NEW_NOTIFICATION");
        message.put("data", notification);

        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/notifications", message);
    }

    /**
     * Broadcast typing indicator for a question
     */
    public void broadcastTypingIndicator(Long questionId, String username, boolean isTyping) {
        log.debug("Broadcasting typing indicator for question: {} user: {} typing: {}",
                questionId, username, isTyping);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "TYPING_INDICATOR");
        message.put("username", username);
        message.put("isTyping", isTyping);

        messagingTemplate.convertAndSend("/topic/questions/" + questionId + "/typing", message);
    }

    /**
     * Broadcast user online status
     */
    public void broadcastUserOnlineStatus(Long userId, boolean isOnline) {
        log.debug("Broadcasting user online status: {} online: {}", userId, isOnline);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "USER_STATUS");
        message.put("userId", userId);
        message.put("isOnline", isOnline);

        messagingTemplate.convertAndSend("/topic/users/status", message);
    }

    /**
     * Send system-wide announcements
     */
    public void broadcastSystemAnnouncement(String title, String message, String type) {
        log.info("Broadcasting system announcement: {}", title);

        Map<String, Object> announcement = new HashMap<>();
        announcement.put("type", "SYSTEM_ANNOUNCEMENT");
        announcement.put("title", title);
        announcement.put("message", message);
        announcement.put("announcementType", type); // INFO, WARNING, ERROR
        announcement.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/announcements", announcement);
    }

    /**
     * Send real-time statistics updates
     */
    public void broadcastStatisticsUpdate(Map<String, Object> stats) {
        log.debug("Broadcasting statistics update");

        Map<String, Object> message = new HashMap<>();
        message.put("type", "STATISTICS_UPDATE");
        message.put("data", stats);

        messagingTemplate.convertAndSend("/topic/statistics", message);
    }
}
package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Service.WebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final WebSocketService webSocketService;

    @MessageMapping("/question/{questionId}/typing")
    public void handleTypingIndicator(
            @DestinationVariable Long questionId,
            @Payload Map<String, Object> message) {

        try {
            String username = (String) message.get("username");
            Boolean isTyping = (Boolean) message.get("isTyping");

            if (username != null && isTyping != null) {
                webSocketService.broadcastTypingIndicator(questionId, username, isTyping);
            }
        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage());
        }
    }

    @MessageMapping("/user/status")
    public void handleUserStatusUpdate(@Payload Map<String, Object> message) {
        try {
            Number userIdNumber = (Number) message.get("userId");
            Boolean isOnline = (Boolean) message.get("isOnline");

            if (userIdNumber != null && isOnline != null) {
                Long userId = userIdNumber.longValue();
                webSocketService.broadcastUserOnlineStatus(userId, isOnline);
            }
        } catch (Exception e) {
            log.error("Error handling user status update: {}", e.getMessage());
        }
    }

    @MessageMapping("/ping")
    @SendToUser("/queue/pong")
    public Map<String, Object> handlePing(@Payload Map<String, Object> message) {
        // Simple ping-pong for connection health check
        return Map.of(
                "type", "PONG",
                "timestamp", System.currentTimeMillis(),
                "originalMessage", message
        );
    }
}

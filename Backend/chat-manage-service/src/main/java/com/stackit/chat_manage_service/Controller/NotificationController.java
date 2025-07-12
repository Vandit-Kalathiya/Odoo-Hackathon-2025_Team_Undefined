package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Payload.Response.NotificationResponse;
import com.stackit.chat_manage_service.Service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "Notification management operations")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user notifications", description = "Retrieve paginated notifications for a user")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<NotificationResponse> response = notificationService.getUserNotifications(userId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "Get unread notifications", description = "Retrieve all unread notifications for a user")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @Parameter(description = "User ID") @PathVariable Long userId) {

        List<NotificationResponse> response = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/count")
    @Operation(summary = "Get unread count", description = "Get the count of unread notifications for a user")
    public ResponseEntity<Map<String, Object>> getUnreadNotificationCount(
            @Parameter(description = "User ID") @PathVariable Long userId) {

        long unreadCount = notificationService.getUnreadNotificationCount(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("unreadCount", unreadCount);
        response.put("hasUnread", unreadCount > 0);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(
            @Parameter(description = "Notification ID") @PathVariable Long notificationId,
            @Parameter(description = "User ID") @RequestParam Long userId) {

        notificationService.markNotificationAsRead(notificationId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification marked as read");

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications as read for a user")
    public ResponseEntity<Map<String, Object>> markAllNotificationsAsRead(
            @Parameter(description = "User ID") @PathVariable Long userId) {

        notificationService.markAllNotificationsAsRead(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications marked as read");

        return ResponseEntity.ok(response);
    }
}

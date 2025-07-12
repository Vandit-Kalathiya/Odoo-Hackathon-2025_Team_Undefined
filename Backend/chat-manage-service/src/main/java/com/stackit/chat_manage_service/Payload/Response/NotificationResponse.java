package com.stackit.chat_manage_service.Payload.Response;

import com.stackit.chat_manage_service.Entity.enums.NotificationType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private NotificationType type;
    private String message;
    private Long referenceId;
    private String referenceType;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String actionUrl;
    private LocalDateTime createdAt;

    private UserSummaryResponse triggeredByUser;
}

package com.stackit.chat_manage_service.Payload.Response;

import com.stackit.chat_manage_service.Entity.enums.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSummaryResponse {

    private Long id;
    private String username;
    private String displayName;
    private UserRole role;
    private String avatarUrl;
    private Integer reputationScore;
    private LocalDateTime createdAt;

    // Statistics
    private Long questionCount;
    private Long answerCount;
}

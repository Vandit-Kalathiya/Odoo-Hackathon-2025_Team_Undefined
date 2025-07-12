package com.stackit.chat_manage_service.Auth.Payload.auth;

import com.stackit.chat_manage_service.Entity.enums.UserRole;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private UserRole role;
    private Boolean isActive;
    private Boolean isBanned;
    private String avatarUrl;
    private String bio;
    private Integer reputationScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
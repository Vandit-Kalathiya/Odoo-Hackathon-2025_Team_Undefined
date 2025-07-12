package com.stackit.chat_manage_service.Payload.Response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerResponse {

    private Long id;
    private String content;
    private Boolean isAccepted;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime editedAt;

    private UserSummaryResponse user;
    private Long questionId;

    // Derived fields
    private Integer score;
    private Integer upvoteCount;
    private Integer downvoteCount;

    // Current user's vote (if any)
    private String currentUserVote; // UPVOTE, DOWNVOTE, or null
}

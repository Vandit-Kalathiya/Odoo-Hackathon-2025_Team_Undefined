package com.stackit.chat_manage_service.Payload.Response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {

    private Long id;
    private String title;
    private String description;
    private Integer viewCount;
    private Boolean isActive;
    private Boolean isClosed;
    private String closeReason;
    private Long acceptedAnswerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UserSummaryResponse user;
    private Set<TagResponse> tags;

    // Derived fields
    private Integer answerCount;
    private Integer score;
    private Boolean hasAcceptedAnswer;

    // Optional fields for detailed view
    private List<AnswerResponse> answers;
}
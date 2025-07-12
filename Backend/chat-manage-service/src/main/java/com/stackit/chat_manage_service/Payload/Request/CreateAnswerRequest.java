package com.stackit.chat_manage_service.Payload.Request;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnswerRequest {

    @NotBlank(message = "Content is required")
    @Size(min = 30, max = 50000, message = "Content must be between 30 and 50000 characters")
    private String content;

    @NotNull(message = "Question ID is required")
    private Long questionId;

    @NotNull(message = "User ID is required")
    private Long userId;
}
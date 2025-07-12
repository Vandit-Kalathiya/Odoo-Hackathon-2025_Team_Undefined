package com.stackit.chat_manage_service.Payload.Request;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 200, message = "Title must be between 10 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 30, max = 50000, message = "Description must be between 30 and 50000 characters")
    private String description;

    @NotNull(message = "Tags are required")
    @Size(min = 1, max = 5, message = "Must have between 1 and 5 tags")
    private Set<String> tags;

    @NotNull(message = "User ID is required")
    private Long userId;
}

package com.stackit.chat_manage_service.Payload.Request;

import com.stackit.chat_manage_service.Entity.enums.VoteType;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {

    @NotNull(message = "Vote type is required")
    private VoteType voteType;

    @NotNull(message = "User ID is required")
    private Long userId;
}

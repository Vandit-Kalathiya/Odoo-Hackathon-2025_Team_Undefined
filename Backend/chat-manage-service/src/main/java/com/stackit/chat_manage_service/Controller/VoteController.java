package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Entity.enums.VoteType;
import com.stackit.chat_manage_service.Payload.Request.VoteRequest;
import com.stackit.chat_manage_service.Service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Votes", description = "Voting operations on answers")
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/answers/{answerId}")
    @Operation(summary = "Vote on answer", description = "Upvote or downvote an answer")
    public ResponseEntity<Map<String, Object>> voteOnAnswer(
            @Parameter(description = "Answer ID") @PathVariable Long answerId,
            @Valid @RequestBody VoteRequest request) {

        log.info("Processing vote on answer: {} by user: {}", answerId, request.getUserId());
        voteService.voteOnAnswer(answerId, request);

        // Return updated vote statistics
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Vote processed successfully");
        response.put("score", voteService.getAnswerScore(answerId));
        response.put("upvotes", voteService.getUpvoteCount(answerId));
        response.put("downvotes", voteService.getDownvoteCount(answerId));

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/answers/{answerId}")
    @Operation(summary = "Remove vote", description = "Remove user's vote from an answer")
    public ResponseEntity<Map<String, Object>> removeVote(
            @Parameter(description = "Answer ID") @PathVariable Long answerId,
            @Parameter(description = "User ID") @RequestParam Long userId) {

        log.info("Removing vote on answer: {} by user: {}", answerId, userId);
        voteService.removeVote(answerId, userId);

        // Return updated vote statistics
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Vote removed successfully");
        response.put("score", voteService.getAnswerScore(answerId));
        response.put("upvotes", voteService.getUpvoteCount(answerId));
        response.put("downvotes", voteService.getDownvoteCount(answerId));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/answers/{answerId}/score")
    @Operation(summary = "Get answer score", description = "Get the current vote score for an answer")
    public ResponseEntity<Map<String, Object>> getAnswerScore(
            @Parameter(description = "Answer ID") @PathVariable Long answerId) {

        Map<String, Object> response = new HashMap<>();
        response.put("score", voteService.getAnswerScore(answerId));
        response.put("upvotes", voteService.getUpvoteCount(answerId));
        response.put("downvotes", voteService.getDownvoteCount(answerId));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/answers/{answerId}/user/{userId}")
    @Operation(summary = "Get user vote", description = "Get user's current vote on an answer")
    public ResponseEntity<Map<String, Object>> getUserVote(
            @Parameter(description = "Answer ID") @PathVariable Long answerId,
            @Parameter(description = "User ID") @PathVariable Long userId) {

        VoteType userVote = voteService.getUserVoteForAnswer(answerId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("voteType", userVote != null ? userVote.name() : null);
        response.put("hasVoted", userVote != null);

        return ResponseEntity.ok(response);
    }
}

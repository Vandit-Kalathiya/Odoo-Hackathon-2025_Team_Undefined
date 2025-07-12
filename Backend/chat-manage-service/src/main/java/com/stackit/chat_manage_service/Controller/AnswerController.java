package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Payload.Request.CreateAnswerRequest;
import com.stackit.chat_manage_service.Payload.Response.AnswerResponse;
import com.stackit.chat_manage_service.Service.AnswerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Answers", description = "Answer management operations")
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    @Operation(summary = "Create a new answer", description = "Post an answer to a question")
    public ResponseEntity<AnswerResponse> createAnswer(
            @Valid @RequestBody CreateAnswerRequest request) {

        log.info("Creating answer for question: {}", request.getQuestionId());
        AnswerResponse response = answerService.createAnswer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get answer by ID", description = "Retrieve a specific answer by its ID")
    public ResponseEntity<AnswerResponse> getAnswer(
            @Parameter(description = "Answer ID") @PathVariable Long id,
            @Parameter(description = "Current user ID for personalization") @RequestParam(required = false) Long currentUserId) {

        AnswerResponse response = answerService.getAnswerById(id, currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/question/{questionId}")
    @Operation(summary = "Get answers for question", description = "Retrieve all answers for a specific question")
    public ResponseEntity<List<AnswerResponse>> getAnswersByQuestion(
            @Parameter(description = "Question ID") @PathVariable Long questionId,
            @Parameter(description = "Current user ID for personalization") @RequestParam(required = false) Long currentUserId) {

        List<AnswerResponse> response = answerService.getAnswersByQuestion(questionId, currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get answers by user", description = "Retrieve paginated answers posted by a specific user")
    public ResponseEntity<Page<AnswerResponse>> getAnswersByUser(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AnswerResponse> response = answerService.getAnswersByUser(userId, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update answer", description = "Update an existing answer (only by answer author)")
    public ResponseEntity<AnswerResponse> updateAnswer(
            @Parameter(description = "Answer ID") @PathVariable Long id,
            @Valid @RequestBody CreateAnswerRequest request,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        AnswerResponse response = answerService.updateAnswer(id, request, currentUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    @Operation(summary = "Accept answer", description = "Mark an answer as accepted (only by question owner)")
    public ResponseEntity<Void> acceptAnswer(
            @Parameter(description = "Answer ID") @PathVariable Long id,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        answerService.acceptAnswer(id, currentUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete answer", description = "Soft delete an answer (only by answer author)")
    public ResponseEntity<Void> deleteAnswer(
            @Parameter(description = "Answer ID") @PathVariable Long id,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        answerService.deleteAnswer(id, currentUserId);
        return ResponseEntity.noContent().build();
    }
}
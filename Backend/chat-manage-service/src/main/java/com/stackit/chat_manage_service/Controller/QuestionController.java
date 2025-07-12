package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Payload.Request.CreateQuestionRequest;
import com.stackit.chat_manage_service.Payload.Response.QuestionResponse;
import com.stackit.chat_manage_service.Service.QuestionService;
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
@RequestMapping("/questions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Questions", description = "Question management operations")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @Operation(summary = "Create a new question", description = "Create a new question with title, description, and tags")
    public ResponseEntity<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request) {

        log.info("Creating question: {}", request.getTitle());
        QuestionResponse response = questionService.createQuestion(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question by ID", description = "Retrieve a specific question with its details and answers")
    public ResponseEntity<QuestionResponse> getQuestion(
            @Parameter(description = "Question ID") @PathVariable Long id,
            @Parameter(description = "Current user ID for personalization") @RequestParam(required = false) Long currentUserId) {

        QuestionResponse response = questionService.getQuestionById(id, currentUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all questions", description = "Retrieve paginated list of all active questions")
    public ResponseEntity<Page<QuestionResponse>> getAllQuestions(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<QuestionResponse> response = questionService.getAllQuestions(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search questions", description = "Search questions by keyword in title or description")
    public ResponseEntity<Page<QuestionResponse>> searchQuestions(
            @Parameter(description = "Search keyword") @RequestParam String q,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<QuestionResponse> response = questionService.searchQuestions(q, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tagged")
    @Operation(summary = "Get questions by tags", description = "Retrieve questions filtered by specific tags")
    public ResponseEntity<Page<QuestionResponse>> getQuestionsByTags(
            @Parameter(description = "Tag names") @RequestParam List<String> tags,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<QuestionResponse> response = questionService.getQuestionsByTags(tags, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unanswered")
    @Operation(summary = "Get unanswered questions", description = "Retrieve questions that don't have accepted answers")
    public ResponseEntity<Page<QuestionResponse>> getUnansweredQuestions(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<QuestionResponse> response = questionService.getUnansweredQuestions(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent questions", description = "Retrieve questions from the last N days")
    public ResponseEntity<Page<QuestionResponse>> getRecentQuestions(
            @Parameter(description = "Number of days") @RequestParam(defaultValue = "7") int days,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<QuestionResponse> response = questionService.getRecentQuestions(days, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update question", description = "Update an existing question (only by question owner)")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @Parameter(description = "Question ID") @PathVariable Long id,
            @Valid @RequestBody CreateQuestionRequest request,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        QuestionResponse response = questionService.updateQuestion(id, request, currentUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept-answer/{answerId}")
    @Operation(summary = "Accept answer", description = "Mark an answer as accepted for the question")
    public ResponseEntity<Void> acceptAnswer(
            @Parameter(description = "Question ID") @PathVariable Long id,
            @Parameter(description = "Answer ID") @PathVariable Long answerId,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        questionService.acceptAnswer(id, answerId, currentUserId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete question", description = "Soft delete a question (only by question owner)")
    public ResponseEntity<Void> deleteQuestion(
            @Parameter(description = "Question ID") @PathVariable Long id,
            @Parameter(description = "Current user ID") @RequestParam Long currentUserId) {

        questionService.deleteQuestion(id, currentUserId);
        return ResponseEntity.noContent().build();
    }
}

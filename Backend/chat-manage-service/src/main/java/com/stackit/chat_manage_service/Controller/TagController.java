package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Payload.Response.TagResponse;
import com.stackit.chat_manage_service.Service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tags", description = "Tag management operations")
public class TagController {

    private final TagService tagService;

    @GetMapping
    @Operation(summary = "Get all tags", description = "Retrieve paginated list of all active tags")
    public ResponseEntity<Page<TagResponse>> getAllTags(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "usageCount") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<TagResponse> response = tagService.getAllTags(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search tags", description = "Search tags by keyword")
    public ResponseEntity<List<TagResponse>> searchTags(
            @Parameter(description = "Search keyword") @RequestParam(required = false) String q) {

        List<TagResponse> response = tagService.searchTags(q);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular tags", description = "Get most used tags")
    public ResponseEntity<List<TagResponse>> getPopularTags(
            @Parameter(description = "Number of tags to return") @RequestParam(defaultValue = "10") int limit) {

        List<TagResponse> response = tagService.getMostUsedTags(limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tag by ID", description = "Retrieve a specific tag by its ID")
    public ResponseEntity<TagResponse> getTagById(
            @Parameter(description = "Tag ID") @PathVariable Long id) {

        TagResponse response = tagService.getTagById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get tag by name", description = "Retrieve a specific tag by its name")
    public ResponseEntity<TagResponse> getTagByName(
            @Parameter(description = "Tag name") @PathVariable String name) {

        TagResponse response = tagService.getTagByName(name);
        return ResponseEntity.ok(response);
    }
}

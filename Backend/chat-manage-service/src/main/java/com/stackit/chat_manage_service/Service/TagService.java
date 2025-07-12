package com.stackit.chat_manage_service.Service;

import com.stackit.chat_manage_service.Entity.Tag;
import com.stackit.chat_manage_service.Payload.Response.TagResponse;
import com.stackit.chat_manage_service.Repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    private static final String[] COLORS = {
            "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
            "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"
    };

    public Tag createTag(String name) {
        log.info("Creating new tag: {}", name);

        String normalizedName = name.trim().toLowerCase();

        if (tagRepository.existsByName(normalizedName)) {
            throw new RuntimeException("Tag already exists: " + normalizedName);
        }

        // Generate random color for the tag
        String colorCode = COLORS[new Random().nextInt(COLORS.length)];

        Tag tag = Tag.builder()
                .name(normalizedName)
                .colorCode(colorCode)
                .isActive(true)
                .usageCount(0)
                .build();

        Tag savedTag = tagRepository.save(tag);
        log.info("Tag created successfully: {}", savedTag.getName());

        return savedTag;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> searchTags(String keyword) {
        List<Tag> tags;

        if (keyword == null || keyword.trim().isEmpty()) {
            tags = tagRepository.findActiveTags();
        } else {
            tags = tagRepository.findByKeyword(keyword.trim());
        }

        return tags.stream()
                .map(this::mapToTagResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<TagResponse> getAllTags(Pageable pageable) {
        return tagRepository.findByIsActiveTrueOrderByUsageCountDesc(pageable)
                .map(this::mapToTagResponse);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getMostUsedTags(int limit) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        return tagRepository.findMostUsedTags(pageable)
                .stream()
                .map(this::mapToTagResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TagResponse getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        return mapToTagResponse(tag);
    }

    @Transactional(readOnly = true)
    public TagResponse getTagByName(String name) {
        Tag tag = tagRepository.findByName(name.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Tag not found: " + name));

        return mapToTagResponse(tag);
    }

    public TagResponse updateTag(Long id, String description, String colorCode) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        if (description != null && !description.trim().isEmpty()) {
            tag.setDescription(description.trim());
        }

        if (colorCode != null && !colorCode.trim().isEmpty()) {
            tag.setColorCode(colorCode.trim());
        }

        Tag savedTag = tagRepository.save(tag);
        return mapToTagResponse(savedTag);
    }

    public void deactivateTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        tag.setIsActive(false);
        tagRepository.save(tag);

        log.info("Tag deactivated: {}", tag.getName());
    }

    @Transactional(readOnly = true)
    public long getTagCount() {
        return tagRepository.countActiveTags();
    }

    private TagResponse mapToTagResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .description(tag.getDescription())
                .usageCount(tag.getUsageCount())
                .isActive(tag.getIsActive())
                .colorCode(tag.getColorCode())
                .createdAt(tag.getCreatedAt())
                .build();
    }
}

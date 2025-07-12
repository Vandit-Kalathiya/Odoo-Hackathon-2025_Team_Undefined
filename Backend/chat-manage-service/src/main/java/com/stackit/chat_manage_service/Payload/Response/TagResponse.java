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
public class TagResponse {

    private Long id;
    private String name;
    private String description;
    private Integer usageCount;
    private Boolean isActive;
    private String colorCode;
    private LocalDateTime createdAt;
}

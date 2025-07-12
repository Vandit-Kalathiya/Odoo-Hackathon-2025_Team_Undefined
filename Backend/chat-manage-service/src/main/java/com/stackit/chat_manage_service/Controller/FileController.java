package com.stackit.chat_manage_service.Controller;

import com.stackit.chat_manage_service.Service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Files", description = "File upload and management operations")
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @Operation(summary = "Upload file", description = "Upload an image file for use in rich text content")
    public ResponseEntity<Map<String, Object>> uploadFile(
            @Parameter(description = "File to upload") @RequestParam("file") MultipartFile file) {

        try {
            log.info("Uploading file: {}", file.getOriginalFilename());
            String filePath = fileService.uploadFile(file);
            String fileUrl = fileService.getFileUrl(filePath);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("fileName", file.getOriginalFilename());
            response.put("filePath", filePath);
            response.put("fileUrl", fileUrl);
            response.put("fileSize", file.getSize());
            response.put("contentType", file.getContentType());

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to upload file: " + e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            log.error("Validation error uploading file: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{year}/{month}/{day}/{filename:.+}")
    @Operation(summary = "Get file", description = "Retrieve an uploaded file")
    public ResponseEntity<ByteArrayResource> getFile(
            @Parameter(description = "Year") @PathVariable String year,
            @Parameter(description = "Month") @PathVariable String month,
            @Parameter(description = "Day") @PathVariable String day,
            @Parameter(description = "Filename") @PathVariable String filename) {

        try {
            String filePath = String.format("%s/%s/%s/%s", year, month, day, filename);
            byte[] fileData = fileService.getFile(filePath);

            ByteArrayResource resource = new ByteArrayResource(fileData);

            // Determine content type based on file extension
            String contentType = determineContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(fileData.length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (IOException e) {
            log.error("Error retrieving file: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            log.error("Error retrieving file: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/info")
    @Operation(summary = "Get upload info", description = "Get file upload constraints and allowed types")
    public ResponseEntity<Map<String, Object>> getUploadInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("maxFileSize", fileService.getMaxFileSize());
        info.put("maxFileSizeMB", fileService.getMaxFileSize() / 1024 / 1024);
        info.put("allowedTypes", fileService.getAllowedTypes());

        return ResponseEntity.ok(info);
    }

    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();

        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "svg" -> "image/svg+xml";
            default -> "application/octet-stream";
        };
    }
}

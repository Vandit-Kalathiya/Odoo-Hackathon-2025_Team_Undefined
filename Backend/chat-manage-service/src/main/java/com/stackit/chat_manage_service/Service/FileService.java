package com.stackit.chat_manage_service.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileService {

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.file.max-size:10485760}") // 10MB in bytes
    private long maxFileSize;

    @Value("${app.file.allowed-types:image/jpeg,image/png,image/gif,image/webp}")
    private String allowedTypes;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        // Create upload directory structure: uploads/YYYY/MM/DD/
        String dateFolder = LocalDateTime.now().format(DATE_FORMATTER);
        Path uploadPath = Paths.get(uploadDir, dateFolder);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".bin";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        Path filePath = uploadPath.resolve(uniqueFilename);

        // Copy file to destination
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path for storage in database
        String relativePath = dateFolder + "/" + uniqueFilename;

        log.info("File uploaded successfully: {} -> {}", originalFilename, relativePath);
        return relativePath;
    }

    public byte[] getFile(String filePath) throws IOException {
        Path path = Paths.get(uploadDir, filePath);

        if (!Files.exists(path)) {
            throw new RuntimeException("File not found: " + filePath);
        }

        return Files.readAllBytes(path);
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(uploadDir, filePath);

        if (Files.exists(path)) {
            Files.delete(path);
            log.info("File deleted: {}", filePath);
        }
    }

    public String getFileUrl(String filePath) {
        return "/api/files/" + filePath;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum allowed size of " +
                    (maxFileSize / 1024 / 1024) + "MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !isAllowedFileType(contentType)) {
            throw new RuntimeException("File type not allowed. Allowed types: " + allowedTypes);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..")) {
            throw new RuntimeException("Invalid filename");
        }
    }

    private boolean isAllowedFileType(String contentType) {
        List<String> allowedTypesList = Arrays.asList(allowedTypes.split(","));
        return allowedTypesList.contains(contentType.toLowerCase());
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public List<String> getAllowedTypes() {
        return Arrays.asList(allowedTypes.split(","));
    }
}
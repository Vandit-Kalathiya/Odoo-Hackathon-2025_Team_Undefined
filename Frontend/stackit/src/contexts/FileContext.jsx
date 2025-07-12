// FileContext.jsx - File Upload Management Context
import React, { createContext, useContext, useState, useCallback } from "react";
import { useApiConfig } from "./ApiConfig";

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const { apiClient, handleApiError, API_CONFIG } = useApiConfig();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadInfo, setUploadInfo] = useState(null);

  // Upload file
  const uploadFile = useCallback(
    async (file, onProgress = null) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            if (onProgress) {
              onProgress(progress);
            }
          },
        });

        // Add to uploaded files list
        setUploadedFiles((prev) => [...prev, response.data]);

        // Clear progress for this file
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });

        return response.data;
      } catch (error) {
        // Clear progress on error
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
        throw new Error(handleApiError(error, "Failed to upload file"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Upload multiple files
  const uploadMultipleFiles = useCallback(
    async (files, onProgress = null) => {
      try {
        setLoading(true);
        const uploadPromises = files.map((file, index) =>
          uploadFile(file, (progress) => {
            if (onProgress) {
              onProgress(index, progress);
            }
          })
        );

        const results = await Promise.all(uploadPromises);
        return results;
      } catch (error) {
        throw new Error("Failed to upload multiple files");
      } finally {
        setLoading(false);
      }
    },
    [uploadFile]
  );

  // Get file URL
  const getFileUrl = useCallback(
    (filePath) => {
      return `${API_CONFIG.BASE_URL}/files/${filePath}`;
    },
    [API_CONFIG.BASE_URL]
  );

  // Get upload info (constraints and limits)
  const getUploadInfo = useCallback(async () => {
    try {
      const response = await apiClient.get("/files/info");
      setUploadInfo(response.data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, "Failed to get upload info"));
    }
  }, [apiClient, handleApiError]);

  // Validate file before upload
  const validateFile = useCallback(
    (file) => {
      const errors = [];

      if (!uploadInfo) {
        return { isValid: false, errors: ["Upload info not loaded"] };
      }

      // Check file size
      if (file.size > uploadInfo.maxFileSize) {
        errors.push(
          `File size exceeds maximum allowed size of ${uploadInfo.maxFileSizeMB}MB`
        );
      }

      // Check file type
      if (!uploadInfo.allowedTypes.includes(file.type)) {
        errors.push(
          `File type ${
            file.type
          } is not allowed. Allowed types: ${uploadInfo.allowedTypes.join(
            ", "
          )}`
        );
      }

      // Check file name
      if (
        file.name.includes("..") ||
        file.name.includes("/") ||
        file.name.includes("\\")
      ) {
        errors.push("Invalid file name");
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [uploadInfo]
  );

  // Validate multiple files
  const validateMultipleFiles = useCallback(
    (files) => {
      const results = files.map((file) => ({
        file,
        validation: validateFile(file),
      }));

      const validFiles = results
        .filter((r) => r.validation.isValid)
        .map((r) => r.file);
      const invalidFiles = results.filter((r) => !r.validation.isValid);

      return {
        validFiles,
        invalidFiles,
        hasInvalidFiles: invalidFiles.length > 0,
      };
    },
    [validateFile]
  );

  // Generate thumbnail URL for images
  const getThumbnailUrl = useCallback(
    (filePath, size = "medium") => {
      // This would typically be handled by the backend
      // For now, we'll return the original file URL
      return getFileUrl(filePath);
    },
    [getFileUrl]
  );

  // Check if file is an image
  const isImageFile = useCallback((file) => {
    return file.type.startsWith("image/");
  }, []);

  // Get file extension
  const getFileExtension = useCallback((fileName) => {
    return fileName.split(".").pop().toLowerCase();
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Remove uploaded file from list
  const removeUploadedFile = useCallback((filePath) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.filePath !== filePath)
    );
  }, []);

  // Clear all uploaded files
  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress({});
  }, []);

  // Get upload progress for specific file
  const getUploadProgress = useCallback(
    (fileName) => {
      return uploadProgress[fileName] || 0;
    },
    [uploadProgress]
  );

  // Check if any files are currently uploading
  const isUploading = useCallback(() => {
    return Object.keys(uploadProgress).length > 0 || loading;
  }, [uploadProgress, loading]);

  // Create file preview for images
  const createFilePreview = useCallback(
    (file) => {
      return new Promise((resolve) => {
        if (!isImageFile(file)) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    },
    [isImageFile]
  );

  // Drag and drop helpers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e, onFileDrop) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (onFileDrop) {
      onFileDrop(files);
    }
  }, []);

  const value = {
    // State
    loading,
    uploadProgress,
    uploadedFiles,
    uploadInfo,

    // Actions
    uploadFile,
    uploadMultipleFiles,
    getFileUrl,
    getUploadInfo,

    // Validation
    validateFile,
    validateMultipleFiles,

    // Utils
    getThumbnailUrl,
    isImageFile,
    getFileExtension,
    formatFileSize,
    removeUploadedFile,
    clearUploadedFiles,
    getUploadProgress,
    isUploading,
    createFilePreview,

    // Drag and drop
    handleDragOver,
    handleDrop,

    // Setters
    setUploadedFiles,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

// Custom hook
export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};

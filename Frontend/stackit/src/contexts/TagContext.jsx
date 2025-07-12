// TagContext.jsx - Tag Management Context
import React, { createContext, useContext, useState, useCallback } from "react";
import { useApiConfig } from "./ApiConfig";

const TagContext = createContext(null);

export const TagProvider = ({ children }) => {
  const { apiClient, handleApiError } = useApiConfig();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentTag, setCurrentTag] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Get all tags
  const getAllTags = useCallback(
    async (
      page = 0,
      size = 20,
      sortBy = "usageCount",
      sortDir = "desc",
      reset = false
    ) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/tags", {
          params: { page, size, sortBy, sortDir },
        });

        const newTags = response.data.content;

        if (reset || page === 0) {
          setTags(newTags);
        } else {
          setTags((prev) => [...prev, ...newTags]);
        }

        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          hasNext: !response.data.last,
          hasPrevious: !response.data.first,
        });

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch tags"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Search tags
  const searchTags = useCallback(
    async (keyword = "") => {
      try {
        setLoading(true);
        const params = keyword ? { q: keyword } : {};
        const response = await apiClient.get("/tags/search", { params });
        setSearchResults(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to search tags"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get popular tags
  const getPopularTags = useCallback(
    async (limit = 10) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/tags/popular", {
          params: { limit },
        });
        setPopularTags(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch popular tags"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get tag by ID
  const getTagById = useCallback(
    async (tagId) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tags/${tagId}`);
        setCurrentTag(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch tag"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get tag by name
  const getTagByName = useCallback(
    async (tagName) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tags/name/${tagName}`);
        setCurrentTag(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch tag"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get tag suggestions for autocomplete
  const getTagSuggestions = useCallback(
    async (input) => {
      if (!input || input.length < 2) {
        return [];
      }

      try {
        const response = await apiClient.get("/tags/search", {
          params: { q: input },
        });
        return response.data.slice(0, 10); // Limit suggestions to 10
      } catch (error) {
        console.error("Failed to get tag suggestions:", error);
        return [];
      }
    },
    [apiClient]
  );

  // Filter tags by category or usage
  const filterTags = useCallback(
    (filterOptions = {}) => {
      let filteredTags = [...tags];

      if (filterOptions.minUsage) {
        filteredTags = filteredTags.filter(
          (tag) => tag.usageCount >= filterOptions.minUsage
        );
      }

      if (filterOptions.maxUsage) {
        filteredTags = filteredTags.filter(
          (tag) => tag.usageCount <= filterOptions.maxUsage
        );
      }

      if (filterOptions.searchTerm) {
        const searchTerm = filterOptions.searchTerm.toLowerCase();
        filteredTags = filteredTags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(searchTerm) ||
            tag.description?.toLowerCase().includes(searchTerm)
        );
      }

      return filteredTags;
    },
    [tags]
  );

  // Get tag statistics
  const getTagStats = useCallback(() => {
    if (tags.length === 0) return null;

    const totalUsage = tags.reduce((sum, tag) => sum + tag.usageCount, 0);
    const averageUsage = totalUsage / tags.length;
    const mostUsedTag = tags.reduce(
      (max, tag) => (tag.usageCount > max.usageCount ? tag : max),
      tags[0]
    );

    return {
      totalTags: tags.length,
      totalUsage,
      averageUsage: Math.round(averageUsage * 100) / 100,
      mostUsedTag,
    };
  }, [tags]);

  // Check if tag exists
  const tagExists = useCallback(
    (tagName) => {
      return tags.some(
        (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
      );
    },
    [tags]
  );

  // Get related tags (tags that appear together frequently)
  const getRelatedTags = useCallback(
    async (tagName) => {
      try {
        // This would typically be a backend endpoint, but for now we'll simulate it
        // by returning tags that are commonly used together
        const currentTagData = tags.find((tag) => tag.name === tagName);
        if (!currentTagData) return [];

        // Return tags with similar usage patterns (simplified logic)
        return tags
          .filter((tag) => tag.name !== tagName)
          .sort(
            (a, b) =>
              Math.abs(a.usageCount - currentTagData.usageCount) -
              Math.abs(b.usageCount - currentTagData.usageCount)
          )
          .slice(0, 5);
      } catch (error) {
        console.error("Failed to get related tags:", error);
        return [];
      }
    },
    [tags]
  );

  // Clear search results
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  // Reset tag state
  const resetTagState = useCallback(() => {
    setTags([]);
    setPopularTags([]);
    setSearchResults([]);
    setCurrentTag(null);
    setPagination({
      page: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }, []);

  const value = {
    // State
    loading,
    tags,
    popularTags,
    searchResults,
    currentTag,
    pagination,

    // Actions
    getAllTags,
    searchTags,
    getPopularTags,
    getTagById,
    getTagByName,
    getTagSuggestions,

    // Utils
    filterTags,
    getTagStats,
    tagExists,
    getRelatedTags,
    clearSearchResults,
    resetTagState,

    // Setters
    setCurrentTag,
    setTags,
    setPopularTags,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};

// Custom hook
export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTags must be used within a TagProvider");
  }
  return context;
};

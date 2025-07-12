// QuestionContext.jsx - Question Management Context
import React, { createContext, useContext, useState, useCallback } from "react";
import { useApiConfig } from "./ApiConfig";

const QuestionContext = createContext(null);

export const QuestionProvider = ({ children }) => {
  const { apiClient, handleApiError } = useApiConfig();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Create question
  const createQuestion = useCallback(
    async (questionData) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/questions", {
          title: questionData.title,
          description: questionData.description,
          tags: questionData.tags,
          userId: questionData.userId,
        });

        // Add to questions list if it's the first page
        if (pagination.page === 0) {
          setQuestions((prev) => [response.data, ...prev]);
        }

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to create question"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, pagination.page]
  );

  // Get all questions
  const getAllQuestions = useCallback(
    async (
      page = 0,
      size = 20,
      sortBy = "createdAt",
      sortDir = "desc",
      reset = false
    ) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/questions", {
          params: { page, size, sortBy, sortDir },
        });

        const newQuestions = response.data.content;

        if (reset || page === 0) {
          setQuestions(newQuestions);
        } else {
          setQuestions((prev) => [...prev, ...newQuestions]);
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
        throw new Error(handleApiError(error, "Failed to fetch questions"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get question by ID
  const getQuestionById = useCallback(
    async (questionId, currentUserId = null) => {
      try {
        setLoading(true);
        const params = currentUserId ? { currentUserId } : {};
        const response = await apiClient.get(`/questions/${questionId}`, {
          params,
        });
        setCurrentQuestion(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch question"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Search questions
  const searchQuestions = useCallback(
    async (keyword, page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/questions/search", {
          params: { q: keyword, page, size },
        });

        const searchResults = response.data.content;

        if (reset || page === 0) {
          setQuestions(searchResults);
        } else {
          setQuestions((prev) => [...prev, ...searchResults]);
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
        throw new Error(handleApiError(error, "Failed to search questions"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get questions by tags
  const getQuestionsByTags = useCallback(
    async (tags, page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/questions/tagged", {
          params: { tags: tags.join(","), page, size },
        });

        const taggedQuestions = response.data.content;

        if (reset || page === 0) {
          setQuestions(taggedQuestions);
        } else {
          setQuestions((prev) => [...prev, ...taggedQuestions]);
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
        throw new Error(
          handleApiError(error, "Failed to fetch questions by tags")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get unanswered questions
  const getUnansweredQuestions = useCallback(
    async (page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/questions/unanswered", {
          params: { page, size },
        });

        const unansweredQuestions = response.data.content;

        if (reset || page === 0) {
          setQuestions(unansweredQuestions);
        } else {
          setQuestions((prev) => [...prev, ...unansweredQuestions]);
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
        throw new Error(
          handleApiError(error, "Failed to fetch unanswered questions")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get recent questions
  const getRecentQuestions = useCallback(
    async (days = 7, page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get("/questions/recent", {
          params: { days, page, size },
        });

        const recentQuestions = response.data.content;

        if (reset || page === 0) {
          setQuestions(recentQuestions);
        } else {
          setQuestions((prev) => [...prev, ...recentQuestions]);
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
        throw new Error(
          handleApiError(error, "Failed to fetch recent questions")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Update question
  const updateQuestion = useCallback(
    async (questionId, questionData, currentUserId) => {
      try {
        setLoading(true);
        const response = await apiClient.put(
          `/questions/${questionId}`,
          questionData,
          {
            params: { currentUserId },
          }
        );

        // Update in questions list
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? response.data : q))
        );

        // Update current question if it's the same
        if (currentQuestion?.id === questionId) {
          setCurrentQuestion(response.data);
        }

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to update question"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentQuestion]
  );

  // Accept answer
  const acceptAnswer = useCallback(
    async (questionId, answerId, currentUserId) => {
      try {
        setLoading(true);
        await apiClient.post(
          `/questions/${questionId}/accept-answer/${answerId}`,
          {},
          {
            params: { currentUserId },
          }
        );

        // Update question in list
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? { ...q, acceptedAnswerId: answerId, hasAcceptedAnswer: true }
              : q
          )
        );

        // Update current question
        if (currentQuestion?.id === questionId) {
          setCurrentQuestion((prev) => ({
            ...prev,
            acceptedAnswerId: answerId,
            hasAcceptedAnswer: true,
          }));
        }
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to accept answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentQuestion]
  );

  // Delete question
  const deleteQuestion = useCallback(
    async (questionId, currentUserId) => {
      try {
        setLoading(true);
        await apiClient.delete(`/questions/${questionId}`, {
          params: { currentUserId },
        });

        // Remove from questions list
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));

        // Clear current question if it's the deleted one
        if (currentQuestion?.id === questionId) {
          setCurrentQuestion(null);
        }
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to delete question"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentQuestion]
  );

  // Update question from WebSocket
  const updateQuestionFromWebSocket = useCallback(
    (questionData) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionData.id ? questionData : q))
      );

      if (currentQuestion?.id === questionData.id) {
        setCurrentQuestion(questionData);
      }
    },
    [currentQuestion]
  );

  // Add new question from WebSocket
  const addQuestionFromWebSocket = useCallback((questionData) => {
    setQuestions((prev) => [questionData, ...prev]);
  }, []);

  const value = {
    // State
    loading,
    questions,
    currentQuestion,
    pagination,

    // Actions
    createQuestion,
    getAllQuestions,
    getQuestionById,
    searchQuestions,
    getQuestionsByTags,
    getUnansweredQuestions,
    getRecentQuestions,
    updateQuestion,
    acceptAnswer,
    deleteQuestion,

    // WebSocket helpers
    updateQuestionFromWebSocket,
    addQuestionFromWebSocket,

    // Utils
    setCurrentQuestion,
    setQuestions,
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};

// Custom hook
export const useQuestions = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
};

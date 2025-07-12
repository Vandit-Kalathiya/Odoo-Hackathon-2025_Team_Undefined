// AnswerContext.jsx - Answer Management Context
import React, { createContext, useContext, useState, useCallback } from "react";
import { useApiConfig } from "./ApiConfig";

const AnswerContext = createContext(null);

export const AnswerProvider = ({ children }) => {
  const { apiClient, handleApiError } = useApiConfig();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);

  // Create answer
  const createAnswer = useCallback(
    async (answerData) => {
      try {
        setLoading(true);
        const response = await apiClient.post("/answers", {
          content: answerData.content,
          questionId: answerData.questionId,
          userId: answerData.userId,
        });

        // Add to answers list for the specific question
        setAnswers((prev) => [...prev, response.data]);

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to create answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get answer by ID
  const getAnswerById = useCallback(
    async (answerId, currentUserId = null) => {
      try {
        setLoading(true);
        const params = currentUserId ? { currentUserId } : {};
        const response = await apiClient.get(`/answers/${answerId}`, {
          params,
        });
        setCurrentAnswer(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get answers for a question
  const getAnswersByQuestion = useCallback(
    async (questionId, currentUserId = null) => {
      try {
        setLoading(true);
        const params = currentUserId ? { currentUserId } : {};
        const response = await apiClient.get(
          `/answers/question/${questionId}`,
          { params }
        );
        setAnswers(response.data);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch answers"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get answers by user
  const getAnswersByUser = useCallback(
    async (userId, page = 0, size = 20) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/answers/user/${userId}`, {
          params: { page, size },
        });
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch user answers"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Update answer
  const updateAnswer = useCallback(
    async (answerId, answerData, currentUserId) => {
      try {
        setLoading(true);
        const response = await apiClient.put(
          `/answers/${answerId}`,
          answerData,
          {
            params: { currentUserId },
          }
        );

        // Update in answers list
        setAnswers((prev) =>
          prev.map((a) => (a.id === answerId ? response.data : a))
        );

        // Update current answer if it's the same
        if (currentAnswer?.id === answerId) {
          setCurrentAnswer(response.data);
        }

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to update answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentAnswer]
  );

  // Accept answer
  const acceptAnswer = useCallback(
    async (answerId, currentUserId) => {
      try {
        setLoading(true);
        await apiClient.post(
          `/answers/${answerId}/accept`,
          {},
          {
            params: { currentUserId },
          }
        );

        // Update answers list - unaccept all others and accept this one
        setAnswers((prev) =>
          prev.map((a) => ({
            ...a,
            isAccepted: a.id === answerId,
          }))
        );

        // Update current answer
        if (currentAnswer?.id === answerId) {
          setCurrentAnswer((prev) => ({ ...prev, isAccepted: true }));
        }
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to accept answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentAnswer]
  );

  // Delete answer
  const deleteAnswer = useCallback(
    async (answerId, currentUserId) => {
      try {
        setLoading(true);
        await apiClient.delete(`/answers/${answerId}`, {
          params: { currentUserId },
        });

        // Remove from answers list
        setAnswers((prev) => prev.filter((a) => a.id !== answerId));

        // Clear current answer if it's the deleted one
        if (currentAnswer?.id === answerId) {
          setCurrentAnswer(null);
        }
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to delete answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError, currentAnswer]
  );

  // Update answer from WebSocket
  const updateAnswerFromWebSocket = useCallback(
    (answerData) => {
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerData.id ? answerData : a))
      );

      if (currentAnswer?.id === answerData.id) {
        setCurrentAnswer(answerData);
      }
    },
    [currentAnswer]
  );

  // Add new answer from WebSocket
  const addAnswerFromWebSocket = useCallback((answerData) => {
    setAnswers((prev) => [...prev, answerData]);
  }, []);

  // Update answer score from WebSocket
  const updateAnswerScore = useCallback(
    (answerId, newScore) => {
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerId ? { ...a, score: newScore } : a))
      );

      if (currentAnswer?.id === answerId) {
        setCurrentAnswer((prev) => ({ ...prev, score: newScore }));
      }
    },
    [currentAnswer]
  );

  // Update answer acceptance status from WebSocket
  const updateAnswerAcceptance = useCallback(
    (answerId) => {
      setAnswers((prev) =>
        prev.map((a) => ({
          ...a,
          isAccepted: a.id === answerId,
        }))
      );

      if (currentAnswer?.id === answerId) {
        setCurrentAnswer((prev) => ({ ...prev, isAccepted: true }));
      }
    },
    [currentAnswer]
  );

  const value = {
    // State
    loading,
    answers,
    currentAnswer,

    // Actions
    createAnswer,
    getAnswerById,
    getAnswersByQuestion,
    getAnswersByUser,
    updateAnswer,
    acceptAnswer,
    deleteAnswer,

    // WebSocket helpers
    updateAnswerFromWebSocket,
    addAnswerFromWebSocket,
    updateAnswerScore,
    updateAnswerAcceptance,

    // Utils
    setCurrentAnswer,
    setAnswers,
  };

  return (
    <AnswerContext.Provider value={value}>{children}</AnswerContext.Provider>
  );
};

// Custom hook
export const useAnswers = () => {
  const context = useContext(AnswerContext);
  if (!context) {
    throw new Error("useAnswers must be used within an AnswerProvider");
  }
  return context;
};

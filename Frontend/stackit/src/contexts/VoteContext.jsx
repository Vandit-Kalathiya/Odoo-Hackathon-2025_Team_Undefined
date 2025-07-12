// VoteContext.jsx - Voting System Context
import React, { createContext, useContext, useState, useCallback } from "react";
import { useApiConfig } from "./ApiConfig";

const VoteContext = createContext(null);

export const VoteProvider = ({ children }) => {
  const { apiClient, handleApiError } = useApiConfig();
  const [loading, setLoading] = useState(false);
  const [userVotes, setUserVotes] = useState(new Map()); // answerId -> voteType
  const [answerScores, setAnswerScores] = useState(new Map()); // answerId -> score data

  // Vote on answer
  const voteOnAnswer = useCallback(
    async (answerId, voteType, userId) => {
      try {
        setLoading(true);
        const response = await apiClient.post(`/votes/answers/${answerId}`, {
          voteType: voteType, // 'UPVOTE' or 'DOWNVOTE'
          userId: userId,
        });

        // Update local state
        setUserVotes((prev) => new Map(prev.set(answerId, voteType)));
        setAnswerScores(
          (prev) =>
            new Map(
              prev.set(answerId, {
                score: response.data.score,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
              })
            )
        );

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to vote on answer"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Remove vote
  const removeVote = useCallback(
    async (answerId, userId) => {
      try {
        setLoading(true);
        const response = await apiClient.delete(`/votes/answers/${answerId}`, {
          params: { userId },
        });

        // Update local state
        setUserVotes((prev) => {
          const newMap = new Map(prev);
          newMap.delete(answerId);
          return newMap;
        });
        setAnswerScores(
          (prev) =>
            new Map(
              prev.set(answerId, {
                score: response.data.score,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
              })
            )
        );

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to remove vote"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Toggle vote (upvote/downvote/remove)
  const toggleVote = useCallback(
    async (answerId, voteType, userId) => {
      const currentVote = userVotes.get(answerId);

      if (currentVote === voteType) {
        // Same vote type - remove vote
        return await removeVote(answerId, userId);
      } else {
        // Different vote type or no vote - add/change vote
        return await voteOnAnswer(answerId, voteType, userId);
      }
    },
    [userVotes, voteOnAnswer, removeVote]
  );

  // Get answer score
  const getAnswerScore = useCallback(
    async (answerId) => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/votes/answers/${answerId}/score`
        );

        setAnswerScores(
          (prev) =>
            new Map(
              prev.set(answerId, {
                score: response.data.score,
                upvotes: response.data.upvotes,
                downvotes: response.data.downvotes,
              })
            )
        );

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to get answer score"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get user's vote for answer
  const getUserVote = useCallback(
    async (answerId, userId) => {
      try {
        const response = await apiClient.get(
          `/votes/answers/${answerId}/user/${userId}`
        );

        if (response.data.voteType) {
          setUserVotes(
            (prev) => new Map(prev.set(answerId, response.data.voteType))
          );
        }

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to get user vote"));
      }
    },
    [apiClient, handleApiError]
  );

  // Load initial vote data for multiple answers
  const loadVoteData = useCallback(
    async (answerIds, userId) => {
      try {
        setLoading(true);

        // Load scores and user votes for all answers
        const promises = answerIds.map(async (answerId) => {
          const [scoreData, userVoteData] = await Promise.all([
            getAnswerScore(answerId),
            userId
              ? getUserVote(answerId, userId)
              : Promise.resolve({ voteType: null }),
          ]);

          return { answerId, scoreData, userVoteData };
        });

        const results = await Promise.all(promises);

        // Update state with all results
        const newScores = new Map(answerScores);
        const newVotes = new Map(userVotes);

        results.forEach(({ answerId, scoreData, userVoteData }) => {
          newScores.set(answerId, scoreData);
          if (userVoteData.voteType) {
            newVotes.set(answerId, userVoteData.voteType);
          }
        });

        setAnswerScores(newScores);
        setUserVotes(newVotes);
      } catch (error) {
        console.error("Failed to load vote data:", error);
      } finally {
        setLoading(false);
      }
    },
    [getAnswerScore, getUserVote, answerScores, userVotes]
  );

  // Update score from WebSocket
  const updateScoreFromWebSocket = useCallback((answerId, newScore) => {
    setAnswerScores((prev) => {
      const current = prev.get(answerId) || {
        score: 0,
        upvotes: 0,
        downvotes: 0,
      };
      return new Map(prev.set(answerId, { ...current, score: newScore }));
    });
  }, []);

  // Check if user has voted
  const hasUserVoted = useCallback(
    (answerId) => {
      return userVotes.has(answerId);
    },
    [userVotes]
  );

  // Get user's vote type for an answer
  const getUserVoteType = useCallback(
    (answerId) => {
      return userVotes.get(answerId) || null;
    },
    [userVotes]
  );

  // Get score data for an answer
  const getScoreData = useCallback(
    (answerId) => {
      return (
        answerScores.get(answerId) || { score: 0, upvotes: 0, downvotes: 0 }
      );
    },
    [answerScores]
  );

  // Clear vote data (useful for logout)
  const clearVoteData = useCallback(() => {
    setUserVotes(new Map());
    setAnswerScores(new Map());
  }, []);

  const value = {
    // State
    loading,
    userVotes,
    answerScores,

    // Actions
    voteOnAnswer,
    removeVote,
    toggleVote,
    getAnswerScore,
    getUserVote,
    loadVoteData,

    // WebSocket helpers
    updateScoreFromWebSocket,

    // Utils
    hasUserVoted,
    getUserVoteType,
    getScoreData,
    clearVoteData,
  };

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};

// Custom hook
export const useVotes = () => {
  const context = useContext(VoteContext);
  if (!context) {
    throw new Error("useVotes must be used within a VoteProvider");
  }
  return context;
};

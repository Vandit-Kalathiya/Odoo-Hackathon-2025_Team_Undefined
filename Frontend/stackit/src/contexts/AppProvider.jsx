// AppProvider.jsx - Main Application Provider with All Contexts
import React from "react";
import { ApiConfigProvider } from "./ApiConfig";
import { QuestionProvider } from "./QuestionContext";
import { AnswerProvider } from "./AnswerContext";
import { VoteProvider } from "./VoteContext";
import { TagProvider } from "./TagContext";
import { NotificationProvider } from "./NotificationContext";
import { FileProvider } from "./FileContext";
import { WebSocketProvider } from "./WebSocketContext";

/**
 * Main application provider that wraps all context providers
 * This creates a single entry point for all API contexts
 */
export const AppProvider = ({ children }) => {
  return (
    <ApiConfigProvider>
      <WebSocketProvider>
        <QuestionProvider>
          <AnswerProvider>
            <VoteProvider>
              <TagProvider>
                <NotificationProvider>
                  <FileProvider>{children}</FileProvider>
                </NotificationProvider>
              </TagProvider>
            </VoteProvider>
          </AnswerProvider>
        </QuestionProvider>
      </WebSocketProvider>
    </ApiConfigProvider>
  );
};

// Export all hooks for easy access
export { useApiConfig } from "./ApiConfig";
export { useQuestions } from "./QuestionContext";
export { useAnswers } from "./AnswerContext";
export { useVotes } from "./VoteContext";
export { useTags } from "./TagContext";
export { useNotifications } from "./NotificationContext";
export { useFiles } from "./FileContext";
export { useWebSocket } from "./WebSocketContext";

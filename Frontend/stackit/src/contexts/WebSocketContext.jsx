// WebSocketContext.jsx - WebSocket Real-time Communication Context
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useApiConfig } from "./ApiConfig";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { API_CONFIG } = useApiConfig();
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptions, setSubscriptions] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Map()); // questionId -> Set of usernames

  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const currentUserIdRef = useRef(null);

  // Connect to WebSocket
  const connect = useCallback(
    (userId) => {
      return new Promise((resolve, reject) => {
        if (clientRef.current?.connected) {
          resolve();
          return;
        }

        setConnecting(true);
        setError(null);
        currentUserIdRef.current = userId;

        const client = new Client({
          webSocketFactory: () => new SockJS(`${API_CONFIG.WS_BASE_URL}/ws`),
          connectHeaders: {
            userId: userId.toString(),
          },
          debug: (str) => {
            console.log("STOMP Debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          console.log("WebSocket Connected");
          setConnected(true);
          setConnecting(false);
          setError(null);
          resolve();
        };

        client.onStompError = (frame) => {
          console.error("WebSocket STOMP Error:", frame);
          setError("WebSocket connection failed");
          setConnecting(false);
          reject(new Error("WebSocket connection failed"));
        };

        client.onWebSocketError = (error) => {
          console.error("WebSocket Error:", error);
          setError("WebSocket connection error");
          setConnecting(false);
        };

        client.onDisconnect = () => {
          console.log("WebSocket Disconnected");
          setConnected(false);
          setConnecting(false);

          // Auto-reconnect if user is still logged in
          if (currentUserIdRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              connect(currentUserIdRef.current);
            }, 5000);
          }
        };

        clientRef.current = client;
        client.activate();
      });
    },
    [API_CONFIG.WS_BASE_URL]
  );

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    setConnected(false);
    setConnecting(false);
    setSubscriptions(new Map());
    setTypingUsers(new Map());
    currentUserIdRef.current = null;
  }, []);

  // Subscribe to question updates
  const subscribeToQuestion = useCallback((questionId, callback) => {
    if (!clientRef.current?.connected) return null;

    const destination = `/topic/questions/${questionId}`;
    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    setSubscriptions(
      (prev) => new Map(prev.set(`question-${questionId}`, subscription))
    );
    return subscription;
  }, []);

  // Subscribe to all questions
  const subscribeToAllQuestions = useCallback((callback) => {
    if (!clientRef.current?.connected) return null;

    const destination = "/topic/questions";
    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    setSubscriptions(
      (prev) => new Map(prev.set("all-questions", subscription))
    );
    return subscription;
  }, []);

  // Subscribe to user notifications
  const subscribeToNotifications = useCallback((userId, callback) => {
    if (!clientRef.current?.connected) return null;

    const destination = `/user/${userId}/queue/notifications`;
    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    setSubscriptions(
      (prev) => new Map(prev.set(`notifications-${userId}`, subscription))
    );
    return subscription;
  }, []);

  // Subscribe to typing indicators
  const subscribeToTyping = useCallback((questionId, callback) => {
    if (!clientRef.current?.connected) return null;

    const destination = `/topic/questions/${questionId}/typing`;
    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);

        // Update typing users state
        setTypingUsers((prev) => {
          const newMap = new Map(prev);
          const currentTyping = newMap.get(questionId) || new Set();

          if (data.isTyping) {
            currentTyping.add(data.username);
          } else {
            currentTyping.delete(data.username);
          }

          if (currentTyping.size === 0) {
            newMap.delete(questionId);
          } else {
            newMap.set(questionId, currentTyping);
          }

          return newMap;
        });

        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    setSubscriptions(
      (prev) => new Map(prev.set(`typing-${questionId}`, subscription))
    );
    return subscription;
  }, []);

  // Subscribe to user status updates
  const subscribeToUserStatus = useCallback((callback) => {
    if (!clientRef.current?.connected) return null;

    const destination = "/topic/users/status";
    const subscription = clientRef.current.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    setSubscriptions((prev) => new Map(prev.set("user-status", subscription)));
    return subscription;
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((questionId, username, isTyping) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: `/app/question/${questionId}/typing`,
        body: JSON.stringify({
          username,
          isTyping,
        }),
      });
    } catch (error) {
      console.error("Error sending typing indicator:", error);
    }
  }, []);

  // Send user status update
  const sendUserStatusUpdate = useCallback((userId, isOnline) => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: "/app/user/status",
        body: JSON.stringify({
          userId,
          isOnline,
        }),
      });
    } catch (error) {
      console.error("Error sending user status:", error);
    }
  }, []);

  // Send ping to check connection
  const sendPing = useCallback(() => {
    if (!clientRef.current?.connected) return;

    try {
      clientRef.current.publish({
        destination: "/app/ping",
        body: JSON.stringify({
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error("Error sending ping:", error);
    }
  }, []);

  // Unsubscribe from a topic
  const unsubscribe = useCallback(
    (key) => {
      const subscription = subscriptions.get(key);
      if (subscription) {
        subscription.unsubscribe();
        setSubscriptions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(key);
          return newMap;
        });
      }
    },
    [subscriptions]
  );

  // Unsubscribe from all topics
  const unsubscribeAll = useCallback(() => {
    subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    setSubscriptions(new Map());
    setTypingUsers(new Map());
  }, [subscriptions]);

  // Get typing users for a question
  const getTypingUsers = useCallback(
    (questionId) => {
      return Array.from(typingUsers.get(questionId) || []);
    },
    [typingUsers]
  );

  // Check if someone is typing in a question
  const isAnyoneTyping = useCallback(
    (questionId) => {
      const typing = typingUsers.get(questionId);
      return typing && typing.size > 0;
    },
    [typingUsers]
  );

  // Auto-cleanup typing indicators after timeout
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      // Clear typing indicators that haven't been updated
      setTypingUsers((prev) => {
        const now = Date.now();
        const newMap = new Map();

        prev.forEach((users, questionId) => {
          // In a real implementation, you'd track timestamps
          // For now, we'll just keep the current state
          if (users.size > 0) {
            newMap.set(questionId, users);
          }
        });

        return newMap;
      });
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, [typingUsers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value = {
    // Connection state
    connected,
    connecting,
    error,

    // Connection management
    connect,
    disconnect,

    // Subscriptions
    subscribeToQuestion,
    subscribeToAllQuestions,
    subscribeToNotifications,
    subscribeToTyping,
    subscribeToUserStatus,
    unsubscribe,
    unsubscribeAll,

    // Message sending
    sendTypingIndicator,
    sendUserStatusUpdate,
    sendPing,

    // Typing indicators
    getTypingUsers,
    isAnyoneTyping,
    typingUsers,

    // Utils
    subscriptions,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

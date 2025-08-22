// NotificationContext.jsx - Notification Management Context
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useApiConfig } from "./ApiConfig";
import "../utils/init"
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const { apiClient, handleApiError } = useApiConfig();

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [stompClient, setStompClient] = useState(null);

  // Add or merge incoming notification with deduplication
  const addNotificationFromWebSocket = useCallback((notification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) {
        return prev; // skip duplicate
      }
      return [notification, ...prev];
    });

    if (!notification.isRead) {
      setUnreadNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
      setUnreadCount((count) => count + 1);
    }
  }, []);

  // Fetch notifications from API with pagination & merging
  const getUserNotifications = useCallback(
    async (userId, page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/notifications/user/${userId}`, {
          params: { page, size },
        });

        const fetchedNotifications = response.data.content || [];

        setPagination({
          page: response.data.number,
          size: response.data.size,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          hasNext: !response.data.last,
          hasPrevious: !response.data.first,
        });

        setNotifications((prev) => {
          if (reset || page === 0) {
            return fetchedNotifications;
          }
          const merged = [...prev];
          fetchedNotifications.forEach((n) => {
            if (!merged.some((existing) => existing.id === n.id)) {
              merged.push(n);
            }
          });
          return merged;
        });

        // Update unread count accordingly
        const unreadFromFetched = fetchedNotifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount((count) =>
          reset || page === 0 ? unreadFromFetched : count + unreadFromFetched
        );

        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch notifications"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Fetch unread notifications (if needed elsewhere)
  const getUnreadNotifications = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/notifications/user/${userId}/unread`
        );
        setUnreadNotifications(response.data);
        setUnreadCount(response.data.length);
        return response.data;
      } catch (error) {
        throw new Error(
          handleApiError(error, "Failed to fetch unread notifications")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId, userId) => {
      try {
        setLoading(true);
        await apiClient.put(
          `/notifications/${notificationId}/read`,
          {},
          { params: { userId } }
        );
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        );
        setUnreadNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId)
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (error) {
        throw new Error(
          handleApiError(error, "Failed to mark notification as read")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        await apiClient.put(`/notifications/user/${userId}/read-all`);
        const now = new Date().toISOString();
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, readAt: now }))
        );
        setUnreadNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        throw new Error(
          handleApiError(error, "Failed to mark all notifications as read")
        );
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Connect WebSocket & subscribe to user topic for real-time notifications
  const connectWebSocket = useCallback(
    (userId) => {
      if (!userId) return;

      const sock = new SockJS("http://localhost:7000/api/chat");
      const client = Stomp.over(sock);

      client.connect(
        {},
        () => {
          setStompClient(client);

          client.subscribe(`/topic/${userId}`, (message) => {
            try {
              const notificationData = JSON.parse(message.body);
              const notification = notificationData.data || notificationData;
              addNotificationFromWebSocket(notification);
            } catch (err) {
              console.error("Failed to parse WebSocket notification:", err);
            }
          });
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          toast.error("WebSocket connection failed: " + error);
        }
      );
    },
    [addNotificationFromWebSocket]
  );

  // Automatically connect to WebSocket and fetch notifications on userProfile change
  useEffect(() => {
    if (!userProfile?.id) return;

    // Load initial notifications
    getUserNotifications(userProfile.id, 0, pagination.size, true).catch(
      console.error
    );

    // Connect WebSocket for live notifications
    connectWebSocket(userProfile.id);

    // Cleanup on unmount - disconnect websocket
    return () => {
      if (stompClient) {
        stompClient.disconnect();
        setStompClient(null);
      }
    };
  }, [
    userProfile?.id,
    getUserNotifications,
    connectWebSocket,
  ]);

  const value = {
    loading,
    notifications,
    unreadNotifications,
    unreadCount,
    pagination,
    stompClient,

    getUserNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    addNotificationFromWebSocket,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

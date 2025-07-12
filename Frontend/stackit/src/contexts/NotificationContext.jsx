// NotificationContext.jsx - Notification Management Context
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useApiConfig } from "./ApiConfig";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
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

  // Get user notifications
  const getUserNotifications = useCallback(
    async (userId, page = 0, size = 20, reset = false) => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/notifications/user/${userId}`, {
          params: { page, size },
        });

        const newNotifications = response.data.content;

        if (reset || page === 0) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
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
        throw new Error(handleApiError(error, "Failed to fetch notifications"));
      } finally {
        setLoading(false);
      }
    },
    [apiClient, handleApiError]
  );

  // Get unread notifications
  const getUnreadNotifications = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/notifications/user/${userId}/unread`
        );
        setUnreadNotifications(response.data);
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

  // Get unread count
  const getUnreadCount = useCallback(
    async (userId) => {
      try {
        const response = await apiClient.get(
          `/notifications/user/${userId}/count`
        );
        setUnreadCount(response.data.unreadCount);
        return response.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch unread count"));
      }
    },
    [apiClient, handleApiError]
  );

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId, userId) => {
      try {
        setLoading(true);
        const response = await apiClient.put(
          `/notifications/${notificationId}/read`,
          {},
          {
            params: { userId },
          }
        );

        // Update notifications list
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        );

        // Update unread notifications
        setUnreadNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId)
        );

        // Update unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));

        return response.data;
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
        const response = await apiClient.put(
          `/notifications/user/${userId}/read-all`
        );

        // Update all notifications to read
        const now = new Date().toISOString();
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, readAt: now }))
        );

        // Clear unread notifications
        setUnreadNotifications([]);
        setUnreadCount(0);

        return response.data;
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

  // Add new notification from WebSocket
  const addNotificationFromWebSocket = useCallback(
    (notificationData) => {
      // Add to notifications list if it's the first page
      if (pagination.page === 0) {
        setNotifications((prev) => [notificationData, ...prev]);
      }

      // Add to unread notifications
      if (!notificationData.isRead) {
        setUnreadNotifications((prev) => [notificationData, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    },
    [pagination.page]
  );

  // Filter notifications by type
  const filterNotificationsByType = useCallback(
    (type) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  // Filter notifications by read status
  const filterNotificationsByReadStatus = useCallback(
    (isRead) => {
      return notifications.filter((n) => n.isRead === isRead);
    },
    [notifications]
  );

  // Get notifications grouped by date
  const getNotificationsGroupedByDate = useCallback(() => {
    const grouped = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });

    return grouped;
  }, [notifications]);

  // Get notification statistics
  const getNotificationStats = useCallback(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      unread,
      read: total - unread,
      byType,
    };
  }, [notifications]);

  // Clear notifications (useful for logout)
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadNotifications([]);
    setUnreadCount(0);
    setPagination({
      page: 0,
      size: 20,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    });
  }, []);

  // Auto-refresh unread count periodically
  const startAutoRefresh = useCallback(
    (userId, intervalMs = 30000) => {
      const interval = setInterval(() => {
        getUnreadCount(userId).catch(console.error);
      }, intervalMs);

      return () => clearInterval(interval);
    },
    [getUnreadCount]
  );

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = useCallback(() => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return notifications.filter((n) => new Date(n.createdAt) > oneDayAgo);
  }, [notifications]);

  // Check if notification is actionable (has action URL)
  const isActionableNotification = useCallback((notification) => {
    return Boolean(notification.actionUrl);
  }, []);

  const value = {
    // State
    loading,
    notifications,
    unreadNotifications,
    unreadCount,
    pagination,

    // Actions
    getUserNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,

    // WebSocket helpers
    addNotificationFromWebSocket,

    // Utils
    filterNotificationsByType,
    filterNotificationsByReadStatus,
    getNotificationsGroupedByDate,
    getNotificationStats,
    getRecentNotifications,
    isActionableNotification,
    clearNotifications,
    startAutoRefresh,

    // Setters
    setNotifications,
    setUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

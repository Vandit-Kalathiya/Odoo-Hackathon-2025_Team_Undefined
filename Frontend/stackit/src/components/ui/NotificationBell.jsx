import React, { useState, useEffect, useRef } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import { useNotifications } from "contexts/NotificationContext";
import { useAuth } from "contexts/AuthContext";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { getUserNotifications, markAsRead } = useNotifications();
  const { user, userProfile } = useAuth();

  const fetchNotifications = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      const userNotifications = await getUserNotifications(userProfile.id);
      console.log("Fetched notifications:", userNotifications);

      // Handle both direct array and paginated response
      const notificationsList =
        userNotifications?.content || userNotifications || [];
      const unreadNotifications = notificationsList.filter((n) => !n.isRead);

      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [userProfile?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId) => {
    if (!userProfile?.id) return;

    try {
      const res = await markAsRead(notificationId, userProfile.id);
      console.log("Marked notification as read:", res);

      // Update the specific notification in the state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count only if the notification was actually unread
      const clickedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      if (clickedNotification && !clickedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!userProfile?.id) return;

    try {
      // Mark all notifications as read in the backend
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      const markPromises = unreadNotifications.map((n) =>
        markAsRead(n.id, userProfile.id)
      );

      await Promise.all(markPromises);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "answer":
      case "ANSWER":
        return "MessageSquare";
      case "vote":
      case "VOTE":
        return "ThumbsUp";
      case "comment":
      case "COMMENT":
        return "MessageCircle";
      case "badge":
      case "BADGE":
        return "Award";
      case "question":
      case "QUESTION":
        return "HelpCircle";
      default:
        return "Bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "answer":
      case "ANSWER":
        return "text-primary";
      case "vote":
      case "VOTE":
        return "text-success";
      case "comment":
      case "COMMENT":
        return "text-secondary";
      case "badge":
      case "BADGE":
        return "text-warning";
      case "question":
      case "QUESTION":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return date.toLocaleDateString();
    } catch (error) {
      return timestamp;
    }
  };

  // Don't render if user is not logged in
  if (!userProfile && !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9"
        title="Notifications"
      >
        <Icon name="Bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-popover-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={markAllAsRead}
                  className="text-xs"
                  disabled={loading}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Icon
                  name="Bell"
                  size={32}
                  className="mx-auto mb-2 opacity-50"
                />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors duration-150 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <Icon
                        name={getNotificationIcon(notification.type)}
                        size={16}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-popover-foreground truncate">
                          {notification.title || notification.message}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      {notification.title && notification.message && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimestamp(
                          notification.timestamp || notification.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/user-profile";
                }}
                className="text-sm"
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

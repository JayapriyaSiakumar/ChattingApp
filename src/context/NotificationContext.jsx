import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { useChat } from "./ChatContext";
import api from "../utils/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket, activeChat } = useChat();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch all notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Socket listeners for real-time notifications
  useEffect(() => {
    if (!socket) return;

    // New notification pushed from server
    const handleNew = (notification) => {
      // Skip if user already has that chat open
      if (activeChat?._id === notification.chat?._id) return;

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Browser notification if page is not focused
      if (document.hidden && Notification.permission === "granted") {
        new Notification(
          `${notification.sender?.name} ${notification.chat?.isGroupChat ? `in ${notification.chat?.name}` : ""}`,
          {
            body: notification.content,
            icon: notification.sender?.avatar,
            tag: notification._id,
          },
        );
      }
    };

    // Server confirmed notifications cleared for a chat (multi-tab sync)
    const handleClearedChat = ({ chatId }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.chat?._id === chatId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => {
        const cleared = notifications.filter(
          (n) => n.chat?._id === chatId && !n.isRead,
        ).length;
        return Math.max(0, prev - cleared);
      });
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:cleared-chat", handleClearedChat);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:cleared-chat", handleClearedChat);
    };
  }, [socket, activeChat, notifications]);

  // Auto-mark notifications read when a chat is opened
  useEffect(() => {
    if (!activeChat || !socket) return;
    const unreadInChat = notifications.filter(
      (n) => n.chat?._id === activeChat._id && !n.isRead,
    );
    if (unreadInChat.length === 0) return;

    // Tell server to mark them read in DB
    api.put("/notifications/read-all").catch(() => {});
    socket.emit("notification:read-chat", { chatId: activeChat._id });

    setNotifications((prev) =>
      prev.map((n) =>
        n.chat?._id === activeChat._id ? { ...n, isRead: true } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - unreadInChat.length));
  }, [activeChat]); // eslint-disable-line

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      const target = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (target && !target.isRead)
        setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await api.delete("/notifications/clear-all");
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const requestBrowserPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestBrowserPermission,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);

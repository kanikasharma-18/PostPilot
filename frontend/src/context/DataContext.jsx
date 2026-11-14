import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_NOTIFICATIONS } from "../data/mockData";
import { postalService } from "../services/postalService";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    isLive: false,
    url: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
  });
  const [globalSearch, setGlobalSearch] = useState("");

  const checkBackend = async () => {
    const isLive = await postalService.checkHealth();
    setBackendStatus(prev => ({
      ...prev,
      checked: true,
      isLive
    }));
    return isLive;
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (newNotif) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: "Just now",
        read: false,
        ...newNotif
      },
      ...prev
    ]);
  };

  return (
    <DataContext.Provider
      value={{
        selectedRange,
        setSelectedRange,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
        backendStatus,
        checkBackend,
        globalSearch,
        setGlobalSearch
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

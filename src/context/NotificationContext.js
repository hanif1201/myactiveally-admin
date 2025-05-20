import React, { createContext, useState } from "react";

// Create context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...notification }]);

    // Auto remove after timeout
    if (notification.autoHide !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Show success notification
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: "success",
      message,
      ...options,
    });
  };

  // Show error notification
  const showError = (message, options = {}) => {
    return addNotification({
      type: "error",
      message,
      ...options,
    });
  };

  // Show info notification
  const showInfo = (message, options = {}) => {
    return addNotification({
      type: "info",
      message,
      ...options,
    });
  };

  // Show warning notification
  const showWarning = (message, options = {}) => {
    return addNotification({
      type: "warning",
      message,
      ...options,
    });
  };

  // Context value
  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

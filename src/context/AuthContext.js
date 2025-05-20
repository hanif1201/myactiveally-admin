import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state when component mounts
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Verify token validity
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired, try to refresh
            await refreshToken();
          } else {
            // Token valid, set auth state
            api.setAuthToken(token);
            await loadUser();
          }
        } catch (decodeError) {
          // Invalid token
          localStorage.removeItem("token");
          api.setAuthToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Authentication failed. Please log in again.");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      const response = await api.auth.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Load user error:", err);
      setError("Failed to load user data");
      localStorage.removeItem("token");
      api.setAuthToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await api.auth.refreshToken();
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.setAuthToken(token);
      await loadUser();
    } catch (err) {
      console.error("Refresh token error:", err);
      localStorage.removeItem("token");
      api.setAuthToken(null);
      setIsAuthenticated(false);
      setUser(null);
      setError("Session expired. Please log in again.");
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await api.auth.adminLogin(credentials);
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.setAuthToken(token);
      await loadUser();
      setError(null);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      return { success: false, error: err.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    api.setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await api.auth.changePassword(passwordData);
      return { success: true };
    } catch (err) {
      console.error("Change password error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to change password",
      };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await api.auth.forgotPassword(email);
      return { success: true };
    } catch (err) {
      console.error("Forgot password error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to process request",
      };
    }
  };

  // Reset password
  const resetPassword = async (tokenData) => {
    try {
      await api.auth.resetPassword(tokenData);
      return { success: true };
    } catch (err) {
      console.error("Reset password error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to reset password",
      };
    }
  };

  // Context value
  const contextValue = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

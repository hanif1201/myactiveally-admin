import axios from "axios";
import auth from "./auth";
import users from "./users";
import instructors from "./instructors";
import gyms from "./gyms";
import consultations from "./consultations";
import matches from "./matches";
import workouts from "./workouts";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = async () => {
          const response = await instance.post("/auth/refresh");
          const { token } = response.data;
          localStorage.setItem("token", token);
          return token;
        };

        const newToken = await refreshToken();

        // Retry the original request with new token
        originalRequest.headers["x-auth-token"] = newToken;
        return instance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Set auth token for axios instance
const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete instance.defaults.headers.common["x-auth-token"];
  }
};

const api = {
  instance,
  setAuthToken,
  auth,
  users,
  instructors,
  gyms,
  consultations,
  matches,
  workouts,
};

export default api;

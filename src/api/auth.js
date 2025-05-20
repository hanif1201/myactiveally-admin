import api from "./index";

const auth = {
  // Login
  login: (credentials) => {
    return api.instance.post("/auth/login", credentials);
  },

  // Admin login
  adminLogin: (credentials) => {
    return api.instance.post("/auth/admin/login", credentials);
  },

  // Get current user
  getCurrentUser: () => {
    return api.instance.get("/auth/user");
  },

  // Change password
  changePassword: (passwordData) => {
    return api.instance.put("/auth/password", passwordData);
  },

  // Refresh token
  refreshToken: () => {
    return api.instance.post("/auth/refresh");
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.instance.post("/auth/forgot-password", { email });
  },

  // Reset password
  resetPassword: (tokenData) => {
    return api.instance.post("/auth/reset-password", tokenData);
  },
};

export default auth;

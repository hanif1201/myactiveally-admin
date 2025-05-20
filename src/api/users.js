import api from "./index";

const users = {
  // Get all users
  getAllUsers: (params) => {
    return api.instance.get("/admin/users", { params });
  },

  // Get user by ID
  getUserById: (id) => {
    return api.instance.get(`/admin/users/${id}`);
  },

  // Update user status
  updateUserStatus: (userId, status) => {
    return api.instance.put(`/admin/users/${userId}/status`, { status });
  },

  // Create admin user
  createAdminUser: (userData) => {
    return api.instance.post("/admin/users/admin", userData);
  },

  // Get nearby users
  getNearbyUsers: (params) => {
    return api.instance.get("/users/nearby/users", { params });
  },

  // Delete user
  deleteUser: (id) => {
    return api.instance.delete(`/users/${id}`);
  },
};

export default users;

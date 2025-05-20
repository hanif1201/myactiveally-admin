import api from "./index";

const gyms = {
  // Get all gyms
  getAllGyms: (params) => {
    return api.instance.get("/admin/gyms", { params });
  },

  // Get gym by ID
  getGymById: (id) => {
    return api.instance.get(`/gyms/${id}`);
  },

  // Verify gym
  verifyGym: (gymId) => {
    return api.instance.put(`/admin/gyms/${gymId}/verify`);
  },

  // Get nearby gyms
  getNearbyGyms: (params) => {
    return api.instance.get("/gyms/nearby", { params });
  },

  // Search gyms
  searchGyms: (query) => {
    return api.instance.get("/gyms/search", { params: { query } });
  },

  // Get gym instructors
  getGymInstructors: (gymId) => {
    return api.instance.get(`/gyms/${gymId}/instructors`);
  },
};

export default gyms;

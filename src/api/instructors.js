import api from "./index";

const instructors = {
  // Get all instructors
  getAllInstructors: (params) => {
    return api.instance.get("/admin/instructors", { params });
  },

  // Get instructor by ID
  getInstructorById: (id) => {
    return api.instance.get(`/instructors/${id}`);
  },

  // Verify instructor
  verifyInstructor: (instructorId) => {
    return api.instance.put(`/admin/instructors/${instructorId}/verify`);
  },

  // Get nearby instructors
  getNearbyInstructors: (params) => {
    return api.instance.get("/users/nearby/instructors", { params });
  },
};

export default instructors;

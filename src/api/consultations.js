import api from "./index";

const consultations = {
  // Get all consultations
  getAllConsultations: (params) => {
    return api.instance.get("/admin/consultations", { params });
  },

  // Get consultation by ID
  getConsultationById: (id) => {
    return api.instance.get(`/consultations/${id}`);
  },

  // Update consultation status
  updateConsultationStatus: (consultationId, status) => {
    return api.instance.put(`/consultations/${consultationId}/status`, {
      status,
    });
  },
};

export default consultations;

import api from "./index";

const matches = {
  // Get all matches
  getAllMatches: (params) => {
    return api.instance.get("/admin/matches", { params });
  },

  // Get match by ID
  getMatchById: (id) => {
    return api.instance.get(`/matches/${id}`);
  },

  // Get active matches
  getActiveMatches: () => {
    return api.instance.get("/matches/active");
  },

  // Get pending matches
  getPendingMatches: () => {
    return api.instance.get("/matches/pending");
  },
};

export default matches;

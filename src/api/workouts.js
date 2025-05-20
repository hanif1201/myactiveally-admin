import api from "./index";

const workouts = {
  // Get all workouts
  getAllWorkouts: (params) => {
    return api.instance.get("/admin/workouts", { params });
  },

  // Get workout by ID
  getWorkoutById: (id) => {
    return api.instance.get(`/workouts/${id}`);
  },

  // Analyze workout
  analyzeWorkout: (workoutId) => {
    return api.instance.get(`/ai/workouts/${workoutId}/analyze`);
  },
};

export default workouts;

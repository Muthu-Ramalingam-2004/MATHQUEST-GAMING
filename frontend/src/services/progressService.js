import { api } from "./api";

export const progressService = {
  // Update student profile details
  updateProfile: async (payload) => {
    return await api.put("/students/profile", payload);
  },

  // Fetch student stats
  getStats: async () => {
    return await api.get("/students/stats");
  },

  // Toggle game sounds
  toggleSound: async (enabled) => {
    return await api.put("/students/settings/sound", { enabled });
  },

  // Toggle visual themes
  toggleDarkMode: async (enabled) => {
    return await api.put("/students/settings/darkmode", { enabled });
  }
};

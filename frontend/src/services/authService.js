import { api, setAuthToken } from "./api";

export const authService = {
  // Login student
  login: async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  // Register student
  register: async (email, username, password) => {
    const data = await api.post("/auth/register", { email, username, password });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  // Get current user and profile
  getMe: async () => {
    return await api.get("/auth/me");
  },

  // Reset password
  resetPassword: async (email, newPassword) => {
    return await api.post("/auth/reset-password", { email, newPassword });
  },

  // Log out student
  logout: () => {
    setAuthToken(null);
  }
};

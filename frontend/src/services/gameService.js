import { api } from "./api";

export const gameService = {
  // Get questions filtered by class and chapter
  getQuestions: async (classGrade, chapterId) => {
    let endpoint = `/questions?classGrade=${classGrade}`;
    if (chapterId) {
      endpoint += `&chapterId=${chapterId}`;
    }
    return await api.get(endpoint);
  },

  // Validate answer against database key
  validateAnswer: async (questionId, selectedAnswer) => {
    return await api.post("/questions/validate", { questionId, selectedAnswer });
  },

  // Record session start
  startSession: async (chapterId, mode) => {
    return await api.post("/games/session/start", { chapterId, mode });
  },

  // Record session details & calculate rewards
  finishSession: async (payload) => {
    // payload: { sessionId, score, totalQuestions, xpEarned, coinsEarned, survived }
    return await api.post("/games/session/finish", payload);
  },

  // Fetch league rankings
  getLeaderboard: async () => {
    return await api.get("/games/leaderboard");
  },

  // Admin: Create question
  adminCreateQuestion: async (payload) => {
    return await api.post("/questions/admin/create", payload);
  },

  // Admin: Update question
  adminUpdateQuestion: async (id, payload) => {
    return await api.put(`/questions/admin/update/${id}`, payload);
  },

  // Admin: Delete question
  adminDeleteQuestion: async (id) => {
    return await api.delete(`/questions/admin/delete/${id}`);
  }
};

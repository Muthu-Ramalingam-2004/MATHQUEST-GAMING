import { db } from "../config/db.js";

export const leaderboardController = {
  // Get dynamic rankings sorted by XP
  getLeaderboard: async (req, res) => {
    try {
      const rawStore = db.getRawStore();
      const profiles = [...rawStore.student_profiles];

      // Format for leaderboard display
      const formatted = profiles.map(p => ({
        name: p.name,
        avatar: p.avatar,
        xp: p.xp,
        level: p.level,
        streak: p.streak,
        isMock: p.isMock || false
      }));

      // Sort descending by XP
      formatted.sort((a, b) => b.xp - a.xp);

      // Map ranking indexes
      const ranked = formatted.map((user, index) => ({
        ...user,
        rank: index + 1
      }));

      res.json(ranked);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching leaderboard rankings." });
    }
  }
};

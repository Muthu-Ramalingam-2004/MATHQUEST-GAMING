import { db } from "../config/db.js";

export const leaderboardController = {
  // Get dynamic rankings sorted by XP from PostgreSQL leaderboard view
  getLeaderboard: async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM leaderboard ORDER BY rank ASC LIMIT 100");
      
      const formatted = result.rows.map(row => ({
        name: row.name,
        avatar: row.avatar,
        xp: Number(row.xp),
        level: Number(row.level),
        streak: Number(row.streak),
        isMock: false,
        rank: Number(row.rank)
      }));

      res.json(formatted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching leaderboard rankings." });
    }
  }
};

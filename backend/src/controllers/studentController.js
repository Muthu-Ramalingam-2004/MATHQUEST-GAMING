import { db } from "../config/db.js";

export const studentController = {
  // 1. Update Profile Settings
  updateProfile: async (req, res) => {
    const { name, avatar, class_grade, daily_goal } = req.body;

    try {
      const result = await db.query(
        "UPDATE student_profiles SET name = $1, avatar = $2, class_grade = $3, daily_goal = $4 WHERE user_id = $5 RETURNING *",
        [name, avatar, Number(class_grade), Number(daily_goal), req.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }

      res.json({
        message: "Profile updated successfully!",
        profile: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating profile settings." });
    }
  },

  // 2. Fetch Student Statistics (Aggregates)
  getStats: async (req, res) => {
    try {
      // 1. Fetch Profile
      const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [req.user.userId]);
      if (profileResult.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      const profile = profileResult.rows[0];

      // 2. Fetch Progress records
      const progressResult = await db.query("SELECT * FROM student_progress WHERE student_id = $1", [profile.id]);
      const studentProgress = progressResult.rows;

      // 3. Fetch Badges
      const badgesResult = await db.query("SELECT badge_id FROM student_badges WHERE student_id = $1", [profile.id]);
      const unlockedBadges = badgesResult.rows.map(row => row.badge_id);

      res.json({
        profile: {
          ...profile,
          unlockedBadges
        },
        progress: studentProgress
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching stats." });
    }
  },

  // 3. Toggle Sound Settings
  toggleSound: async (req, res) => {
    const { enabled } = req.body;

    try {
      const result = await db.query(
        "UPDATE student_profiles SET sound_enabled = $1 WHERE user_id = $2 RETURNING *",
        [enabled, req.user.userId]
      );
      res.json({ message: "Sound settings updated", profile: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  },

  // 4. Toggle Dark Mode Settings
  toggleDarkMode: async (req, res) => {
    const { enabled } = req.body;

    try {
      const result = await db.query(
        "UPDATE student_profiles SET dark_mode = $1 WHERE user_id = $2 RETURNING *",
        [enabled, req.user.userId]
      );
      res.json({ message: "Theme settings updated", profile: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
};

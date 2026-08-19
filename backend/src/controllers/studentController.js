import { db } from "../config/db.js";
import { getFullUserProfile } from "./authController.js";

export const studentController = {
  // 1. Update Profile Settings
  updateProfile: async (req, res) => {
    const { name, avatar, class_grade, daily_goal, class: classInput, dailyGoal } = req.body;
    const finalClass = class_grade || classInput;
    const finalGoal = daily_goal || dailyGoal;

    try {
      // Build dynamic update set
      const profileCheck = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [req.user.userId]);
      if (profileCheck.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      const existing = profileCheck.rows[0];

      const newName = name || existing.name;
      const newAvatar = avatar || existing.avatar;
      const newClass = finalClass ? Number(finalClass) : existing.class_grade;
      const newGoal = finalGoal ? Number(finalGoal) : existing.daily_goal;

      await db.query(
        "UPDATE student_profiles SET name = $1, avatar = $2, class_grade = $3, daily_goal = $4 WHERE user_id = $5",
        [newName, newAvatar, newClass, newGoal, req.user.userId]
      );

      const fullProfile = await getFullUserProfile(req.user.userId);

      res.json({
        message: "Profile updated successfully!",
        profile: fullProfile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating profile settings." });
    }
  },

  // 2. Fetch Student Statistics (Aggregates)
  getStats: async (req, res) => {
    try {
      const fullProfile = await getFullUserProfile(req.user.userId);
      if (!fullProfile) {
        return res.status(404).json({ error: "Student profile not found." });
      }

      res.json({
        profile: fullProfile
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
      await db.query(
        "UPDATE student_profiles SET sound_enabled = $1 WHERE user_id = $2",
        [enabled, req.user.userId]
      );
      const fullProfile = await getFullUserProfile(req.user.userId);
      res.json({ message: "Sound settings updated", profile: fullProfile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  },

  // 4. Toggle Dark Mode Settings
  toggleDarkMode: async (req, res) => {
    const { enabled } = req.body;

    try {
      await db.query(
        "UPDATE student_profiles SET dark_mode = $1 WHERE user_id = $2",
        [enabled, req.user.userId]
      );
      const fullProfile = await getFullUserProfile(req.user.userId);
      res.json({ message: "Theme settings updated", profile: fullProfile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error." });
    }
  }
};


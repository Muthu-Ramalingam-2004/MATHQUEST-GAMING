import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_for_mathquest_game_jwt_tokens";

// Helper function to fetch complete user profile including stats, progress, and badges
export const getFullUserProfile = async (userId) => {
  // 1. Fetch user record
  const userResult = await db.query("SELECT id, email FROM users WHERE id = $1", [userId]);
  if (userResult.rows.length === 0) return null;
  const user = userResult.rows[0];

  // 2. Fetch student profile record
  const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [userId]);
  if (profileResult.rows.length === 0) return null;
  const profile = profileResult.rows[0];

  // 3. Fetch completed chapters progress
  const progressResult = await db.query(
    "SELECT chapter_id, completed_questions, accuracy, times_played FROM student_progress WHERE student_id = $1",
    [profile.id]
  );
  const completedChapters = {};
  progressResult.rows.forEach((row) => {
    completedChapters[row.chapter_id] = {
      completedQuestions: row.completed_questions,
      accuracy: row.accuracy,
      timesPlayed: row.times_played
    };
  });

  // 4. Fetch unlocked badges
  const badgesResult = await db.query(
    "SELECT badge_id FROM student_badges WHERE student_id = $1",
    [profile.id]
  );
  const unlockedBadges = badgesResult.rows.map((row) => row.badge_id);

  return {
    id: profile.id,
    userId: user.id,
    email: user.email,
    name: profile.name,
    avatar: profile.avatar || "bear",
    class: profile.class_grade || 10,
    class_grade: profile.class_grade || 10,
    xp: profile.xp || 0,
    coins: profile.coins || 50,
    level: profile.level || 1,
    streak: profile.streak || 0,
    lastPlayedDate: profile.last_played_date ? new Date(profile.last_played_date).toDateString() : null,
    dailyGoal: profile.daily_goal || 50,
    daily_goal: profile.daily_goal || 50,
    soundEnabled: profile.sound_enabled ?? true,
    darkMode: profile.dark_mode ?? false,
    completedChapters,
    unlockedBadges
  };
};

export const authController = {
  // 1. Register new Student
  register: async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUsername = String(username).trim();

    if (!cleanEmail || !cleanUsername || !password) {
      return res.status(400).json({ error: "Invalid email, username, or password." });
    }

    try {
      // Check if email already registered (case-insensitive)
      const existingEmail = await db.query(
        "SELECT id FROM users WHERE LOWER(TRIM(email)) = $1",
        [cleanEmail]
      );
      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: "Email is already registered." });
      }

      // Check if username already registered (case-insensitive)
      const existingUsername = await db.query(
        "SELECT id FROM student_profiles WHERE LOWER(TRIM(name)) = $1",
        [cleanUsername.toLowerCase()]
      );
      if (existingUsername.rows.length > 0) {
        return res.status(400).json({ error: "Username is already taken. Please choose another." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Create User
      const userResult = await db.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [cleanEmail, hash]
      );
      const user = userResult.rows[0];

      // Create base Student Profile
      await db.query(
        "INSERT INTO student_profiles (user_id, name, avatar, class_grade, daily_goal) VALUES ($1, $2, $3, $4, $5)",
        [user.id, cleanUsername, "bear", 10, 50]
      );

      // Fetch full consolidated profile
      const fullProfile = await getFullUserProfile(user.id);

      // Sign Token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        message: "Registration successful!",
        token,
        user: { id: user.id, email: user.email },
        profile: fullProfile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during registration." });
    }
  },

  // 2. Login Student
  login: async (req, res) => {
    const { email, identifier, username, password } = req.body;
    const rawId = email || identifier || username;

    if (!rawId || !password) {
      return res.status(400).json({ error: "Username/Email and password are required." });
    }

    const cleanId = String(rawId).trim().toLowerCase();

    try {
      // Query matching user candidates ordered by XP and level descending to pick the primary account
      const userResult = await db.query(
        `SELECT u.id, u.email, u.password_hash, COALESCE(sp.xp, 0) as xp, COALESCE(sp.level, 1) as level
         FROM users u 
         LEFT JOIN student_profiles sp ON u.id = sp.user_id 
         WHERE LOWER(TRIM(u.email)) = $1 OR LOWER(TRIM(sp.name)) = $1
         ORDER BY COALESCE(sp.xp, 0) DESC, u.id ASC`,
        [cleanId]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: "Invalid username/email or password." });
      }

      // Verify Password against candidates, selecting the primary matched account
      let matchedUser = null;
      for (const candidate of userResult.rows) {
        const isMatch = await bcrypt.compare(password, candidate.password_hash);
        if (isMatch) {
          matchedUser = candidate;
          break; // First match has highest XP due to ORDER BY
        }
      }

      if (!matchedUser) {
        return res.status(400).json({ error: "Invalid username/email or password." });
      }

      // Fetch Full Profile for persistent database matched user ID
      const fullProfile = await getFullUserProfile(matchedUser.id);

      // Sign Token with exact database user ID
      const token = jwt.sign({ userId: matchedUser.id, email: matchedUser.email }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Login successful!",
        token,
        user: { id: matchedUser.id, email: matchedUser.email },
        profile: fullProfile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during login." });
    }
  },


  // 3. Get Current User and profile
  getMe: async (req, res) => {
    try {
      const fullProfile = await getFullUserProfile(req.user.userId);
      if (!fullProfile) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      res.json({
        user: { id: req.user.userId, email: req.user.email },
        profile: fullProfile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching profile details." });
    }
  },

  // 4. Reset User Password
  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    try {
      const cleanEmail = String(email).trim().toLowerCase();
      // Find User
      const userResult = await db.query(
        "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1",
        [cleanEmail]
      );
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: "No account found with this email address." });
      }
      const user = userResult.rows[0];

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      // Update User Password
      await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, user.id]);

      res.json({
        message: "Password reset successfully. You can now login with your new password."
      });
    } catch (err) {
      console.error("[ERROR] Server error during password reset:", err.message);
      res.status(500).json({ error: "Server error during password reset." });
    }
  }
};


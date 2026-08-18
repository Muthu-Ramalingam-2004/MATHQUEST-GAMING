import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_for_mathquest_game_jwt_tokens";

export const authController = {
  // 1. Register new Student
  register: async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required." });
    }

    try {
      // Check if user already exists
      const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email is already registered." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // Create User
      const userResult = await db.query("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email", [email, hash]);
      const user = userResult.rows[0];

      // Create base Student Profile
      const profileResult = await db.query(
        "INSERT INTO student_profiles (user_id, name, avatar, class_grade, daily_goal) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [user.id, username, "bear", 10, 50]
      );
      const profile = profileResult.rows[0];

      // Sign Token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        message: "Registration successful!",
        token,
        user: { id: user.id, email: user.email },
        profile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during registration." });
    }
  },

  // 2. Login Student
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    try {
      // Find User
      const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: "Invalid email or password credentials." });
      }
      const user = userResult.rows[0];

      // Verify Password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password credentials." });
      }

      // Fetch Profile
      const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [user.id]);
      const profile = profileResult.rows[0];

      // Sign Token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Login successful!",
        token,
        user: { id: user.id, email: user.email },
        profile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error during login." });
    }
  },

  // 3. Get Current User and profile
  getMe: async (req, res) => {
    try {
      const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [req.user.userId]);
      if (profileResult.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      res.json({
        user: { id: req.user.userId, email: req.user.email },
        profile: profileResult.rows[0]
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
      // Find User
      const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
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

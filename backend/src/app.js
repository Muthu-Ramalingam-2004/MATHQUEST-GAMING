import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// API route mappings
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/games", gameRoutes);

// Base ping endpoint
app.get("/", (req, res) => {
  res.json({
    message: "MathQuest REST API is online. Learn Maths. Play. Level Up.",
    version: "1.0.0",
    fullStack: true
  });
});

// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint route not found." });
});

// Global Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke on the server! Global exception caught." });
});

export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { database } from "./config/database.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();

const app = express();

// Configure CORS allowing Vercel deployment URLs and local development
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (server-to-server, health checks, curl, mobile native)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname) ||
        /localhost/.test(origin) ||
        /127\.0\.0\.1/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn(`[CORS WARN] Origin '${origin}' allowed by wildcard fallback.`);
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());


// API route mappings
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/games", gameRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbHealth = await database.checkHealth();
  const isHealthy = dbHealth.status === "connected";
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "UP" : "DOWN",
    server: "online",
    database: dbHealth.status,
    ...(dbHealth.error && { error: dbHealth.error })
  });
});

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

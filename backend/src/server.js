import app from "./app.js";
import { db } from "./config/db.js";
import { initialQuestions } from "./config/seedData.js";

const PORT = process.env.PORT || 5000;

// Initialize and Seed Database memory before listening
try {
  db.seedQuestions(initialQuestions);
} catch (err) {
  console.error("Failed to seed question database on boot:", err);
}

const server = app.listen(PORT, () => {
  console.log(`[SERVER BOOT] MathQuest API Server is running on port ${PORT}`);
  console.log(`[SERVER BOOT] Local URL: http://localhost:${PORT}`);
});

// Clean shut-down handler
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down server gracefully.");
  server.close(() => {
    console.log("Server process terminated.");
  });
});

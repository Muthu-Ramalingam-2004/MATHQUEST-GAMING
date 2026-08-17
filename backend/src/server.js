import app from "./app.js";
import { initializeDatabase } from "./config/dbInit.js";

const PORT = process.env.PORT || 5000;

// Initialize and Seed Database before listening
try {
  await initializeDatabase();
  console.log("[SERVER BOOT] PostgreSQL Database initialized and seeded successfully.");
} catch (err) {
  console.error("==================================================");
  console.error("FATAL DATABASE CONNECTION ERROR ON BOOT:");
  console.error(err);
  console.error("==================================================");
  console.error("Application is shutting down because database integration failed.");
  process.exit(1);
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

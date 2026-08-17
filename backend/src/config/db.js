import { database } from "./database.js";

// Re-export the database connection client to preserve legacy imports
export const db = database;

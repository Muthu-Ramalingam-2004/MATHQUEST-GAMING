import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("[DATABASE BOOT ERROR] DATABASE_URL is not set in environment variables.");
}

// Create a connection pool. Use SSL if we are connecting to a remote host (like Supabase)
const isLocal = !connectionString || connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const poolConfig = {
  connectionString,
  max: 20, // Avoid creating too many connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

if (!isLocal) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new pg.Pool(poolConfig);

// Handle pool errors gracefully to avoid server crashes on sudden disconnects
pool.on("error", (err) => {
  console.error("[DATABASE POOL ERROR] Unexpected error on idle client:", err);
});

export const database = {
  /**
   * Execute a query against the connection pool
   * @param {string} text 
   * @param {any[]} params 
   */
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      // Log queries transparently in development for tracking
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DB QUERY] Executed: ${text.substring(0, 100).replace(/\n/g, " ")}... | Params: ${JSON.stringify(params)} | Duration: ${duration}ms`);
      }
      return res;
    } catch (err) {
      console.error(`[DB QUERY ERROR] Query failed: ${text.substring(0, 100).replace(/\n/g, " ")}... | Error:`, err.message);
      throw err;
    }
  },

  /**
   * Check connection health
   */
  checkHealth: async () => {
    try {
      const client = await pool.connect();
      try {
        await client.query("SELECT 1");
        return { status: "connected" };
      } finally {
        client.release();
      }
    } catch (err) {
      return { status: "disconnected", error: err.message };
    }
  },

  /**
   * Close pool connections gracefully
   */
  close: async () => {
    await pool.end();
  }
};

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { database } from "./database.js";
import { initialQuestions } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  console.log("[DB INIT] Starting database migration and seeding...");
  
  // 1. Run Schema Migration
  try {
    const schemaPath = path.join(__dirname, "..", "models", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    
    await database.query(schemaSql);
    console.log("[DB INIT] Schema migration completed successfully.");
  } catch (err) {
    console.error("[DB INIT ERROR] Failed to run schema migration:", err.message);
    throw err;
  }

  // 2. Seed Questions
  try {
    let seedCount = 0;
    for (const q of initialQuestions) {
      const qOptions = q.options ? JSON.stringify(q.options) : null;
      
      const queryText = `
        INSERT INTO questions (
          id, class_grade, class, chapter_id, chapter, type, question_type, difficulty, 
          question, options, correct_answer, explanation, hint, xp_reward, time_limit
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          class_grade = EXCLUDED.class_grade,
          class = EXCLUDED.class,
          chapter_id = EXCLUDED.chapter_id,
          chapter = EXCLUDED.chapter,
          type = EXCLUDED.type,
          question_type = EXCLUDED.question_type,
          difficulty = EXCLUDED.difficulty,
          question = EXCLUDED.question,
          options = EXCLUDED.options,
          correct_answer = EXCLUDED.correct_answer,
          explanation = EXCLUDED.explanation,
          hint = EXCLUDED.hint,
          xp_reward = EXCLUDED.xp_reward,
          time_limit = EXCLUDED.time_limit;
      `;
      
      const params = [
        q.id,
        Number(q.class),
        Number(q.class),
        q.chapterId,
        q.chapterId,
        q.type,
        q.type,
        q.difficulty,
        q.question,
        qOptions,
        String(q.correctAnswer),
        q.explanation,
        q.hint,
        Number(q.xpReward || 30),
        Number(q.timeLimit || 30)
      ];
      
      await database.query(queryText, params);
      seedCount++;
    }
    
    console.log(`[DB INIT] Idempotently seeded/updated ${seedCount} questions in PostgreSQL.`);
  } catch (err) {
    console.error("[DB INIT ERROR] Failed to seed questions:", err.message);
    throw err;
  }
}

// PostgreSQL/Supabase DB pool connection simulator
import dotenv from "dotenv";
dotenv.config();

// In-Memory Database Seed Cache (Simulates PostgreSQL tables)
const DB_STORE = {
  users: [
    { id: 1, email: "student@mathquest.com", password_hash: "$2a$10$WqBqXb0XG6L4rB4zU8ZtRejCfev/d0FjWvYcQGz8Z6xPzCpe3Qk2u" } // password: password123
  ],
  student_profiles: [
    {
      id: 1,
      user_id: 1,
      name: "MathChampion",
      avatar: "wizard",
      class_grade: 10,
      xp: 450,
      coins: 80,
      level: 2,
      streak: 3,
      last_played_date: new Date().toDateString(),
      daily_goal: 50,
      sound_enabled: true,
      dark_mode: false
    }
  ],
  questions: [], // Seeded during server boot
  game_sessions: [],
  student_progress: {}, // key: "studentId_chapterId" -> progress obj
  student_badges: {} // key: "studentId_badgeId" -> badge obj
};

// Database Query Wrapper API
export const db = {
  // Query helper to mock database calls
  query: async (sqlText, params = []) => {
    // Log the SQL command being executed for transparent full-stack auditing
    console.log(`[DB QUERY] Executing: ${sqlText.substring(0, 120)}... | Params:`, params);

    // Mock query logic matching routes
    // 1. Check user login
    if (sqlText.includes("SELECT * FROM users WHERE email")) {
      const email = params[0];
      const found = DB_STORE.users.find(u => u.email === email);
      return { rows: found ? [found] : [] };
    }

    // 2. Register user
    if (sqlText.includes("INSERT INTO users (email, password_hash)")) {
      const email = params[0];
      const hash = params[1];
      const newUser = { id: DB_STORE.users.length + 1, email, password_hash: hash };
      DB_STORE.users.push(newUser);
      return { rows: [newUser] };
    }

    // 3. Create student profile
    if (sqlText.includes("INSERT INTO student_profiles")) {
      const userId = params[0];
      const name = params[1];
      const avatar = params[2];
      const classGrade = params[3];
      const goal = params[4];
      const newProfile = {
        id: DB_STORE.student_profiles.length + 1,
        user_id: userId,
        name,
        avatar,
        class_grade: Number(classGrade),
        xp: 0,
        coins: 50,
        level: 1,
        streak: 0,
        last_played_date: null,
        daily_goal: Number(goal),
        sound_enabled: true,
        dark_mode: false
      };
      DB_STORE.student_profiles.push(newProfile);
      return { rows: [newProfile] };
    }

    // 4. Get Student Profile
    if (sqlText.includes("SELECT * FROM student_profiles WHERE user_id")) {
      const userId = params[0];
      const found = DB_STORE.student_profiles.find(p => p.user_id === userId);
      return { rows: found ? [found] : [] };
    }

    // 5. Update Student profile stats (XP, Coins, Streaks, etc.)
    if (sqlText.includes("UPDATE student_profiles SET")) {
      // Find by user_id or id
      const profileId = params[params.length - 1]; // Assume last parameter is ID filter
      const index = DB_STORE.student_profiles.findIndex(p => p.id === profileId || p.user_id === profileId);
      if (index !== -1) {
        // Mock update
        const updated = DB_STORE.student_profiles[index];
        // Handle set properties depending on sql parsing
        if (sqlText.includes("xp =") && sqlText.includes("coins =")) {
          updated.xp = params[0];
          updated.coins = params[1];
          updated.level = params[2];
          updated.streak = params[3];
          updated.last_played_date = params[4];
        } else if (sqlText.includes("name =") && sqlText.includes("avatar =")) {
          updated.name = params[0];
          updated.avatar = params[1];
          updated.class_grade = Number(params[2]);
          updated.daily_goal = Number(params[3]);
        } else if (sqlText.includes("sound_enabled =")) {
          updated.sound_enabled = params[0];
        } else if (sqlText.includes("dark_mode =")) {
          updated.dark_mode = params[0];
        }
        return { rows: [updated] };
      }
    }

    // 6. Questions
    if (sqlText.includes("SELECT * FROM questions")) {
      return { rows: DB_STORE.questions };
    }

    if (sqlText.includes("INSERT INTO questions")) {
      const newQ = {
        id: params[0],
        class_grade: params[1],
        chapter_id: params[2],
        type: params[3],
        difficulty: params[4],
        question: params[5],
        options: params[6],
        correct_answer: params[7],
        explanation: params[8],
        hint: params[9],
        xp_reward: params[10],
        time_limit: params[11]
      };
      DB_STORE.questions.push(newQ);
      return { rows: [newQ] };
    }

    if (sqlText.includes("DELETE FROM questions WHERE id =")) {
      const id = params[0];
      DB_STORE.questions = DB_STORE.questions.filter(q => q.id !== id);
      return { rowCount: 1 };
    }

    // Default returns
    return { rows: [] };
  },

  // Seed standard math questions list into DB store
  seedQuestions: (seedList) => {
    DB_STORE.questions = seedList.map(q => ({
      id: q.id,
      class_grade: Number(q.class),
      chapter_id: q.chapterId,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correct_answer: String(q.correctAnswer),
      explanation: q.explanation,
      hint: q.hint,
      xp_reward: Number(q.xpReward || 30),
      time_limit: Number(q.timeLimit || 30)
    }));
    console.log(`[DB SEED] Successfully seeded ${DB_STORE.questions.length} questions into Database memory.`);
  },

  getRawStore: () => DB_STORE
};

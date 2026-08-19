import { db } from "../config/db.js";
import { getFullUserProfile } from "./authController.js";

export const gameController = {
  // 1. Start Game Session
  startGame: async (req, res) => {
    const { chapterId, mode } = req.body;

    try {
      // Fetch student profile using user ID
      const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [req.user.userId]);
      if (profileResult.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      const profile = profileResult.rows[0];

      // Create new session in database
      const sessionResult = await db.query(
        `INSERT INTO game_sessions (student_id, chapter_id, mode, status, started_at)
         VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP)
         RETURNING *`,
        [profile.id, chapterId, mode]
      );
      
      const session = sessionResult.rows[0];
      res.json(session);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error starting session." });
    }
  },

  // 2. Finish Game Session (Level Up check, Streak updates, Badge unlocks)
  finishGame: async (req, res) => {
    const { sessionId, score, totalQuestions, xpEarned, coinsEarned, survived } = req.body;

    try {
      // 1. Fetch profile
      const profileResult = await db.query("SELECT * FROM student_profiles WHERE user_id = $1", [req.user.userId]);
      if (profileResult.rows.length === 0) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      const profile = profileResult.rows[0];

      // 2. Fetch current session and update status
      const sessionResult = await db.query(
        "SELECT * FROM game_sessions WHERE id = $1 AND student_id = $2",
        [Number(sessionId), profile.id]
      );
      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: "Game session not found or access denied." });
      }
      const activeSession = sessionResult.rows[0];

      await db.query(
        `UPDATE game_sessions 
         SET status = 'completed', 
             score = $1, 
             total_questions = $2, 
             xp_earned = $3, 
             coins_earned = $4, 
             ended_at = CURRENT_TIMESTAMP 
         WHERE id = $5`,
        [score, totalQuestions, xpEarned, coinsEarned, Number(sessionId)]
      );

      const accuracy = totalQuestions > 0 ? Math.floor((score / totalQuestions) * 100) : 0;

      // 3. Streak & XP Bonuses calculation
      let finalXp = xpEarned;
      let finalCoins = coinsEarned;
      let newStreakValue = profile.streak || 0;
      let streakBonusApplied = false;

      if (survived && score > 0) {
        const todayStr = new Date().toDateString();
        const lastPlayedStr = profile.last_played_date ? new Date(profile.last_played_date).toDateString() : null;

        if (lastPlayedStr !== todayStr) {
          newStreakValue += 1;
          finalXp += 20; // +20 XP streak bonus
          finalCoins += 10; // +10 coins bonus
          streakBonusApplied = true;
        }
      }

      // Calculate levels
      const oldLevel = profile.level;
      const gainedXp = survived ? finalXp : Math.floor(finalXp / 3);
      const gainedCoins = survived ? finalCoins : 5;
      
      const newXP = (profile.xp || 0) + gainedXp;
      const newCoins = (profile.coins || 0) + gainedCoins;
      const newLevel = Math.floor(newXP / 300) + 1;
      const didLevelUp = newLevel > oldLevel;

      // Update Student profile in database
      await db.query(
        `UPDATE student_profiles 
         SET xp = $1, coins = $2, level = $3, streak = $4, last_played_date = CURRENT_DATE 
         WHERE id = $5`,
        [newXP, newCoins, newLevel, newStreakValue, profile.id]
      );

      // 4. Check badge unlocks dynamically
      const badgesUnlocked = [];
      const studentId = profile.id;

      const unlockBadge = async (badgeId) => {
        const checkResult = await db.query(
          "SELECT 1 FROM student_badges WHERE student_id = $1 AND badge_id = $2",
          [studentId, badgeId]
        );
        if (checkResult.rows.length === 0) {
          await db.query(
            "INSERT INTO student_badges (student_id, badge_id) VALUES ($1, $2)",
            [studentId, badgeId]
          );
          badgesUnlocked.push(badgeId);
        }
      };

      if (survived) {
        await unlockBadge("first-victory");
        if (accuracy === 100) await unlockBadge("perfect-score");
        if (newLevel >= 2) await unlockBadge("math-starter");
        if (newStreakValue >= 7) await unlockBadge("streak-hero");
        
        // Algebra Ace check
        if (activeSession && (activeSession.chapter_id === "algebra-9" || activeSession.chapter_id === "algebra-10") && accuracy === 100) {
          await unlockBadge("algebra-ace");
        }
      }

      // 5. Save Chapter progress in database
      if (activeSession) {
        await db.query(
          `INSERT INTO student_progress (student_id, chapter_id, completed_questions, accuracy, times_played)
           VALUES ($1, $2, $3, $4, 1)
           ON CONFLICT (student_id, chapter_id)
           DO UPDATE SET 
             completed_questions = student_progress.completed_questions + EXCLUDED.completed_questions,
             accuracy = GREATEST(student_progress.accuracy, EXCLUDED.accuracy),
             times_played = student_progress.times_played + 1,
             updated_at = CURRENT_TIMESTAMP`,
          [studentId, activeSession.chapter_id, score, accuracy]
        );
      }

      // Fetch authoritative updated profile from PostgreSQL
      const updatedProfile = await getFullUserProfile(req.user.userId);

      res.json({
        message: "Level completed successfully!",
        score,
        totalQuestions,
        accuracy,
        xpEarned: gainedXp,
        coinsEarned: gainedCoins,
        survived,
        didLevelUp,
        newLevel,
        streakBonusApplied,
        badgesUnlocked,
        profile: updatedProfile
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error finalizing game results." });
    }
  }
};


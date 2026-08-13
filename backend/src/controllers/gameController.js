import { db } from "../config/db.js";

export const gameController = {
  // 1. Start Game Session
  startGame: async (req, res) => {
    const { chapterId, mode } = req.body;

    try {
      const rawStore = db.getRawStore();
      const profile = rawStore.student_profiles.find(p => p.user_id === req.user.userId);
      if (!profile) {
        return res.status(404).json({ error: "Student profile not found." });
      }

      const session = {
        id: rawStore.game_sessions.length + 1,
        student_id: profile.id,
        chapter_id: chapterId,
        mode,
        score: 0,
        total_questions: 0,
        xp_earned: 0,
        coins_earned: 0,
        status: "active",
        started_at: new Date().toISOString()
      };

      rawStore.game_sessions.push(session);
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
      const rawStore = db.getRawStore();
      
      // Fetch profile
      const profileIndex = rawStore.student_profiles.findIndex(p => p.user_id === req.user.userId);
      if (profileIndex === -1) {
        return res.status(404).json({ error: "Student profile not found." });
      }
      const profile = rawStore.student_profiles[profileIndex];

      // Update session status
      const sessionIndex = rawStore.game_sessions.findIndex(s => s.id === Number(sessionId));
      if (sessionIndex !== -1) {
        rawStore.game_sessions[sessionIndex].status = "completed";
        rawStore.game_sessions[sessionIndex].score = score;
        rawStore.game_sessions[sessionIndex].total_questions = totalQuestions;
        rawStore.game_sessions[sessionIndex].xp_earned = xpEarned;
        rawStore.game_sessions[sessionIndex].coins_earned = coinsEarned;
        rawStore.game_sessions[sessionIndex].ended_at = new Date().toISOString();
      }

      const accuracy = totalQuestions > 0 ? Math.floor((score / totalQuestions) * 100) : 0;

      // Streak & XP Bonuses
      let finalXp = xpEarned;
      let finalCoins = coinsEarned;
      let newStreakValue = profile.streak || 0;
      let streakBonusApplied = false;

      if (survived && score > 0) {
        const todayStr = new Date().toDateString();
        const lastPlayedStr = profile.last_played_date;

        if (lastPlayedStr !== todayStr) {
          newStreakValue += 1;
          finalXp += 20; // +20 XP streak bonus
          finalCoins += 10; // +10 coins bonus
          streakBonusApplied = true;
        }
      }

      // Calculate levels
      const oldLevel = profile.level;
      const newXP = profile.xp + (survived ? finalXp : Math.floor(finalXp / 3));
      const newCoins = profile.coins + (survived ? finalCoins : 5);
      const newLevel = Math.floor(newXP / 300) + 1;
      const didLevelUp = newLevel > oldLevel;

      // Update Student profile in database memory
      profile.xp = newXP;
      profile.coins = newCoins;
      profile.level = newLevel;
      profile.streak = newStreakValue;
      profile.last_played_date = new Date().toDateString();

      // Check badges unlocks
      const badgesUnlocked = [];
      const studentId = profile.id;

      const unlockBadge = (badgeId) => {
        const key = `${studentId}_${badgeId}`;
        if (!rawStore.student_badges[key]) {
          rawStore.student_badges[key] = { id: Object.keys(rawStore.student_badges).length + 1, student_id: studentId, badge_id: badgeId, unlocked_at: new Date().toISOString() };
          badgesUnlocked.push(badgeId);
        }
      };

      if (survived) {
        unlockBadge("first-victory");
        if (accuracy === 100) unlockBadge("perfect-score");
        if (newLevel >= 2) unlockBadge("math-starter");
        if (newStreakValue >= 7) unlockBadge("streak-hero");
        
        // Algebra Ace check
        const activeSession = rawStore.game_sessions.find(s => s.id === Number(sessionId));
        if (activeSession && (activeSession.chapter_id === "algebra-9" || activeSession.chapter_id === "algebra-10") && accuracy === 100) {
          unlockBadge("algebra-ace");
        }
      }

      // Save Chapter progress
      if (activeSession) {
        const progressKey = `${studentId}_${activeSession.chapter_id}`;
        const prevProgress = rawStore.student_progress[progressKey] || { completed_questions: 0, accuracy: 0, times_played: 0 };
        
        rawStore.student_progress[progressKey] = {
          student_id: studentId,
          chapter_id: activeSession.chapter_id,
          completed_questions: prevProgress.completed_questions + score,
          accuracy: Math.max(prevProgress.accuracy, accuracy),
          times_played: prevProgress.times_played + 1
        };
      }

      res.json({
        message: "Level completed successfully!",
        score,
        totalQuestions,
        accuracy,
        xpEarned: survived ? finalXp : Math.floor(finalXp / 3),
        coinsEarned: survived ? finalCoins : 5,
        survived,
        didLevelUp,
        newLevel,
        streakBonusApplied,
        badgesUnlocked
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error finalizing game results." });
    }
  }
};

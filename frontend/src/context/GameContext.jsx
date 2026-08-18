import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService } from "../services/storageService";
import { questionService } from "../services/questionService";
import { authService } from "../services/authService";
import { gameService } from "../services/gameService";
import { progressService } from "../services/progressService";
import { getOfflineStatus, setOfflineStatus } from "../services/api";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameSession, setGameSession] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [offlineMode, setOfflineMode] = useState(getOfflineStatus());

  // Listen to connection drops and switch state
  useEffect(() => {
    const handleOffline = () => {
      setOfflineMode(true);
      setOfflineStatus(true);
      showToast("Express server offline. Resilient Offline Simulator active!", "warning");
    };
    window.addEventListener("api-offline-triggered", handleOffline);
    return () => window.removeEventListener("api-offline-triggered", handleOffline);
  }, []);

  // Initialize Session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Try requesting user profile from JWT
        const token = localStorage.getItem("mathquest_token");
        if (token) {
          const data = await authService.getMe();
          setUser(data.profile);
          setOfflineMode(false);
          setOfflineStatus(false);
        } else {
          // Fallback to local storage profile if no token
          const localProfile = storageService.getUserProfile();
          if (localProfile) {
            setUser(checkStreak(localProfile));
          }
        }
      } catch (err) {
        // If server is down, fallback to local storage profile
        const localProfile = storageService.getUserProfile();
        if (localProfile) {
          setUser(checkStreak(localProfile));
        }
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Show Toast (pass null to dismiss)
  const showToast = (message, type = "info") => {
    if (message === null || message === undefined) {
      setActiveToast(null);
      return;
    }
    setActiveToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Streak checker
  const checkStreak = (profile) => {
    if (!profile.lastPlayedDate) return profile;
    const todayStr = new Date().toDateString();
    const lastPlayed = new Date(profile.lastPlayedDate);
    const today = new Date();
    lastPlayed.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil(Math.abs(today - lastPlayed) / (1000 * 60 * 60 * 24));
    let updated = { ...profile };
    if (diffDays > 1) {
      updated.streak = 0;
    }
    return updated;
  };

  // Auth Operations
  const loginUser = async (emailOrName, password, mode = "login", username = "") => {
    setLoading(true);
    
    // Offline Bypass Mode
    if (offlineMode) {
      const existing = storageService.getUserProfile();
      const mockProfile = {
        name: emailOrName.split("@")[0],
        avatar: "bear",
        class: 10,
        xp: existing ? existing.xp : 0,
        coins: existing ? existing.coins : 50,
        level: existing ? existing.level : 1,
        streak: existing ? existing.streak : 0,
        lastPlayedDate: existing ? existing.lastPlayedDate : null,
        dailyGoal: 50,
        unlockedBadges: existing ? existing.unlockedBadges : [],
        soundEnabled: true,
        darkMode: false,
        completedChapters: {}
      };
      setUser(mockProfile);
      storageService.saveUserProfile(mockProfile);
      setLoading(false);
      showToast(`Welcome (Offline Sim), ${mockProfile.name}!`, "success");
      return true;
    }

    try {
      let data;
      if (mode === "register") {
        data = await authService.register(emailOrName, username, password);
      } else {
        data = await authService.login(emailOrName, password);
      }
      
      setUser(data.profile);
      storageService.saveUserProfile(data.profile); // Sync local mirror
      showToast(`Successfully logged in as ${data.profile.name}!`, "success");
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      showToast(err.message || "Authentication failed.", "error");
      return false;
    }
  };

  const logoutUser = () => {
    setUser(null);
    authService.logout();
    storageService.clearUserProfile();
    showToast("Logged out successfully.", "info");
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    
    const localUpdated = { ...user, ...updates };
    setUser(localUpdated);
    storageService.saveUserProfile(localUpdated);

    if (!offlineMode) {
      try {
        await progressService.updateProfile({
          name: localUpdated.name,
          avatar: localUpdated.avatar,
          class_grade: localUpdated.class,
          daily_goal: localUpdated.dailyGoal
        });
      } catch (err) {
        console.error("Failed to sync profile update with backend:", err);
      }
    }
  };

  const calculateLevelInfo = (xp) => {
    const xpPerLevel = 300;
    const currentLevel = Math.floor(xp / xpPerLevel) + 1;
    const nextLevelXP = currentLevel * xpPerLevel;
    const prevLevelXP = (currentLevel - 1) * xpPerLevel;
    const progressXP = xp - prevLevelXP;
    const percentage = Math.min(100, Math.floor((progressXP / xpPerLevel) * 100));

    return {
      level: currentLevel,
      xpForNextLevel: nextLevelXP,
      progressXP,
      xpPerLevel,
      percentage
    };
  };

  // Start Gameplay Session
  const startNewGame = async (classId, chapterId, mode, customQuestions = null) => {
    let questionsList = [];

    if (customQuestions) {
      questionsList = customQuestions;
    } else {
      if (offlineMode) {
        console.log(`[GameContext] Offline mode â€” loading local questions for class=${classId} chapter=${chapterId} mode=${mode}`);
        questionsList = questionService.getQuestionsForGameplay(classId, chapterId, mode);
        console.log(`[GameContext] Local fallback returned ${questionsList.length} questions`);
      } else {
        try {
          console.log(`[GameContext] Fetching questions from API: classGrade=${classId} chapterId=${chapterId}`);
          const result = await gameService.getQuestions(classId, chapterId);
          console.log(`[GameContext] API returned ${Array.isArray(result) ? result.length : 0} questions for chapter "${chapterId}"`);
          
          if (Array.isArray(result) && result.length > 0) {
            // Shuffling logic
            const shuffled = [...result].sort(() => Math.random() - 0.5);
            questionsList = mode === "quick-quiz" || mode === "math-run" || mode === "challenge" 
              ? shuffled.slice(0, 5) 
              : mode === "math-puzzle" 
              ? shuffled.slice(0, 3) 
              : shuffled;
            console.log(`[GameContext] After mode (${mode}) slicing: ${questionsList.length} questions will be used`);
          } else {
            console.warn(`[GameContext] API returned 0 questions. Falling back to local questions.`);
            questionsList = questionService.getQuestionsForGameplay(classId, chapterId, mode);
          }
        } catch (err) {
          console.warn(`[GameContext] API fetch failed (${err.message}). Falling back to local questions.`);
          // Fallback to local questions if fetch fails
          questionsList = questionService.getQuestionsForGameplay(classId, chapterId, mode);
          console.log(`[GameContext] Local fallback returned ${questionsList.length} questions for chapter "${chapterId}"`);
        }
      }
    }

    if (!questionsList || questionsList.length === 0) {
      console.error(`[GameContext] No questions found for class=${classId} chapter="${chapterId}" mode=${mode}`);
      showToast("No questions found for this topic chapter", "warning");
      setGameSession({
        id: Date.now(),
        isActive: false,
        mode,
        chapterId,
        class: Number(classId),
        questions: [],
        currentIndex: 0,
        score: 0,
        xpEarned: 0,
        coinsEarned: 0,
        lives: 3,
        maxLives: 3,
        answersLog: [],
        startTime: Date.now()
      });
      return false;
    }

    console.log(`[GameContext] Starting game: class=${classId} chapter="${chapterId}" mode=${mode} questions=${questionsList.length}`);

    const defaultLives = (mode === "practice" || mode === "math-puzzle") ? 99 : 3;

    // Start Session on server
    let sessionId = Date.now();
    if (!offlineMode) {
      try {
        const sessionResult = await gameService.startSession(chapterId, mode);
        sessionId = sessionResult.id;
      } catch (err) {
        console.error("Failed to register game session on backend:", err);
      }
    }

    setGameSession({
      id: sessionId,
      isActive: true,
      mode,
      chapterId,
      class: Number(classId),
      questions: questionsList,
      currentIndex: 0,
      score: 0,
      xpEarned: 0,
      coinsEarned: 0,
      lives: defaultLives,
      maxLives: defaultLives === 99 ? 99 : 3,
      answersLog: [],
      startTime: Date.now()
    });

    return true;
  };

  // Submit Answer
  const submitAnswer = async (selectedAnswer, isTimedOut = false, timeSpent = 0) => {
    if (!gameSession || !gameSession.questions || !gameSession.questions[gameSession.currentIndex]) {
      return {
        isCorrect: false,
        correctAnswer: "",
        explanation: "",
        hint: "",
        xpReward: 0,
        coinsReward: 0
      };
    }

    const currentQuestion = gameSession.questions[gameSession.currentIndex];
    
    // Server validation check
    let isCorrect = false;
    let correctAnswer = currentQuestion.correctAnswer || currentQuestion.correct_answer || "";
    let explanation = currentQuestion.explanation || "";
    let hint = currentQuestion.hint || "";
    let xpReward = currentQuestion.xpReward || currentQuestion.xp_reward || 20;
    
    if (offlineMode) {
      // Local verification
      if (!isTimedOut) {
        if (currentQuestion.type === "mcq" || currentQuestion.type === "boolean") {
          isCorrect = String(selectedAnswer) === String(correctAnswer);
        } else if (currentQuestion.type === "numerical") {
          isCorrect = String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
        }
      }
    } else {
      try {
        const valResult = await gameService.validateAnswer(currentQuestion.id, selectedAnswer);
        isCorrect = Boolean(valResult?.isCorrect);
        if (valResult?.correctAnswer !== undefined) correctAnswer = valResult.correctAnswer;
        if (valResult?.explanation) explanation = valResult.explanation;
        if (valResult?.hint) hint = valResult.hint;
        if (valResult?.xpReward !== undefined) xpReward = valResult.xpReward;
      } catch (err) {
        // Fallback to local verification if network fails
        if (!isTimedOut) {
          if (currentQuestion.type === "mcq" || currentQuestion.type === "boolean") {
            isCorrect = String(selectedAnswer) === String(correctAnswer);
          } else if (currentQuestion.type === "numerical") {
            isCorrect = String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
          }
        }
      }
    }

    // Reward calculations
    let coinsReward = isCorrect ? 5 : 0;
    let actualXpReward = isCorrect ? xpReward : 0;

    if (isCorrect && gameSession.mode === "challenge") {
      actualXpReward *= 2;
      coinsReward *= 2;
    }

    const newLives = isCorrect ? gameSession.lives : Math.max(0, gameSession.lives - 1);

    const updatedSession = {
      ...gameSession,
      score: isCorrect ? gameSession.score + 1 : gameSession.score,
      lives: newLives,
      xpEarned: gameSession.xpEarned + actualXpReward,
      coinsEarned: gameSession.coinsEarned + coinsReward,
      answersLog: [
        ...(gameSession.answersLog || []),
        {
          questionId: currentQuestion.id,
          correct: isCorrect,
          selectedAnswer,
          timeSpent,
          isTimedOut
        }
      ]
    };

    setGameSession(updatedSession);
    return {
      isCorrect,
      correctAnswer,
      explanation,
      hint,
      xpReward: actualXpReward,
      coinsReward
    };
  };

  // Move forward
  const nextQuestion = async () => {
    if (!gameSession) return false;
    const nextIndex = gameSession.currentIndex + 1;
    const isGameOver = gameSession.lives <= 0 || nextIndex >= gameSession.questions.length;
    if (isGameOver) {
      const results = await finishGame();
      return results;
    } else {
      setGameSession({ ...gameSession, currentIndex: nextIndex });
      return true;
    }
  };

  // Complete game session
  const finishGame = async () => {
    if (!gameSession) return null;

    const timeTaken = Math.floor((Date.now() - gameSession.startTime) / 1000);
    const survived = gameSession.lives > 0;
    const accuracy = gameSession.questions.length > 0 ? Math.floor((gameSession.score / gameSession.questions.length) * 100) : 0;

    let sessionResults;

    const processLocalFinish = () => {
      let finalXp = gameSession.xpEarned;
      let finalCoins = gameSession.coinsEarned;
      let newStreakValue = user?.streak || 0;
      
      if (survived && gameSession.score > 0 && user) {
        const todayStr = new Date().toDateString();
        if (user.lastPlayedDate !== todayStr) {
          newStreakValue += 1;
          finalXp += 20;
          finalCoins += 10;
        }
      }

      const currentXP = user?.xp || 0;
      const currentCoins = user?.coins || 0;
      const currentLevel = user?.level || 1;

      const newXP = currentXP + (survived ? finalXp : Math.floor(finalXp / 3));
      const newCoins = currentCoins + (survived ? finalCoins : 5);
      const levelInfo = calculateLevelInfo(newXP);
      const didLevelUp = levelInfo.level > currentLevel;

      const earnedBadges = [...(user?.unlockedBadges || [])];
      if (survived) {
        if (!earnedBadges.includes("first-victory")) earnedBadges.push("first-victory");
        if (accuracy === 100 && !earnedBadges.includes("perfect-score")) earnedBadges.push("perfect-score");
        if (didLevelUp && levelInfo.level >= 2 && !earnedBadges.includes("math-starter")) earnedBadges.push("math-starter");
      }

      const completed = { ...(user?.completedChapters || {}) };
      completed[gameSession.chapterId] = {
        completedQuestions: (completed[gameSession.chapterId]?.completedQuestions || 0) + gameSession.score,
        accuracy: Math.max((completed[gameSession.chapterId]?.accuracy || 0), accuracy),
        timesPlayed: (completed[gameSession.chapterId]?.timesPlayed || 0) + 1
      };

      const updatedProfile = {
        ...(user || {}),
        xp: newXP,
        coins: newCoins,
        level: levelInfo.level,
        streak: newStreakValue,
        lastPlayedDate: new Date().toDateString(),
        unlockedBadges: earnedBadges,
        completedChapters: completed
      };

      setUser(updatedProfile);
      storageService.saveUserProfile(updatedProfile);

      return {
        score: gameSession.score,
        totalQuestions: gameSession.questions.length,
        accuracy,
        xpEarned: survived ? finalXp : Math.floor(finalXp / 3),
        coinsEarned: survived ? finalCoins : 5,
        timeTaken,
        survived,
        didLevelUp,
        newLevel: levelInfo.level,
        newBadges: earnedBadges.filter(b => !(user?.unlockedBadges || []).includes(b))
      };
    };

    if (offlineMode) {
      sessionResults = processLocalFinish();
    } else {
      try {
        const response = await gameService.finishSession({
          sessionId: gameSession.id,
          score: gameSession.score,
          totalQuestions: gameSession.questions.length,
          xpEarned: gameSession.xpEarned,
          coinsEarned: gameSession.coinsEarned,
          survived
        });

        const freshProfile = {
          ...(user || {}),
          xp: (user?.xp || 0) + (response.xpEarned || 0),
          coins: (user?.coins || 0) + (response.coinsEarned || 0),
          level: response.newLevel || user?.level || 1,
          streak: response.newStreakValue || user?.streak || 0,
          lastPlayedDate: new Date().toDateString(),
          completedChapters: {
            ...(user?.completedChapters || {}),
            [gameSession.chapterId]: {
              completedQuestions: ((user?.completedChapters?.[gameSession.chapterId]?.completedQuestions) || 0) + (response.score || 0),
              accuracy: Math.max((user?.completedChapters?.[gameSession.chapterId]?.accuracy || 0), response.accuracy || 0),
              timesPlayed: ((user?.completedChapters?.[gameSession.chapterId]?.timesPlayed) || 0) + 1
            }
          }
        };
        
        setUser(freshProfile);
        storageService.saveUserProfile(freshProfile);
        
        sessionResults = {
          score: response.score,
          totalQuestions: response.totalQuestions,
          accuracy: response.accuracy,
          xpEarned: response.xpEarned,
          coinsEarned: response.coinsEarned,
          timeTaken,
          survived: response.survived,
          didLevelUp: response.didLevelUp,
          newLevel: response.newLevel,
          newBadges: response.badgesUnlocked || []
        };
      } catch (err) {
        console.warn("Backend finishSession failed, processing local finish:", err);
        sessionResults = processLocalFinish();
      }
    }

    setGameSession(null);
    return sessionResults;
  };

  const forceQuitGame = () => {
    setGameSession(null);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        loading,
        gameSession,
        activeToast,
        offlineMode,
        showToast,
        loginUser,
        logoutUser,
        updateUserProfile,
        calculateLevelInfo,
        startNewGame,
        submitAnswer,
        nextQuestion,
        finishGame,
        forceQuitGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

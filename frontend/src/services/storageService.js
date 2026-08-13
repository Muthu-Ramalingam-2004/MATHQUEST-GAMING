// LocalStorage Persistent Database Simulator

const KEYS = {
  PROFILE: "mathquest_profile",
  QUESTIONS: "mathquest_questions",
  PROGRESS: "mathquest_progress",
  LEADERBOARD: "mathquest_leaderboard"
};

// Seed leaderboard data to give a competitive context
const MOCK_LEADERBOARD = [
  { rank: 1, name: "Aryabhata_Pro", avatar: "wizard", xp: 4850, level: 10, isMock: true },
  { rank: 2, name: "NewtonForce", avatar: "robot", xp: 3900, level: 8, isMock: true },
  { rank: 3, name: "RamanujanFan", avatar: "ninja", xp: 3750, level: 8, isMock: true },
  { rank: 4, name: "EulerMaths", avatar: "astronaut", xp: 2900, level: 6, isMock: true },
  { rank: 5, name: "HypatiaSigma", avatar: "scientist", xp: 2550, level: 6, isMock: true },
  { rank: 6, name: "GaussCurves", avatar: "monster", xp: 1800, level: 4, isMock: true },
  { rank: 7, name: "PythagorasTriangle", avatar: "cat", xp: 1200, level: 3, isMock: true },
];

export const storageService = {
  // --- Profile CRUD ---
  getUserProfile: () => {
    const profile = localStorage.getItem(KEYS.PROFILE);
    return profile ? JSON.parse(profile) : null;
  },

  saveUserProfile: (profile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    storageService.syncUserWithLeaderboard(profile);
  },

  clearUserProfile: () => {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.PROGRESS);
  },

  // --- Questions CRUD ---
  getQuestions: (fallbackQuestions = []) => {
    const questions = localStorage.getItem(KEYS.QUESTIONS);
    if (!questions) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(fallbackQuestions));
      return fallbackQuestions;
    }
    return JSON.parse(questions);
  },

  saveQuestions: (questions) => {
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  },

  // --- Progress Tracking ---
  getProgress: () => {
    const progress = localStorage.getItem(KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : {};
  },

  saveProgress: (progress) => {
    localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
  },

  // --- Dynamic Leaderboard Sync ---
  getLeaderboard: () => {
    const cached = localStorage.getItem(KEYS.LEADERBOARD);
    let board = cached ? JSON.parse(cached) : [...MOCK_LEADERBOARD];
    
    // Sort descending by XP and update ranks
    board.sort((a, b) => b.xp - a.xp);
    board = board.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(board));
    return board;
  },

  syncUserWithLeaderboard: (profile) => {
    if (!profile) return;
    let board = storageService.getLeaderboard();
    
    // Find or add user
    const userIndex = board.findIndex(item => !item.isMock);
    const userEntry = {
      rank: 99,
      name: profile.name || "Student Champion",
      avatar: profile.avatar || "bear",
      xp: profile.xp || 0,
      level: profile.level || 1,
      isMock: false
    };

    if (userIndex !== -1) {
      board[userIndex] = userEntry;
    } else {
      board.push(userEntry);
    }
    
    // Resort & save
    board.sort((a, b) => b.xp - a.xp);
    board = board.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(board));
  }
};

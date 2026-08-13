// Question Bank REST API Simulator
import { initialQuestions } from "../data/chaptersData";
import { storageService } from "./storageService";

export const questionService = {
  // Fetch all active questions
  getAllQuestions: () => {
    return storageService.getQuestions(initialQuestions);
  },

  // Get questions filtered by grade and chapter
  getQuestionsForGameplay: (classId, chapterId, mode) => {
    const all = questionService.getAllQuestions();
    const filtered = all.filter(
      q => Number(q.class) === Number(classId) && q.chapterId === chapterId
    );

    // If game mode is PracticeMode, shuffle and slice
    // If ChallengeMode, we can sort by difficulty or increase multipliers
    // Let's randomize the order to keep the game fun!
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    // For QuickQuiz or standard levels, return up to 5 questions
    if (mode === "quick-quiz") {
      return shuffled.slice(0, 5);
    }
    if (mode === "math-run") {
      return shuffled.slice(0, 5); // 5 stages to run
    }
    if (mode === "challenge") {
      // Filter for medium/hard questions if available
      const hard = shuffled.filter(q => q.difficulty === "Hard" || q.difficulty === "Medium");
      return (hard.length > 0 ? hard : shuffled).slice(0, 5);
    }
    if (mode === "math-puzzle") {
      return shuffled.slice(0, 3); // 3 stages of puzzles
    }

    // Default practice
    return shuffled;
  },

  // Fetch daily challenge (a deterministic question of the day)
  getDailyChallenge: (classId) => {
    const all = questionService.getAllQuestions();
    const gradeQuestions = all.filter(q => Number(q.class) === Number(classId));
    if (gradeQuestions.length === 0) return null;
    
    // Seed by today's date
    const day = new Date().getDate();
    const index = day % gradeQuestions.length;
    const baseQuestion = gradeQuestions[index];
    
    // Return with double XP and Coins
    return {
      ...baseQuestion,
      isDailyChallenge: true,
      xpReward: baseQuestion.xpReward * 2,
      coinReward: 30 // Bonus coins
    };
  },

  // Admin actions: Add a new question
  addQuestion: (newQuestion) => {
    const questions = questionService.getAllQuestions();
    const formatted = {
      ...newQuestion,
      id: `q-custom-${Date.now()}`,
      class: Number(newQuestion.class),
      xpReward: Number(newQuestion.xpReward || 30),
      timeLimit: Number(newQuestion.timeLimit || 30)
    };
    questions.push(formatted);
    storageService.saveQuestions(questions);
    return formatted;
  },

  // Admin actions: Edit an existing question
  updateQuestion: (updatedQuestion) => {
    const questions = questionService.getAllQuestions();
    const index = questions.findIndex(q => q.id === updatedQuestion.id);
    if (index !== -1) {
      questions[index] = {
        ...updatedQuestion,
        class: Number(updatedQuestion.class),
        xpReward: Number(updatedQuestion.xpReward),
        timeLimit: Number(updatedQuestion.timeLimit)
      };
      storageService.saveQuestions(questions);
      return true;
    }
    return false;
  },

  // Admin actions: Delete a question
  deleteQuestion: (id) => {
    const questions = questionService.getAllQuestions();
    const filtered = questions.filter(q => q.id !== id);
    storageService.saveQuestions(filtered);
    return true;
  },

  // Reset to initial questions
  resetToDefault: () => {
    storageService.saveQuestions(initialQuestions);
    return initialQuestions;
  }
};

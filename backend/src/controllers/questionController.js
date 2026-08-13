import { db } from "../config/db.js";

export const questionController = {
  // 1. Fetch Questions filtered by class and chapter
  getQuestions: async (req, res) => {
    const { classGrade, chapterId, difficulty } = req.query;

    try {
      const result = await db.query("SELECT * FROM questions");
      let list = result.rows;

      if (classGrade) {
        list = list.filter(q => Number(q.class_grade) === Number(classGrade));
      }
      if (chapterId) {
        list = list.filter(q => q.chapter_id === chapterId);
      }
      if (difficulty) {
        list = list.filter(q => q.difficulty === difficulty);
      }

      res.json(list);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error fetching questions." });
    }
  },

  // 2. Validate Question Answer (Cheat-Proof verification)
  validateAnswer: async (req, res) => {
    const { questionId, selectedAnswer } = req.body;

    if (!questionId) {
      return res.status(400).json({ error: "Question ID is required for verification." });
    }

    try {
      const result = await db.query("SELECT * FROM questions");
      const question = result.rows.find(q => q.id === questionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      let isCorrect = false;
      if (question.type === "mcq" || question.type === "boolean") {
        isCorrect = String(selectedAnswer) === String(question.correct_answer);
      } else if (question.type === "numerical") {
        const cleanedUser = String(selectedAnswer).trim().toLowerCase();
        const cleanedCorrect = String(question.correct_answer).trim().toLowerCase();
        isCorrect = cleanedUser === cleanedCorrect;
      }

      res.json({
        isCorrect,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
        hint: question.hint,
        xpReward: question.xp_reward || 20
      });
    } catch (err) {
      console.error(err);
      res.status(555).json({ error: "Server error during answer verification." });
    }
  },

  // 3. Admin: Create Question
  createQuestion: async (req, res) => {
    const { 
      classGrade, 
      chapterId, 
      type, 
      difficulty, 
      question, 
      options, 
      correctAnswer, 
      explanation, 
      hint, 
      xpReward, 
      timeLimit 
    } = req.body;

    const id = `q-custom-${Date.now()}`;

    try {
      const result = await db.query(
        "INSERT INTO questions (id, class_grade, chapter_id, type, difficulty, question, options, correct_answer, explanation, hint, xp_reward, time_limit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        [
          id, 
          Number(classGrade), 
          chapterId, 
          type, 
          difficulty, 
          question, 
          options ? JSON.stringify(options) : null, 
          String(correctAnswer), 
          explanation, 
          hint, 
          Number(xpReward || 30), 
          Number(timeLimit || 30)
        ]
      );
      res.status(201).json({ message: "Question created successfully!", question: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error creating question." });
    }
  },

  // 4. Admin: Update Question
  updateQuestion: async (req, res) => {
    const { id } = req.params;
    const { 
      classGrade, 
      chapterId, 
      type, 
      difficulty, 
      question, 
      options, 
      correctAnswer, 
      explanation, 
      hint, 
      xpReward, 
      timeLimit 
    } = req.body;

    try {
      // Find question and replace in cache / database
      const rawStore = db.getRawStore();
      const index = rawStore.questions.findIndex(q => q.id === id);

      if (index === -1) {
        return res.status(404).json({ error: "Question not found in database." });
      }

      rawStore.questions[index] = {
        id,
        class_grade: Number(classGrade),
        chapter_id: chapterId,
        type,
        difficulty,
        question,
        options,
        correct_answer: String(correctAnswer),
        explanation,
        hint,
        xp_reward: Number(xpReward),
        time_limit: Number(timeLimit)
      };

      res.json({ message: "Question updated successfully!", question: rawStore.questions[index] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating question." });
    }
  },

  // 5. Admin: Delete Question
  deleteQuestion: async (req, res) => {
    const { id } = req.params;

    try {
      await db.query("DELETE FROM questions WHERE id = $1", [id]);
      res.json({ message: "Question deleted successfully from curriculum." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error deleting question." });
    }
  }
};

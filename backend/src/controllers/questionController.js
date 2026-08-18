import { db } from "../config/db.js";

export const questionController = {
  // 1. Fetch Questions filtered by class and chapter
  getQuestions: async (req, res) => {
    const { classGrade, chapterId, difficulty } = req.query;

    try {
      let query = "SELECT * FROM questions WHERE 1=1";
      const params = [];
      let paramIdx = 1;

      if (classGrade) {
        query += ` AND (class_grade = $${paramIdx} OR class = $${paramIdx})`;
        params.push(Number(classGrade));
        paramIdx++;
      }
      if (chapterId) {
        query += ` AND (chapter_id = $${paramIdx} OR chapter = $${paramIdx})`;
        params.push(chapterId);
        paramIdx++;
      }
      if (difficulty) {
        query += ` AND difficulty = $${paramIdx}`;
        params.push(difficulty);
        paramIdx++;
      }

      query += " ORDER BY id ASC";

      const result = await db.query(query, params);
      
      // Format questions for maximum frontend compatibility (mapping both snake_case and camelCase options)
      const formatted = result.rows.map(q => {
        let opts = q.options;
        if (typeof opts === "string") {
          try {
            opts = JSON.parse(opts);
          } catch (e) {
            opts = [];
          }
        }
        return {
          ...q,
          class: q.class_grade || q.class,
          class_grade: q.class_grade || q.class,
          chapterId: q.chapter_id || q.chapter,
          chapter_id: q.chapter_id || q.chapter,
          type: q.type || q.question_type,
          question_type: q.type || q.question_type,
          options: opts,
          correctAnswer: q.correct_answer,
          correct_answer: q.correct_answer,
          xpReward: q.xp_reward,
          xp_reward: q.xp_reward,
          timeLimit: q.time_limit,
          time_limit: q.time_limit
        };
      });

      res.json(formatted);
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
      const result = await db.query("SELECT * FROM questions WHERE id = $1", [questionId]);
      const question = result.rows[0];

      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }

      const qType = question.type || question.question_type;
      let isCorrect = false;
      if (qType === "mcq" || qType === "boolean") {
        isCorrect = String(selectedAnswer) === String(question.correct_answer);
      } else if (qType === "numerical") {
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
      res.status(500).json({ error: "Server error during answer verification." });
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
        `INSERT INTO questions (
          id, class_grade, class, chapter_id, chapter, type, question_type, 
          difficulty, question, options, correct_answer, explanation, hint, xp_reward, time_limit
        ) VALUES ($1, $2, $2, $3, $3, $4, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12) RETURNING *`,
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

      const q = result.rows[0];
      const formatted = {
        ...q,
        class: q.class_grade || q.class,
        class_grade: q.class_grade || q.class,
        chapterId: q.chapter_id || q.chapter,
        chapter_id: q.chapter_id || q.chapter,
        type: q.type || q.question_type,
        question_type: q.type || q.question_type,
        correctAnswer: q.correct_answer,
        correct_answer: q.correct_answer,
        xpReward: q.xp_reward,
        xp_reward: q.xp_reward,
        timeLimit: q.time_limit,
        time_limit: q.time_limit
      };

      res.status(201).json({ message: "Question created successfully!", question: formatted });
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
      const result = await db.query(
        `UPDATE questions SET 
          class_grade = $1, class = $1,
          chapter_id = $2, chapter = $2,
          type = $3, question_type = $3,
          difficulty = $4, question = $5,
          options = $6::jsonb, correct_answer = $7,
          explanation = $8, hint = $9,
          xp_reward = $10, time_limit = $11
        WHERE id = $12 RETURNING *`,
        [
          Number(classGrade), 
          chapterId, 
          type, 
          difficulty, 
          question, 
          options ? JSON.stringify(options) : null, 
          String(correctAnswer), 
          explanation, 
          hint, 
          Number(xpReward), 
          Number(timeLimit),
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Question not found in database." });
      }

      const q = result.rows[0];
      const formatted = {
        ...q,
        class: q.class_grade || q.class,
        class_grade: q.class_grade || q.class,
        chapterId: q.chapter_id || q.chapter,
        chapter_id: q.chapter_id || q.chapter,
        type: q.type || q.question_type,
        question_type: q.type || q.question_type,
        correctAnswer: q.correct_answer,
        correct_answer: q.correct_answer,
        xpReward: q.xp_reward,
        xp_reward: q.xp_reward,
        timeLimit: q.time_limit,
        time_limit: q.time_limit
      };

      res.json({ message: "Question updated successfully!", question: formatted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating question." });
    }
  },

  // 5. Admin: Delete Question
  deleteQuestion: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.query("DELETE FROM questions WHERE id = $1", [id]);
      res.json({ message: "Question deleted successfully from curriculum." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error deleting question." });
    }
  }
};

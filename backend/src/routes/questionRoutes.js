import express from "express";
import { questionController } from "../controllers/questionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Publicly readable questions / validation (requires user session)
router.get("/", authMiddleware, questionController.getQuestions);
router.post("/validate", authMiddleware, questionController.validateAnswer);

// Admin / Teacher operations
router.post("/admin/create", authMiddleware, questionController.createQuestion);
router.put("/admin/update/:id", authMiddleware, questionController.updateQuestion);
router.delete("/admin/delete/:id", authMiddleware, questionController.deleteQuestion);

export default router;

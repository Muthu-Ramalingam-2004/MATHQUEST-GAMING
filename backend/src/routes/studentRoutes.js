import express from "express";
import { studentController } from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all student routes

router.put("/profile", studentController.updateProfile);
router.get("/stats", studentController.getStats);
router.put("/settings/sound", studentController.toggleSound);
router.put("/settings/darkmode", studentController.toggleDarkMode);

export default router;

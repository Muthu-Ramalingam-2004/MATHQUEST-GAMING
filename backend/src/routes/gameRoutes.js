import express from "express";
import { gameController } from "../controllers/gameController.js";
import { leaderboardController } from "../controllers/leaderboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all game/leaderboard routes

router.post("/session/start", gameController.startGame);
router.post("/session/finish", gameController.finishGame);
router.get("/leaderboard", leaderboardController.getLeaderboard);

export default router;

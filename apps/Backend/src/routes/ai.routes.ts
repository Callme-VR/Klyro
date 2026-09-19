import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authratelimiter } from "../middlewares/rateLimiter.middleware";
import { getWorkspaceInsight } from "../controllers/ai.controller";

const router = Router();

router.post("/insight", authenticateToken, authratelimiter(10, 60), getWorkspaceInsight);

export default router;

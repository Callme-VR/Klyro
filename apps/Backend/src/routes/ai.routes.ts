import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { aiRateLimiter } from "../middlewares/ai.ratelimiter";
import { getWorkspaceInsight } from "../controllers/ai.controller";

const router = Router();

router.post("/insight", authenticateToken, aiRateLimiter(10, 60), getWorkspaceInsight);

export default router;



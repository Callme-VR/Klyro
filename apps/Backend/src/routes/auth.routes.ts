import { Router } from "express";
import { Signup, Signin, GetMe, GoogleRedirect, GoogleCallback } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authratelimiter } from "../middlewares/rateLimiter.middleware";

const authRouter = Router();

authRouter.post("/signup", authratelimiter(5, 60), Signup);
authRouter.post("/signin", authratelimiter(5, 60), Signin);
authRouter.get("/me", authenticateToken, GetMe);

authRouter.get("/google", GoogleRedirect);
authRouter.get("/google/callback", GoogleCallback);

export default authRouter;
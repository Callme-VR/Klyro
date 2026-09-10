import { Router } from "express";
import { Signup, Signin, GetMe } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", Signup);
authRouter.post("/signin", Signin);
authRouter.get("/me", authenticateToken, GetMe);

export default authRouter;
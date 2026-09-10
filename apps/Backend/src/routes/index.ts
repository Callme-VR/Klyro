import { Router } from "express";
import authRouter from "./auth.routes";
import orgRouter from "./org.routes";
import boardRouter from "./board.routes";
import { sectionRouter } from "./section.routes";
import issuesRouter from "./issues.routes";
import commentsRouter from "./comments.routes";

const ApiRouter = Router();

ApiRouter.use("/auth", authRouter);
ApiRouter.use("/organizations", orgRouter);
ApiRouter.use("/boards", boardRouter);
ApiRouter.use("/sections", sectionRouter);
ApiRouter.use("/", issuesRouter);
ApiRouter.use("/", commentsRouter);

export default ApiRouter;
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  CreateComment,
  GetIssueComments,
  UpdateComment,
  DeleteComment,
} from "../controllers/comments.controller";

const router = Router();

router.use(authenticateToken);

// Comments Routes
router.post("/issues/:issueId/comments", CreateComment);
router.get("/issues/:issueId/comments", GetIssueComments);
router.patch("/comments/:commentId", UpdateComment);
router.delete("/comments/:commentId", DeleteComment);

export default router;
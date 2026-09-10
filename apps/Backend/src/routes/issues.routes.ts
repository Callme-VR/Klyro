import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  AddIssueAssignee,
  CreateIssue,
  DeleteIssue,
  GetIssueById,
  GetSectionIssues,
  RemoveIssueAssignee,
  UpdateIssue,
} from "../controllers/issue.controller";

const router = Router();

router.use(authenticateToken);

// Section Issues Routes
router.post("/sections/:sectionId/issues", CreateIssue);
router.get("/sections/:sectionId/issues", GetSectionIssues);

// Issue Direct Routes
router.get("/issues/:issueId", GetIssueById);
router.patch("/issues/:issueId", UpdateIssue);
router.delete("/issues/:issueId", DeleteIssue);

// Issue Assignees Routes
router.post("/issues/:issueId/assignees", AddIssueAssignee);
router.delete("/issues/:issueId/assignees/:userId", RemoveIssueAssignee);

export default router;
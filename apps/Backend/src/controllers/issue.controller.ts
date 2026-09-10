import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  CreateIssueSchema,
  UpdateIssueSchema,
  AddAssigneeSchema,
} from "../models/issue.Schemas";
import {
  createIssueService,
  getSectionIssuesService,
  getIssueByIdService,
  updateIssueService,
  deleteIssueService,
  addIssueAssigneeService,
  removeIssueAssigneeService,
} from "../services/issue.service";

const handleErrorResponse = (res: Response, error: any, defaultmsg: string) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code:
        statusCode === 400
          ? "BAD_REQUEST"
          : statusCode === 401
            ? "UNAUTHORIZED"
            : statusCode === 403
              ? "FORBIDDEN"
              : statusCode === 404
                ? "NOT_FOUND"
                : "INTERNAL_SERVER_ERROR",
      message: error.message || defaultmsg,
    },
  });
};

// ============================================================
// Issue Controllers
// ============================================================

// POST /api/v1/sections/:sectionId/issues
export const CreateIssue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { sectionId } = req.params;
    if (!sectionId || typeof sectionId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Section ID parameter is required" },
      });
      return;
    }
    const validation = CreateIssueSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid input payload",
          details: validation.error.flatten().fieldErrors,
        },
      });
      return;
    }
    const issue = await createIssueService(req.user.userId, sectionId, validation.data);
    res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to create issue");
  }
};

// GET /api/v1/sections/:sectionId/issues
export const GetSectionIssues = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { sectionId } = req.params;
    if (!sectionId || typeof sectionId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Section ID parameter is required" },
      });
      return;
    }
    const issues = await getSectionIssuesService(req.user.userId, sectionId);
    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch issues");
  }
};

// GET /api/v1/issues/:issueId
export const GetIssueById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { issueId } = req.params;
    if (!issueId || typeof issueId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Issue ID parameter is required" },
      });
      return;
    }
    const issue = await getIssueByIdService(req.user.userId, issueId);
    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch issue details");
  }
};

// PATCH /api/v1/issues/:issueId
export const UpdateIssue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { issueId } = req.params;
    if (!issueId || typeof issueId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Issue ID parameter is required" },
      });
      return;
    }
    const validation = UpdateIssueSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid input payload",
          details: validation.error.flatten().fieldErrors,
        },
      });
      return;
    }
    const issue = await updateIssueService(req.user.userId, issueId, validation.data);
    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to update issue");
  }
};

// DELETE /api/v1/issues/:issueId
export const DeleteIssue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { issueId } = req.params;
    if (!issueId || typeof issueId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Issue ID parameter is required" },
      });
      return;
    }
    const result = await deleteIssueService(req.user.userId, issueId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to delete issue");
  }
};

// ============================================================
// Issue Assignee Controllers
// ============================================================

// POST /api/v1/issues/:issueId/assignees
export const AddIssueAssignee = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { issueId } = req.params;
    if (!issueId || typeof issueId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Issue ID parameter is required" },
      });
      return;
    }
    const validation = AddAssigneeSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid input payload",
          details: validation.error.flatten().fieldErrors,
        },
      });
      return;
    }
    const assignment = await addIssueAssigneeService(
      req.user.userId,
      issueId,
      validation.data.userId
    );
    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to assign user to issue");
  }
};

// DELETE /api/v1/issues/:issueId/assignees/:userId
export const RemoveIssueAssignee = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { issueId, userId: targetUserId } = req.params;
    if (!issueId || typeof issueId !== "string" || !targetUserId || typeof targetUserId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Issue ID and target User ID parameters are required" },
      });
      return;
    }
    const result = await removeIssueAssigneeService(req.user.userId, issueId, targetUserId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to remove assignee");
  }
};

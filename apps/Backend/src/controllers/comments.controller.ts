import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CreateCommentSchema, UpdateCommentSchema } from "../models/comments.Schemas";
import {
  createCommentService,
  getIssueCommentsService,
  updateCommentService,
  deleteCommentService,
} from "../services/comments.service";

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

// POST /api/v1/issues/:issueId/comments
export const CreateComment = async (req: AuthenticatedRequest, res: Response) => {
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
    const validation = CreateCommentSchema.safeParse(req.body);
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
    const comment = await createCommentService(req.user.userId, issueId, validation.data);
    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to create comment");
  }
};

// GET /api/v1/issues/:issueId/comments
export const GetIssueComments = async (req: AuthenticatedRequest, res: Response) => {
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
    const comments = await getIssueCommentsService(req.user.userId, issueId);
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch comments");
  }
};

// PATCH /api/v1/comments/:commentId
export const UpdateComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { commentId } = req.params;
    if (!commentId || typeof commentId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Comment ID parameter is required" },
      });
      return;
    }
    const validation = UpdateCommentSchema.safeParse(req.body);
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
    const comment = await updateCommentService(req.user.userId, commentId, validation.data);
    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to update comment");
  }
};

// DELETE /api/v1/comments/:commentId
export const DeleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }
    const { commentId } = req.params;
    if (!commentId || typeof commentId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Comment ID parameter is required" },
      });
      return;
    }
    const result = await deleteCommentService(req.user.userId, commentId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to delete comment");
  }
};
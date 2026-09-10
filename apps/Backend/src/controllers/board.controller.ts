import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CreateBoardSchema, UpdateBoardSchema } from "../models/board.Schemas";
import {
  createBoardService,
  getBoardService,
  getBoardByIdService,
  updateBoardService,
  deleteBoardService,
} from "../services/board.service";

// POST /api/v1/boards
export const CreateBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const validation = CreateBoardSchema.safeParse(req.body);
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

    const board = await createBoardService(req.user.userId, validation.data);
    res.status(201).json({
      success: true,
      data: board,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// GET /api/v1/boards
export const GetBoards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgId = req.query.orgId as string | undefined;
    const boards = await getBoardService(req.user.userId, orgId);

    res.status(200).json({
      success: true,
      data: boards,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// GET /api/v1/boards/:boardId
export const GetBoardById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const boardId = req.params.boardId;
    if (!boardId || typeof boardId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Board ID parameter is required" },
      });
      return;
    }

    const board = await getBoardByIdService(req.user.userId, boardId);
    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
        message: error.message,
      },
    });
  }
};

// PATCH /api/v1/boards/:boardId
export const UpdateBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const boardId = req.params.boardId;
    if (!boardId || typeof boardId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Board ID parameter is required" },
      });
      return;
    }

    const validation = UpdateBoardSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", details: validation.error.flatten().fieldErrors },
      });
      return;
    }

    const updatedBoard = await updateBoardService(req.user.userId, boardId, validation.data);
    res.status(200).json({
      success: true,
      data: updatedBoard,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// DELETE /api/v1/boards/:boardId
export const DeleteBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const boardId = req.params.boardId;
    if (!boardId || typeof boardId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Board ID parameter is required" },
      });
      return;
    }

    const result = await deleteBoardService(req.user.userId, boardId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

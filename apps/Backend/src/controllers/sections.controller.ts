import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CreateSectionSchema, UpdateSectionSchema } from "../models/section.Schemas";
import {
  createSectionService,
  getSectionsService,
  updateSectionService,
  deleteSectionService,
} from "../services/section.service";

// POST /api/v1/boards/:boardId/sections
export const CreateSection = async (req: AuthenticatedRequest, res: Response) => {
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

    const validation = CreateSectionSchema.safeParse(req.body);
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

    const section = await createSectionService(req.user.userId, boardId, validation.data);
    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to create section",
      },
    });
  }
};

// GET /api/v1/boards/:boardId/sections
export const GetSections = async (req: AuthenticatedRequest, res: Response) => {
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

    const sections = await getSectionsService(req.user.userId, boardId);
    res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch sections",
      },
    });
  }
};

// PATCH /api/v1/sections/:sectionId
export const UpdateSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const sectionId = req.params.sectionId;
    if (!sectionId || typeof sectionId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Section ID parameter is required" },
      });
      return;
    }

    const validation = UpdateSectionSchema.safeParse(req.body);
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

    const section = await updateSectionService(req.user.userId, sectionId, validation.data);
    res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to update section",
      },
    });
  }
};

// DELETE /api/v1/sections/:sectionId
export const DeleteSection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const sectionId = req.params.sectionId;
    if (!sectionId || typeof sectionId !== "string") {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Section ID parameter is required" },
      });
      return;
    }

    const result = await deleteSectionService(req.user.userId, sectionId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to delete section",
      },
    });
  }
};

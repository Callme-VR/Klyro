import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { getWorkspaceInsightService } from "../services/ai.service";

export const getWorkspaceInsight = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User authentication required" }
      });
    }

    const { orgId, boardId } = req.body;
    if (!orgId) {
      return res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Missing required orgId field" }
      });
    }

    const result = await getWorkspaceInsightService(userId, orgId, boardId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error("[InsightAI CONTROLLER] ❌ Error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message || "Failed to generate workspace insight" }
    });
  }
};
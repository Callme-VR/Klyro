import { apiClient } from "@/lib/api-client";

export interface InsightRequestPayload {
  orgId: string;
  boardId?: string;
}

export interface WorkspaceInsightResult {
  orgName: string;
  totalBoards: number;
  totalMembers: number;
  totalIssues: number;
  healthScore: number;
  summary: string;
  bottlenecks: string[];
  recommendations: string[];
}

export const aiApi = {
  /**
   * Fetch executive workspace health analysis and insights from Gemini AI
   */
  getInsight: async (payload: InsightRequestPayload): Promise<WorkspaceInsightResult> => {
    return apiClient<WorkspaceInsightResult>("/ai/insight", {
      method: "POST",
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },
};
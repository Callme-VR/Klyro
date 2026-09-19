import { prisma } from "db/client";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini SDK using process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

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

/**
 * InsightAI Service: Analyzes Organization & Board metadata to produce executive health intelligence
 */
export async function getWorkspaceInsightService(
  userId: string,
  orgId: string,
  boardId?: string
): Promise<WorkspaceInsightResult> {
  const startTime = Date.now();
  console.log(`[InsightAI SERVICE] 🚀 Generating Workspace Insights for Org ID: ${orgId}`);

  // 1. Authorization check & fetching full workspace data
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: orgId,
      },
    },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          boards: {
            include: {
              sections: {
                include: {
                  issues: {
                    include: {
                      assignees: true,
                      _count: { select: { comments: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!membership) {
    throw new Error("Organization not found or access denied");
  }

  const org = membership.organization;
  const totalBoards = org.boards.length;
  const totalMembers = org.members.length;

  let targetBoards = org.boards;
  if (boardId) {
    const filtered = org.boards.filter((b) => b.id === boardId);
    if (filtered.length > 0) targetBoards = filtered;
  }

  let totalIssues = 0;
  const sectionSummaryMap: Record<string, number> = {};
  let unassignedCount = 0;
  let overdueCount = 0;
  const now = new Date();

  targetBoards.forEach((board) => {
    board.sections.forEach((section) => {
      const issueCount = section.issues.length;
      totalIssues += issueCount;
      sectionSummaryMap[section.title] = (sectionSummaryMap[section.title] || 0) + issueCount;

      section.issues.forEach((issue) => {
        if (issue.assignees.length === 0) unassignedCount++;
        if (issue.dueDate && new Date(issue.dueDate) < now) overdueCount++;
      });
    });
  });

  // 2. Build Gemini AI prompt with real workspace metrics
  const statsPayload = {
    orgName: org.name,
    totalBoards,
    totalMembers,
    totalIssues,
    sectionBreakdown: sectionSummaryMap,
    unassignedIssuesCount: unassignedCount,
    overdueIssuesCount: overdueCount,
  };

  const systemPrompt = `You are InsightAI, an elite Agile Project Manager and Executive Workspace Intelligence System.
Analyze the provided real-time organization metrics and produce an executive workspace health report.

Strict JSON Output Schema:
{
  "healthScore": 85,
  "summary": "2-3 concise sentences summarizing workspace health and active work",
  "bottlenecks": ["Array of 1-2 specific bottlenecks or risks detected based on stats"],
  "recommendations": ["Array of 2-3 short, high-impact actionable next steps for the team"]
}`;

  console.log(`[InsightAI SERVICE] ⏳ Calling Gemini API (gemini-3.5-flash-lite)...`);
  const aiStartTime = Date.now();

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `${systemPrompt}\n\nWorkspace Statistics:\n${JSON.stringify(statsPayload, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const aiDuration = Date.now() - aiStartTime;
  console.log(`[InsightAI SERVICE] ✅ Gemini API responded in ${aiDuration}ms`);

  const responseText = response.text;
  if (!responseText) throw new Error("Failed to receive insight response from Gemini AI");

  const parsed = JSON.parse(responseText);

  const durationTotal = Date.now() - startTime;
  console.log(`[InsightAI SERVICE] 🎉 Insight Report generated in ${durationTotal}ms total. Health Score: ${parsed.healthScore}`);

  return {
    orgName: org.name,
    totalBoards,
    totalMembers,
    totalIssues,
    healthScore: typeof parsed.healthScore === "number" ? parsed.healthScore : 85,
    summary: parsed.summary || `Organization ${org.name} currently has ${totalBoards} boards and ${totalMembers} members working on ${totalIssues} tasks.`,
    bottlenecks: Array.isArray(parsed.bottlenecks) ? parsed.bottlenecks : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
  };
}

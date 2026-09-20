# 🛡️ AI Sandboxing Specification & Architectural Guide

## 1. Executive Summary & Purpose

This document specifies the **AI Sandboxing Architecture** for **Klyro** (a real-time, full-stack collaborative Agile workspace monorepo).

The AI subsystem leverages Google's Gemini SDK (`@google/genai`) using model **`gemini-3.5-flash-lite`** to deliver real-time workspace health scores, bottleneck identification, and actionable recommendations.

### What is AI Sandboxing?

AI Sandboxing is a multi-layered security and operational container built around LLM invocations. It isolates the AI engine from the underlying web infrastructure to prevent:
1. **Tenant Cross-Contamination**: Preventing Organization A from accessing metrics of Organization B.
2. **Denial of Service (DoS) & API Key Exhaustion**: Preventing runaway execution or prompt flooding from draining Gemini API credits.
3. **Execution Thread Hijacking**: Preventing slow LLM responses from blocking Express Node/Bun worker threads.
4. **Malformed Output Crashes**: Preventing non-standard JSON from breaking the Next.js frontend UI (`InsightAISidebar`).

---

## 2. Codebase Architecture & AI Flow Analysis

### Current AI Infrastructure

```
┌───────────────────────────┐
│ apps/frentend             │  (InsightAISidebar.tsx)
│ Next.js 16 / React 19     │
└─────────────┬─────────────┘
              │  POST /api/v1/ai/insight { orgId, boardId? }
              ▼
┌───────────────────────────┐
│ apps/Backend              │  (ai.routes.ts -> ai.controller.ts)
│ Express v5 / Pino         │
└─────────────┬─────────────┘
              │  1. Verifies JWT Auth token (req.user.userId)
              │  2. Calls getWorkspaceInsightService(userId, orgId, boardId)
              ▼
┌───────────────────────────┐
│ packages/db (@repo/db)    │  (Prisma ORM)
│ PostgreSQL Database       │  Fetches Board, Section, Issue & Member Stats
└─────────────┬─────────────┘
              │  Constructs statsPayload JSON
              ▼
┌───────────────────────────┐
│ Google Gemini SDK         │  (ai.service.ts)
│ gemini-3.5-flash-lite     │  Executes generateContent with JSON mode
└───────────────────────────┘
```

### Risk Vector Matrix

| Risk Vector | Current Risk | Sandboxing Remedy |
| :--- | :--- | :--- |
| **Hanging AI Calls** | Gemini API latency spikes can hold Express connections open indefinitely. | **Execution Circuit Breaker**: 8-second `Promise.race` hard timeout. |
| **IP-Based Limiting** | `authratelimiter` uses IP addresses, which can be spoofed or throttle entire shared NAT networks. | **User-Centric Rate Limiting**: Redis key tagged to `req.user.userId`. |
| **Unvalidated Output** | Raw `JSON.parse` can throw runtime exceptions if Gemini output format drifts. | **Zod Output Sandbox**: Strict Zod schema parsing with safe fallback defaults. |
| **Prompt Injection** | If user inputs (board titles, issue titles) contain system-override instructions. | **Payload Sanitization & Boundary Caps**: Truncating titles and escaping prompt structures. |
| **Tenant Data Leaks** | Unchecked queries could aggregate metrics across unauthorized workspaces. | **Prisma Authorization Guard**: Explicit `userId_organizationId` composite index check. |

---

## 3. The 5-Layer AI Sandbox Architecture

```
                       Client Request (JWT Auth)
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │ Layer 1: Identity & Tenant Authorization Sandbox      │
      │ Verify user belongs to requested Organization ID      │
      └───────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │ Layer 2: Rate Limiting & Cost Guardrail Sandbox       │
      │ User-keyed Redis bucket (Max 10 calls / 60 seconds)   │
      └───────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │ Layer 3: Payload Sanitization & Prompt Isolation      │
      │ Cap issue lists, truncate strings, format fixed JSON  │
      └───────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │ Layer 4: Execution Circuit Breaker & Timeout (8s)     │
      │ AbortSignal / Promise.race race against Gemini API    │
      └───────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │ Layer 5: Output Zod Schema Sandbox & Safe Fallbacks   │
      │ Validate JSON output schema before sending to UI      │
      └───────────────────────────────────────────────────────┘
```

---

## 4. Implementation Specifications & Blueprints

### Layer 1: Tenant Authorization Sandbox

Verify tenant access using Prisma's composite unique index before querying any board data:

```typescript
// Enforce DB-level multi-tenant boundary check
const membership = await prisma.organizationMember.findUnique({
  where: {
    userId_organizationId: {
      userId,
      organizationId: orgId,
    },
  },
});

if (!membership) {
  throw new Error("UNAUTHORIZED_WORKSPACE_ACCESS: User does not belong to this organization");
}
```

---

### Layer 2: User-Centric Redis Rate Limiter Sandbox

Upgrade from IP-based rate limiting to User-ID based rate limiting (`aiRateLimit:${userId}`) to guarantee fair usage:

```typescript
// Proposed Middleware: apps/Backend/src/middlewares/aiRateLimiter.middleware.ts
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware";
import { redis } from "../utils/redis";

export const aiRateLimiter = (maxRequests: number = 10, windowSeconds: number = 60) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED" } });
    }

    const key = `aiRateLimit:${userId}`;
    try {
      const requests = await redis.incr(key);
      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (requests > maxRequests) {
        return res.status(429).json({
          success: false,
          error: {
            code: "TOO_MANY_REQUESTS",
            message: `AI rate limit exceeded. Max ${maxRequests} requests per ${windowSeconds}s.`,
          },
        });
      }
      next();
    } catch (error) {
      console.error("[AI Rate Limiter Error]", error);
      next(); // Fail open if Redis is down
    }
  };
};
```

---

### Layer 3 & 4: Service Execution Circuit Breaker (Timeout Sandbox)

Update `apps/Backend/src/services/ai.service.ts` to wrap `ai.models.generateContent` with a hard **8-second timeout** and **Zod Output Validation**:

```typescript
// Proposed Enhancement for apps/Backend/src/services/ai.service.ts
import { z } from "zod";

// Zod Output Schema Sandbox
const WorkspaceInsightSchema = z.object({
  healthScore: z.number().min(0).max(100).default(85),
  summary: z.string().min(10),
  bottlenecks: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

export async function getWorkspaceInsightServiceSandboxed(
  userId: string,
  orgId: string,
  boardId?: string
): Promise<WorkspaceInsightResult> {
  // 1. Fetch & Sanitize Stats Payload
  // ... (Tenant verification and stats aggregation)

  const statsPayload = {
    orgName: org.name.slice(0, 100), // Cap length
    totalBoards,
    totalMembers,
    totalIssues,
    sectionBreakdown: sectionSummaryMap,
    unassignedIssuesCount: unassignedCount,
    overdueIssuesCount: overdueCount,
  };

  const systemPrompt = `You are InsightAI, an elite Agile Project Manager system.
Analyze the workspace metrics and produce a health report.
Output strictly valid JSON conforming to:
{
  "healthScore": 85,
  "summary": "2-3 concise sentences",
  "bottlenecks": ["bottleneck 1"],
  "recommendations": ["recommendation 1"]
}`;

  // 2. Timeout Circuit Breaker Sandbox (8 Seconds)
  const TIMEOUT_MS = 8000;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("AI_EXECUTION_TIMEOUT: Gemini API exceeded 8000ms")), TIMEOUT_MS)
  );

  const aiExecutionPromise = ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `${systemPrompt}\n\nMetrics:\n${JSON.stringify(statsPayload)}`,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  // Race execution against timeout sandbox
  const response: any = await Promise.race([aiExecutionPromise, timeoutPromise]);
  const responseText = response.text;

  if (!responseText) throw new Error("EMPTY_AI_RESPONSE");

  // 3. Zod Output Validation Sandbox
  const rawParsed = JSON.parse(responseText);
  const validated = WorkspaceInsightSchema.parse(rawParsed);

  return {
    orgName: org.name,
    totalBoards,
    totalMembers,
    totalIssues,
    healthScore: validated.healthScore,
    summary: validated.summary,
    bottlenecks: validated.bottlenecks,
    recommendations: validated.recommendations,
  };
}
```

---

### Layer 5: Controller Defensive Fallback Sandbox

In `apps/Backend/src/controllers/ai.controller.ts`, intercept timeouts and AI errors gracefully without throwing HTTP 500 errors to the client:

```typescript
// Proposed Controller Pattern in apps/Backend/src/controllers/ai.controller.ts
export const getWorkspaceInsight = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED" } });
    }

    const { orgId, boardId } = req.body;
    if (!orgId) {
      return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message: "Missing orgId" } });
    }

    const result = await getWorkspaceInsightService(userId, orgId, boardId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("[InsightAI CONTROLLER ERROR]", error.message);

    // Defensive Sandbox Fallback: Return standard graceful data on AI failure
    if (error.message.includes("AI_EXECUTION_TIMEOUT")) {
      return res.status(504).json({
        success: false,
        error: { code: "GATEWAY_TIMEOUT", message: "AI analysis timed out. Please try again." }
      });
    }

    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message || "Failed to process request" }
    });
  }
};
```

---

## 5. Security & Verification Audit Checklist

Before deploying changes to production, perform the following verification audit:

- [ ] **Model Name Guard**: Verify model is locked to `"gemini-3.5-flash-lite"`.
- [ ] **Rate Limiting Guard**: Verify user-based Redis rate limit (`10 requests / 60s`).
- [ ] **Timeout Guard**: Verify 8-second hard timeout aborts hanging HTTP requests.
- [ ] **Schema Validation Guard**: Verify Zod schema parses Gemini response.
- [ ] **Secret Isolation Guard**: Verify `GEMINI_API_KEY` is loaded from `process.env` and never logged or leaked in error tracebacks.
- [ ] **Type Check**: Run `bun run check-types` across all monorepo packages.
- [ ] **Production Build**: Run `bun run build --filter=frentend` to confirm zero Next.js static generation errors.

import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware";
import { redis } from "../utils/redis";

/**
 * 🛡️ LAYER 2 Sandbox: User-Centric Rate Limiting Sandbox (Max 10 requests / 60s per User ID)
 */
export const aiRateLimiter = (maxRequest: number = 10, windowSeconds: number = 60) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "User authentication required" },
      });
    }

    const key = `ai_ratelimit:${userId}`;
    try {
      const currentRequests = await redis.incr(key);
      if (currentRequests === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (currentRequests > maxRequest) {
        return res.status(429).json({
          success: false,
          error: {
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests. Maximum ${maxRequest} requests per ${windowSeconds} seconds allowed. Please try again later.`,
          },
        });
      }
      next();
    } catch (error) {
      console.error("[AI Rate Limiter Error] Redis warning:", error);
      next(); // Fail open on Redis error
    }
  };
};
import type { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";


export const authratelimiter = (maxRequest: number = 5, windowSeconds: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1";
    const userkey = `authRateLimit:${ip}`;

    try {
      const request = await redis.incr(userkey);
      if (request === 1) {
        await redis.expire(userkey, windowSeconds); // Expiration in seconds
      }
      if (request > maxRequest) {
        return res.status(429).json({
          success: false,
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests. Please try again later.",
        });
      }
      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      next();
    }
  };
};

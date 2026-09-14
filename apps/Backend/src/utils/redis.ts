import Redis from "ioredis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("⚡ [Backend] Connected to Redis successfully");
})

redis.on("error", (error) => {
  console.log("❌ [Backend] Redis connection error:", error);
})

redis.on("close", () => {
  console.log("⚠️ [Backend] Redis connection closed");
})

process.on("SIGINT", () => {
  redis.quit();
});
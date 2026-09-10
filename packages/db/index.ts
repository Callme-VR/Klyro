import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import pino from "pino";
import pretty from "pino-pretty";

// Load environment variables from local and parent directories
dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

// 1. Logger Setup
const logger = pino(
  { base: undefined },
  pretty({ colorize: true, ignore: "time" }),
);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  logger.error("DATABASE_URL environment variable is missing!");
}

// 2. Prisma Setup
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

// 3. Simple Logs
prisma.$on("query", (e) => logger.info(`(${e.duration}ms) ${e.query}`));
prisma.$on("error", (e) => logger.error(e.message));

// 4. Direct Run Connection Check
if (import.meta.main) {
  prisma
    .$connect()
    .then(() => logger.info("Database connected successfully!"))
    .catch((err) => logger.error(`Connection failed: ${err.message}`))
    .finally(() => prisma.$disconnect());
}

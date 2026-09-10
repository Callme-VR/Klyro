import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });
dotenv.config({ path: path.resolve(import.meta.dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import pino from "pino";
import pretty from "pino-pretty";
import pinoHttp from "pino-http";
import { prisma } from "db/client";
import ApiRouter from "./routes";

// 1. Initialize clean programmatic Pino logger (Safe for Bun execution)
const logger = pino(
  { base: undefined },
  pretty({
    colorize: true,
    ignore: "time", // Removes time, PID, and Hostname entirely
  }),
);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5500;

// 2. Attach Middlewares
app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json()); // Added to ensure your backend can read JSON bodies natively

// 3. Attach Routes
app.use("/api/v1", ApiRouter);

// Base Route
app.get("/", (req, res) => {
  res.send("HTTP server is running safely.");
});

// 4. Start Server and Verify Database Connectivity
app.listen(port, "0.0.0.0", async () => {
  logger.info(
    `Backend server successfully listening on http://0.0.0.0:${port}`,
  );

  try {
    // Attempt explicit handshake connection to your shared prisma engine
    await prisma.$connect();
    logger.info("Database connected successfully to the Backend!");
  } catch (error: any) {
    logger.error(`Database connection fallback error: ${error.message}`);
  }
});

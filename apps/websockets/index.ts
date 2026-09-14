
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import pino from "pino";
import pretty from "pino-pretty";
import { randomUUID } from "crypto";
import { prisma } from "db/client";
import Redis from "ioredis";

// ============================================================
// LOGGER
// ============================================================

const logger = pino(
  {
    base: undefined,
  },
  pretty({
    colorize: true,
    ignore: "time",
  }),
);

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 6001;

const REDIS_URL =
  process.env.REDIS_URL || "redis://localhost:6379";

// ============================================================
// REDIS
// ============================================================

const redisPub = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

const redisSub = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Redis connection events
redisPub.on("connect", () => {
  logger.info("Redis publisher connected successfully");
});

redisSub.on("connect", () => {
  logger.info("Redis subscriber connected successfully");
});

// Redis error events
redisPub.on("error", (err) => {
  logger.error(
    { error: err.message },
    "Redis Publisher Error",
  );
});

redisSub.on("error", (err) => {
  logger.error(
    { error: err.message },
    "Redis Subscriber Error",
  );
});

// ============================================================
// TYPES
// ============================================================

interface User {
  userId: string;
  socket: WebSocket;
}

// ============================================================
// ROOMS
// ============================================================

// boardId -> connected users
const ROOMS = new Map<string, Set<User>>();

// ============================================================
// REDIS SUBSCRIPTION
// ============================================================

redisSub.psubscribe("board:*", (err, count) => {
  if (err) {
    logger.error(
      {
        error: err.message,
        channel: "board:*",
      },
      "Failed to subscribe to Redis channels",
    );

    return;
  }

  logger.info(
    `Subscribed to ${count} Redis pattern(s) (board:*)`,
  );
});

// ============================================================
// BROADCAST REDIS EVENTS TO LOCAL SOCKETS
// ============================================================

redisSub.on(
  "pmessage",
  (_pattern, channel, message) => {
    const boardId = channel.replace("board:", "");

    const usersInRoom = ROOMS.get(boardId);

    if (!usersInRoom) {
      return;
    }

    try {
      const parsedData = JSON.parse(message);

      usersInRoom.forEach((user) => {
        // Do not broadcast USER_JOINED back to the socket that just joined
        if (
          parsedData.type === "USER_JOINED" &&
          user.userId === parsedData.userId
        ) {
          return;
        }

        if (user.socket.readyState === WebSocket.OPEN) {
          user.socket.send(message);
        }
      });
    } catch {
      usersInRoom.forEach((user) => {
        if (user.socket.readyState === WebSocket.OPEN) {
          user.socket.send(message);
        }
      });
    }
  },
);

// ============================================================
// HTTP + WEBSOCKET SERVER
// ============================================================

const server = createServer();

const wss = new WebSocketServer({
  server,
});

// ============================================================
// CONNECTION HANDLER
// ============================================================

wss.on("connection", (socket: WebSocket) => {
  logger.info("New WebSocket client connected");

  // Track which board this socket joined
  let currentBoardId: string | null = null;
  let currentUserId: string | null = null;

  // ==========================================================
  // MESSAGE HANDLER
  // ==========================================================

  socket.on("message", async (data) => {
    let parsedData: any;

    // --------------------------------------------------------
    // Parse JSON
    // --------------------------------------------------------

    try {
      parsedData = JSON.parse(data.toString());
    } catch {
      logger.error("Invalid JSON received from client");

      socket.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid JSON",
        }),
      );

      return;
    }

    logger.info(
      { data: parsedData },
      "Received message from client",
    );

    // ========================================================
    // JOIN BOARD
    // ========================================================

    if (parsedData.type === "JOIN_BOARD") {
      const boardId = parsedData.boardId ?? parsedData.boardid;

      // ------------------------------------------------------
      // Validate board ID
      // ------------------------------------------------------

      if (
        typeof boardId !== "string" ||
        boardId.trim().length === 0
      ) {
        socket.send(
          JSON.stringify({
            type: "ERROR",
            message: "boardId is required",
          }),
        );

        return;
      }

      // ------------------------------------------------------
      // Prevent joining multiple boards with same socket
      // ------------------------------------------------------

      if (currentBoardId) {
        socket.send(
          JSON.stringify({
            type: "ERROR",
            message: "Socket is already connected to a board",
          }),
        );

        return;
      }

      // ------------------------------------------------------
      // Create room if it doesn't exist
      // ------------------------------------------------------

      if (!ROOMS.has(boardId)) {
        ROOMS.set(boardId, new Set<User>());
      }

      const users = ROOMS.get(boardId)!;

      // ------------------------------------------------------
      // Generate unique user ID
      // ------------------------------------------------------

      const newUserId = randomUUID();

      // ------------------------------------------------------
      // Get existing users BEFORE adding new user
      // ------------------------------------------------------

      const existingUsers = Array.from(users).map(
        (user) => user.userId,
      );

      // ------------------------------------------------------
      // Add new user to room
      // ------------------------------------------------------

      const newUser: User = {
        userId: newUserId,
        socket,
      };

      users.add(newUser);

      currentBoardId = boardId;
      currentUserId = newUserId;

      // ------------------------------------------------------
      // Send initial state to new user
      // ------------------------------------------------------

      socket.send(
        JSON.stringify({
          type: "INIT_STATE",
          users: existingUsers,
          userId: newUserId,
        }),
      );

      // ------------------------------------------------------
      // Notify existing users through Redis
      // ------------------------------------------------------

      await redisPub.publish(
        `board:${boardId}`,
        JSON.stringify({
          type: "USER_JOINED",
          userId: newUserId,
        }),
      );

      // ------------------------------------------------------
      // Logging
      // ------------------------------------------------------

      logger.info(
        {
          boardId,
          userId: newUserId,
          usersInRoom: users.size,
        },
        "Client joined the board",
      );

      return;
    }

    // ========================================================
    // UNKNOWN MESSAGE TYPE
    // ========================================================

    socket.send(
      JSON.stringify({
        type: "ERROR",
        message: `Unknown message type: ${parsedData.type}`,
      }),
    );
  });

  // ==========================================================
  // CONNECTION CLOSED
  // ==========================================================

  socket.on("close", async () => {
    logger.info("WebSocket client disconnected");

    // --------------------------------------------------------
    // If user never joined a board
    // --------------------------------------------------------

    if (!currentBoardId || !currentUserId) {
      return;
    }

    const boardId = currentBoardId;
    const userId = currentUserId;

    const users = ROOMS.get(boardId);

    if (!users) {
      return;
    }

    // --------------------------------------------------------
    // Remove user
    // --------------------------------------------------------

    for (const user of users) {
      if (user.userId === userId) {
        users.delete(user);
        break;
      }
    }

    // --------------------------------------------------------
    // Notify remaining users through Redis
    // --------------------------------------------------------

    if (users.size > 0) {
      await redisPub.publish(
        `board:${boardId}`,
        JSON.stringify({
          type: "USER_LEAVE",
          userId,
        }),
      );
    }

    // --------------------------------------------------------
    // Delete empty room
    // --------------------------------------------------------

    if (users.size === 0) {
      ROOMS.delete(boardId);
    }

    logger.info(
      {
        boardId,
        userId,
        usersRemaining: users.size,
      },
      "Client left the board",
    );

    currentBoardId = null;
    currentUserId = null;
  });

  // ==========================================================
  // SOCKET ERROR
  // ==========================================================

  socket.on("error", (error) => {
    logger.error(
      {
        error: error.message,
      },
      "WebSocket client error",
    );
  });
});

// ============================================================
// WEBSOCKET SERVER ERROR
// ============================================================

wss.on("error", (error: Error) => {
  logger.error(
    {
      error: error.message,
    },
    "WebSocket server-level error",
  );
});

// ============================================================
// DATABASE CONNECTION + SERVER STARTUP
// ============================================================

async function main() {
  try {
    // --------------------------------------------------------
    // Connect to database
    // --------------------------------------------------------

    await prisma.$connect();

    logger.info("Database connected successfully");

    // --------------------------------------------------------
    // Start HTTP/WebSocket server
    // --------------------------------------------------------

    server.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `WebSocket server running on ws://0.0.0.0:${PORT}`,
      );
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    logger.error(
      {
        error: message,
      },
      "Failed to start server",
    );

    process.exit(1);
  }
}

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

async function shutdown(signal: string) {
  logger.info(`${signal} received. Shutting down...`);

  try {
    wss.close();
    server.close();

    await redisPub.quit();
    await redisSub.quit();

    await prisma.$disconnect();

    logger.info("Server shutdown completed");

    process.exit(0);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    logger.error(
      {
        error: message,
      },
      "Error during shutdown",
    );

    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

// ============================================================
// START SERVER
// ============================================================

void main();
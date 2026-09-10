import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import pino from "pino";
import pretty from "pino-pretty";
import { randomUUID } from "crypto";
import { prisma } from "db/client";

// ============================================================
// LOGGER
// ============================================================

const logger = pino(
  {
    base: undefined, // Removes PID and hostname
  },
  pretty({
    colorize: true,
    ignore: "time", // Hide timestamp
  }),
);

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 6001;

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

// boardId -> Set of users connected to that board
const ROOMS = new Map<string, Set<User>>();

// ============================================================
// HTTP & WEBSOCKET SERVER (DUAL-STACK IPV4/IPV6)
// ============================================================

const server = createServer();
const wss = new WebSocketServer({ server });

// ============================================================
// CONNECTION HANDLER
// ============================================================

wss.on("connection", (socket: WebSocket) => {
  logger.info("New WebSocket client connected");

  // ----------------------------------------------------------
  // MESSAGE HANDLER
  // ----------------------------------------------------------

  socket.on("message", (data) => {
    let parsedData: any;

    // Safely parse incoming JSON
    try {
      parsedData = JSON.parse(data.toString());
    } catch (error) {
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
      const boardId = parsedData.boardid;

      if (!boardId) {
        socket.send(
          JSON.stringify({
            type: "ERROR",
            message: "boardid is required",
          }),
        );

        return;
      }

      // ------------------------------------------------------
      // Get existing room or create a new one
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
      // Notify existing users that someone joined
      // ------------------------------------------------------

      users.forEach((user) => {
        if (user.socket.readyState === WebSocket.OPEN) {
          user.socket.send(
            JSON.stringify({
              type: "USER_JOINED",
              userId: newUserId,
            }),
          );
        }
      });

      // ------------------------------------------------------
      // Add new user to room
      // ------------------------------------------------------

      const newUser: User = {
        userId: newUserId,
        socket,
      };

      users.add(newUser);

      // ------------------------------------------------------
      // Send current room state to new user
      // ------------------------------------------------------

      const existingUsers = Array.from(users)
        .filter((user) => user.userId !== newUserId)
        .map((user) => user.userId);

      socket.send(
        JSON.stringify({
          type: "INIT_STATE",
          users: existingUsers,
          userId: newUserId,
        }),
      );

      logger.info(
        {
          boardId,
          userId: newUserId,
          usersInRoom: users.size,
        },
        "Client joined the board",
      );
    }
  });

  // ==========================================================
  // CONNECTION CLOSED
  // ==========================================================

  socket.on("close", () => {
    logger.info("WebSocket client disconnected");

    // --------------------------------------------------------
    // Find the room and user associated with this socket
    // --------------------------------------------------------

    for (const [roomId, users] of ROOMS.entries()) {
      let disconnectedUser: User | undefined;

      for (const user of users) {
        if (user.socket === socket) {
          disconnectedUser = user;
          break;
        }
      }

      // ------------------------------------------------------
      // User was not part of this room
      // ------------------------------------------------------

      if (!disconnectedUser) {
        continue;
      }

      // ------------------------------------------------------
      // Remove user from room
      // ------------------------------------------------------

      users.delete(disconnectedUser);

      // ------------------------------------------------------
      // Notify remaining users
      // ------------------------------------------------------

      users.forEach((user) => {
        if (user.socket.readyState === WebSocket.OPEN) {
          user.socket.send(
            JSON.stringify({
              type: "USER_LEAVE",
              userId: disconnectedUser!.userId,
            }),
          );
        }
      });

      // ------------------------------------------------------
      // Delete empty room
      // ------------------------------------------------------

      if (users.size === 0) {
        ROOMS.delete(roomId);
      }

      logger.info(
        {
          roomId,
          userId: disconnectedUser.userId,
          usersRemaining: users.size,
        },
        "Client left the board",
      );

      // A socket should only belong to one room,
      // so we can stop searching.
      break;
    }
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
    "Server level error occurred",
  );
});

// ============================================================
// DATABASE CONNECTION + SERVER STARTUP
// ============================================================

async function main() {
  try {
    // Test Prisma database connection
    await prisma.$connect();

    logger.info("Database connected successfully");

    server.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `WebSocket server successfully serving on ws://0.0.0.0:${PORT} (dual-stack IPv4/IPv6)`,
      );
    });
  } catch (error: any) {
    logger.error(
      {
        error: error.message,
      },
      "Failed to connect to the database",
    );

    process.exit(1);
  }
}

// ============================================================
// START SERVER
// ============================================================

main();









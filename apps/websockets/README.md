<div align="center">
  <img src="../../assets/animated-logo.svg" alt="WebSocket Logo" width="120" />

  # Realtime WebSocket Service (`apps/websockets`)

  <p align="center">
    <strong>Low-Latency Bi-Directional Event Synchronization Gateway built on <code>ws</code>, Pino & Prisma ORM.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/websockets/ws"><img src="https://img.shields.io/badge/Protocol-ws-A855F7?style=flat-square&logo=websocket" alt="WebSocket" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun-black?style=flat-square&logo=bun" alt="Bun" /></a>
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
    <a href="https://github.com/pinojs/pino"><img src="https://img.shields.io/badge/Logging-Pino-68829E?style=flat-square" alt="Pino" /></a>
  </p>
</div>

---

## 📐 Architecture & First Principles

1. **Bi-Directional Event Gateway**: Built on the native high-performance `ws` library for persistent, low-overhead TCP WebSocket connections.
2. **Real-time State Synchronization**: Broadcasts realtime mutations (e.g. board updates, card movements, column reordering, live active users) to connected client sockets.
3. **Database Integration**: Shares the centralized Prisma ORM client (`@repo/db`) to query and persist event data asynchronously.
4. **Structured JSON Logging**: Integrates **Pino** for non-blocking event tracing and connection status monitoring.

---

## ⚡ Specifications

| Parameter | Specification |
| :--- | :--- |
| **Runtime** | Bun / Node.js |
| **WebSocket Engine** | `ws` (native WebSockets) |
| **Default Port** | `6000` |
| **Connection URL** | `ws://localhost:6000` |
| **Database Client** | `@repo/db` |
| **Logger** | Pino (`pino`, `pino-pretty`) |

---

## 🔄 Socket Handshake & Message Protocol

Client connection handshake is established at `ws://localhost:6000`.

### Message Payload Schema

Incoming and outgoing payloads use JSON stringified format:

```json
{
  "type": "BOARD_UPDATE",
  "boardId": "board_123",
  "payload": {
    "cardId": "card_456",
    "listId": "list_789",
    "position": "1000.5"
  },
  "timestamp": 1740000000
}
```

---

## 🚀 Execution & Development

### Monorepo Execution (Recommended)

From the monorepo root:

```bash
bun run dev --filter=websockets
```

### Standalone Execution

```bash
cd apps/websockets
bun index.ts
```

The WebSocket gateway listens for client connections on `ws://localhost:6000`.

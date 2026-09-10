# WebSocket Service (`apps/websockets`)

The real-time WebSocket server for the Trello monorepo, responsible for bi-directional live communication and client event synchronization.

---

## 📐 Architectural Design (First Principles)

1. **Bi-Directional Event Gateway**: Built on the native high-performance `ws` library for persistent, low-overhead TCP WebSocket connections.
2. **Real-time State Synchronization**: Designed to broadcast realtime mutations (e.g. board updates, card movements, live user activity) to connected clients.
3. **Database Integration**: Shares the Prisma ORM client (`db/client`) to query and persist event data asynchronously.
4. **Structured Logging**: Uses **Pino** with `pino-pretty` formatting for non-blocking event tracing.

---

## ⚡ Specifications

- **Runtime**: Bun / Node.js
- **WebSocket Protocol**: `ws://`
- **Default Port**: `6000`
- **Database Client**: Prisma ORM (`db/client`)
- **Logger**: Pino (`pino`, `pino-pretty`)

---

## 🚀 Running the Service

### From Monorepo Root (Recommended)

```bash
bun run dev --filter=websockets
```

### Standalone Execution

```bash
cd apps/websockets
bun index.ts
```

---

## 🔄 Socket Handshake & Protocol

- **Connection Endpoint**: `ws://localhost:6000`
- **Incoming Messages**: JSON payload strings parsed on `message` event.
- **Echo Handler**: Standard echo payload sent back to connected clients for verification.

# Trello Monorepo

A high-performance, real-time full-stack collaborative application suite built with a modern TypeScript monorepo architecture.

---

## 💡 First-Principles Architecture

This repository is constructed from base principles to achieve ultra-fast execution, strict type safety, clean separation of concerns, and real-time synchronization.

```
                               ┌───────────────────────────┐
                               │   apps/frentend           │
                               │   Next.js 16 / React 19   │
                               │   Port 3000               │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │ REST (HTTP)                               │ WebSocket (ws)
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │   apps/Backend            │               │   apps/websockets         │
         │   Express v5 / Pino       │               │   ws / Pino               │
         │   Port 5500               │               │   Port 6000               │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │ Shared ORM
                                             ▼
                               ┌───────────────────────────┐
                               │   packages/db             │
                               │   Prisma ORM (PostgreSQL) │
                               └───────────────────────────┘
```

### Core Axioms

1. **Single Source of Truth (Data Layer)**: Database schemas and Prisma ORM client reside exclusively in `@repo/db` (`packages/db`), ensuring unified data access across HTTP backend and WebSocket servers.
2. **Stateless HTTP API (`apps/Backend`)**: Express 5 handles request/response processing, payload validation, authentication, and CRUD transactions.
3. **Real-time Event Gateway (`apps/websockets`)**: Dedicated bi-directional WebSocket server built on `ws` for low-latency state updates and live client broadcasts.
4. **Client Gateway (`apps/frentend`)**: Next.js App Router (React 19, Tailwind CSS v4) acting as the user interface layer, seamlessly interacting with HTTP REST APIs and real-time WebSocket channels.
5. **Fast Monorepo Tooling**: Executed via **Bun** and orchestrated with **Turborepo** for optimized caching, parallelized dev tasks, and dependency graph management.

---

## 📁 Repository Structure

```
trello/
├── apps/
│   ├── Backend/          # Express v5 REST API service (Port 5500)
│   ├── frentend/         # Next.js 16 frontend application (Port 3000)
│   └── websockets/       # Low-latency WebSocket event server (Port 6000)
├── packages/
│   ├── db/               # Centralized Prisma schema & PostgreSQL client
│   ├── ui/               # Shared React UI component library
│   ├── eslint-config/    # Shared ESLint configuration rules
│   └── typescript-config/# Shared tsconfig compiler presets
├── package.json          # Root scripts & Turbo workspace definition
├── turbo.json            # Turborepo task pipeline configuration
└── bun.lock              # Bun lockfile
```

---

## ⚙️ Network Topology & Ports

| Component        | Technology                         | Default Port | Protocol            | Main Responsibility                   |
| :--------------- | :--------------------------------- | :----------- | :------------------ | :------------------------------------ |
| **`frentend`**   | Next.js 16, React 19, Tailwind CSS | `3000`       | HTTP / WS           | Web Interface & User Interactions     |
| **`Backend`**    | Express 5, Pino, Prisma            | `5500`       | HTTP (REST)         | Authentication, CRUD & Business Logic |
| **`websockets`** | `ws`, Pino, Prisma                 | `6000`       | WebSocket (`ws://`) | Real-time messaging & live sync       |
| **`db`**         | Prisma ORM, PostgreSQL             | Database URL | TCP                 | Database persistence layer            |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3.4 or higher)
- PostgreSQL database instance

### Installation

1. Clone the repository and navigate into `trello`:

   ```bash
   cd trello
   ```

2. Install dependencies across all packages and apps:

   ```bash
   bun install
   ```

3. Configure Environment Variables:
   Create a `.env` file in `packages/db` with your database connection string:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/trello_db?schema=public"
   ```

4. Generate Prisma Client:
   ```bash
   cd packages/db
   bunx prisma generate
   ```

---

## 🛠️ Development & Build Workflow

Run scripts from the monorepo root:

| Command               | Description                                                                                        |
| :-------------------- | :------------------------------------------------------------------------------------------------- |
| `bun run dev`         | Launch all applications (`Backend`, `frentend`, `websockets`) concurrently in watch mode via Turbo |
| `bun run build`       | Compile all apps and packages for production                                                       |
| `bun run lint`        | Run ESLint across all workspace modules                                                            |
| `bun run check-types` | Run TypeScript type checking across all workspace modules                                          |
| `bun run format`      | Format repository code using Prettier                                                              |

---

## 🛡️ Coding & System Conventions

- **Logging**: All server services (`Backend` and `websockets`) use **Pino** for structured JSON logging with `pino-pretty` formatting.
- **Data Imports**: Import the shared database client strictly via `db/client` or `@repo/db`.
- **Environment Safety**: Never hardcode credentials or dynamic ports in source files.

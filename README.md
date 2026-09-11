<div align="center">

  <!-- Animated Hero Banner Header -->
  <img src="./assets/animated-header.svg" alt="Trello Monorepo Banner" width="100%" />

  <br />

  <!-- Shield Badges -->
  <p align="center">
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Bun-v1.3%2B-black?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" /></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" /></a>
  </p>

  <p align="center">
    <strong>A high-performance, real-time, full-stack collaborative application suite built with a modern TypeScript monorepo architecture.</strong>
  </p>

</div>

---

## 💡 System Architecture & First Principles

This repository is architected from core software engineering principles to achieve ultra-fast execution, strict type safety across boundaries, clean separation of concerns, and real-time state synchronization.

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
                                              │ Shared ORM (@repo/db)
                                              ▼
                                ┌───────────────────────────┐
                                │   packages/db             │
                                │   Prisma ORM (PostgreSQL) │
                                └───────────────────────────┘
```

### Core Axioms

1. **Single Source of Truth (`packages/db`)**: Database schemas and Prisma client reside exclusively in `@repo/db`, guaranteeing uniform data access and single-type definitions across HTTP REST and WebSocket services.
2. **Stateless HTTP REST API (`apps/Backend`)**: Express v5 service responsible for authentication (JWT/Argon2id), business domain logic, RBAC multi-tenancy, fractional indexing for board cards, and CRUD operations.
3. **Real-time Event Gateway (`apps/websockets`)**: Bi-directional, low-overhead WebSocket engine built on `ws` for live client updates, presence tracing, and real-time board mutations.
4. **Client Application (`apps/frentend`)**: Next.js 16 (App Router) and React 19 front-end, styled with Tailwind CSS v4, providing an intuitive, interactive user interface.
5. **High-Performance Monorepo Tooling**: Powered by **Bun** for fast package resolution and task execution, orchestrated with **Turborepo** for optimized build caching and dependency graph management.

---

## 📁 Monorepo Layout

```text
trello/
├── assets/               # Central animated logo SVGs & brand assets
├── apps/
│   ├── Backend/          # Express v5 REST API service (Port 5500)
│   ├── frentend/         # Next.js 16 Client application (Port 3000)
│   └── websockets/       # Low-latency WebSocket event server (Port 6000)
├── packages/
│   ├── db/               # Centralized Prisma schema & PostgreSQL client (@repo/db)
│   ├── ui/               # Shared React UI component library (@repo/ui)
│   ├── eslint-config/    # Shared ESLint configuration presets (@repo/eslint-config)
│   └── typescript-config/# Shared TypeScript compiler configs (@repo/typescript-config)
├── package.json          # Root scripts & Turbo workspace definition
├── turbo.json            # Turborepo task pipeline configuration
└── bun.lock              # Bun lockfile
```

---

## ⚙️ Network Topology & Ports

| Component | Tech Stack | Port | Protocol | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
| **`frentend`** | Next.js 16, React 19, Tailwind CSS v4 | `3000` | HTTP / WS | User Interface & Client Experience |
| **`Backend`** | Express 5, Pino, Prisma, Zod | `5500` | HTTP (REST) | Auth, Board CRUD, Business Logic |
| **`websockets`** | `ws`, Pino, Prisma | `6000` | WebSocket (`ws://`) | Real-time Broadcast & Event Sync |
| **`db`** | Prisma ORM, PostgreSQL (Neon) | `5432` | TCP / TLS | Data Persistence Layer |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3.4 or higher)
- [Node.js](https://nodejs.org) (v20+ recommended)
- PostgreSQL database instance (Local or Cloud provider like Neon/Supabase)

### Installation & Workspace Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd trello
   ```

2. **Install Workspace Dependencies**:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `packages/db/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/trello_db?schema=public"
   ```

   Create a `.env` file in `apps/Backend/.env`:
   ```env
   PORT=5500
   JWT_SECRET="your-secure-jwt-secret"
   DATABASE_URL="postgresql://user:password@localhost:5432/trello_db?schema=public"
   ```

4. **Generate Prisma Client**:
   ```bash
   cd packages/db
   bunx prisma generate
   ```

---

## 🛠️ Development Workflow

Run commands from the monorepo root:

| Command | Description |
| :--- | :--- |
| `bun run dev` | Launch all apps (`Backend`, `frentend`, `websockets`) concurrently in watch mode |
| `bun run dev --filter=Backend` | Run only the Express Backend service |
| `bun run dev --filter=frentend` | Run only the Next.js Frontend application |
| `bun run dev --filter=websockets` | Run only the WebSocket server |
| `bun run build` | Compile all workspace apps and packages for production |
| `bun run lint` | Run ESLint checks across all monorepo modules |
| `bun run check-types` | Run TypeScript type checking across all workspace modules |
| `bun run format` | Format code using Prettier |

---

## 🧪 Integration Testing

The Backend service includes a 17-step end-to-end fake data integration test suite that tests authentication, organization setup, board creation, list updates, card movements, and RBAC permissions:

```bash
cd apps/Backend
bun src/test-fake-data.ts
```

---

## 🛡️ Code Guidelines & Standards

- **Logging**: Servers use **Pino** for zero-overhead JSON logging with `pino-pretty` development formatting.
- **Database Access**: Imports from `@repo/db` must strictly use the centralized client export (`import { prisma } from "@repo/db"`).
- **Environment Safety**: Never hardcode secret keys, JWT secrets, or DB strings in source files.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

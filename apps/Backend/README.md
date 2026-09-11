<div align="center">
  <img src="../../assets/animated-logo.svg" alt="Backend Logo" width="120" />
  
  # Backend Service (`apps/Backend`)

  <p align="center">
    <strong>Enterprise HTTP REST API Service built with Express 5, Bun, Prisma ORM, Zod Validation & Pino Logging.</strong>
  </p>

  <p align="center">
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-v5.0-black?style=flat-square&logo=express" alt="Express" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun%20v1.3+-black?style=flat-square&logo=bun" alt="Bun" /></a>
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
    <a href="https://zod.dev"><img src="https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat-square&logo=zod" alt="Zod" /></a>
    <a href="https://github.com/pinojs/pino"><img src="https://img.shields.io/badge/Logging-Pino-68829E?style=flat-square" alt="Pino" /></a>
  </p>
</div>

---

## 📚 Technical Documentation Index

Detailed specifications and architectural guides for the Backend REST API service:

1. [📐 Architecture & First-Principles Specification (`ARCHITECTURE.md`)](file:///d:/Complex_backend/trello/apps/Backend/ARCHITECTURE.md)
   - First-principles breakdown of security, identity, RBAC multi-tenancy, fractional indexing for cards, and layered service architecture.
2. [🔌 API Endpoint Specifications (`Endpoints.md`)](file:///d:/Complex_backend/trello/apps/Backend/Endpoints.md)
   - Complete specification of all REST endpoints, request/response bodies, HTTP status codes, and permissions.
3. [📋 Board API Reference (`BOARDS_API.md`)](file:///d:/Complex_backend/trello/apps/Backend/BOARDS_API.md)
   - Detailed specification of Board endpoints, Zod input validation schemas, RBAC security rules, and sample JSON payloads.
4. [🧪 E2E Integration Testing Guide (`TESTING_GUIDE.md`)](file:///d:/Complex_backend/trello/apps/Backend/TESTING_GUIDE.md)
   - Detailed guide for running and extending the 17-step fake data API integration test suite.

---

## 🏗️ Technical Stack & Architectural Rationale

| Component | Technology | Rationale & Responsibility |
| :--- | :--- | :--- |
| **Runtime** | Bun v1.3+ | Fast TypeScript execution engine with native Argon2id password hashing (`Bun.password`). |
| **Framework** | Express 5 | Ultra-fast HTTP routing pipeline with updated middleware specs and async error handling. |
| **Database ORM** | Prisma Client (`@repo/db`) | Type-safe SQL database queries connected to PostgreSQL (Neon). |
| **Input Validation** | Zod | Enforces strict type schemas on request bodies, queries, and parameters before controllers execute. |
| **Security & Auth** | JWT + Argon2id | Stateless Bearer token authentication with dynamic secret verification. |
| **Structured Logging**| Pino + `pino-http` | High-throughput, zero-overhead JSON HTTP logging formatted via `pino-pretty`. |

---

## 📁 Project Structure

```text
apps/Backend/
├── src/
│   ├── index.ts                 # Express app initialization & server entry point
│   ├── test-fake-data.ts        # 17-Step E2E Fake Data Integration Test Suite
│   ├── config/                  # Environment setup & server configurations
│   ├── controllers/             # HTTP Controllers
│   │   ├── auth.controller.ts   # Authentication endpoints (Signup, Signin, GetMe)
│   │   ├── board.controller.ts  # Board, List, & Card CRUD controller
│   │   └── org.controller.ts    # Organization & Member CRUD controller
│   ├── middlewares/             # Express Middlewares
│   │   └── auth.middleware.ts   # JWT Authentication Guard
│   ├── models/                  # Zod Input Validation Schemas
│   │   ├── auth.Schemas.ts
│   │   ├── board.Schemas.ts
│   │   └── org.Schemas.ts
│   ├── routes/                  # Express API Routers
│   │   ├── index.ts             # Main API Router (/api/v1)
│   │   ├── auth.routes.ts       # Auth router (/api/v1/auth)
│   │   ├── board.routes.ts      # Board router (/api/v1/boards)
│   │   └── org.routes.ts        # Organization router (/api/v1/organizations)
│   ├── services/                # Core Business Logic & Database Queries
│   │   ├── auth.service.ts
│   │   ├── board.service.ts
│   │   └── org.service.ts
│   └── utils/                   # Shared Helper Utilities
│       └── jwt.ts               # Token signing & verification utilities
├── ARCHITECTURE.md              # First-Principles Architectural Design
├── Endpoints.md                 # Complete API Endpoint Specification
├── BOARDS_API.md                # Dedicated Board API Specification
├── TESTING_GUIDE.md             # E2E Test Execution & Debugging Guide
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file inside `apps/Backend/.env`:

```env
PORT=5500
JWT_SECRET="your-secure-jwt-secret-key"
DATABASE_URL="postgresql://neondb_owner:your_password@ep-autumn-feather.neon.tech/neondb?sslmode=require"
```

### 2. Launching the Backend Server

```bash
# Standalone Dev Execution (Watch mode)
bun --watch src/index.ts

# Or run from Monorepo Root
bun run dev --filter=Backend
```

The Express HTTP API server will listen on `http://localhost:5500`.

---

## 🧪 E2E Integration Testing

To run the automated end-to-end integration test suite verifying user authentication, organization management, board creation, fractional list positioning, and RBAC security:

```bash
bun src/test-fake-data.ts
```

Output highlights step-by-step API responses, token issuances, and database mutations in real time.

# Backend Service (`apps/Backend`)

The high-performance HTTP REST API service for the Trello monorepo workspace. Built with Bun, Express 5, Prisma ORM, Zod validation, and Pino logging.

---

## 📚 Documentation Index

1. [📐 Architecture & First-Principles Specification (`ARCHITECTURE.md`)](file:///d:/Complex_backend/trello/apps/Backend/ARCHITECTURE.md)
   - First-principles breakdown of security, identity, RBAC multi-tenancy, fractional indexing, and layered architecture.
2. [🔌 API Endpoint Specifications (`Endpoints.md`)](file:///d:/Complex_backend/trello/apps/Backend/Endpoints.md)
   - Complete specification of all REST endpoints, request/response bodies, HTTP status codes, and permissions.
3. [📋 Board API Reference (`BOARDS_API.md`)](file:///d:/Complex_backend/trello/apps/Backend/BOARDS_API.md)
   - Dedicated specification of Board endpoints, Zod input validation, RBAC security rules, and sample payloads.
4. [🧪 E2E Testing Guide (`TESTING_GUIDE.md`)](file:///d:/Complex_backend/trello/apps/Backend/TESTING_GUIDE.md)
   - Detailed guide for running and extending the 17-step fake data API integration test suite.

---

## 🏗️ Technical Stack & First Principles

| Component | Technology | Purpose & Architectural Rationale |
| :--- | :--- | :--- |
| **Runtime** | Bun v1.3+ | Fast JavaScript/TypeScript execution with native password hashing (`Bun.password`). |
| **Framework** | Express 5 | Lightweight, battle-tested HTTP routing and middleware pipeline. |
| **Database ORM**| Prisma Client | Type-safe database queries connected to PostgreSQL (Neon). |
| **Validation** | Zod | Schema validation enforcing strict request body payloads before controller execution. |
| **Auth & Crypto**| JWT + Argon2id | Stateless Bearer token authentication with dynamic secret resolution. |
| **Logger** | Pino + `pino-http` | Programmatic, zero-overhead structured HTTP logging with `pino-pretty`. |

---

## 📁 Directory Structure

```text
apps/Backend/
├── src/
│   ├── index.ts                 # Server entry point & DB handshake
│   ├── test-fake-data.ts        # 17-Step E2E Fake Data Integration Test Suite
│   ├── config/                  # Server configuration files
│   ├── controllers/             # HTTP Controllers
│   │   ├── auth.controller.ts   # Auth routes controller (Signup, Signin, GetMe)
│   │   ├── board.controller.ts  # Board CRUD controller
│   │   └── org.controller.ts    # Organization & Member CRUD controller
│   ├── middlewares/             # Express Middlewares
│   │   └── auth.middleware.ts   # JWT Authentication Guard
│   ├── models/                  # Zod Input Validation Schemas
│   │   ├── auth.Schemas.ts
│   │   ├── board.Schemas.ts
│   │   └── org.Schemas.ts
│   ├── routes/                  # Express API Routers
│   │   ├── index.ts             # Main API Router (/api/v1)
│   │   ├── auth.routes.ts       # Auth routes (/api/v1/auth)
│   │   ├── board.routes.ts      # Board routes (/api/v1/boards)
│   │   └── org.routes.ts        # Organization routes (/api/v1/organizations)
│   ├── services/                # Business Domain Logic & DB Queries
│   │   ├── auth.service.ts
│   │   ├── board.service.ts
│   │   └── org.service.ts
│   └── utils/                   # Shared Helper Utilities
│       └── jwt.ts               # Token sign & verify utilities
├── ARCHITECTURE.md              # First-Principles Architectural Design
├── Endpoints.md                 # Complete API Endpoint Specification
├── BOARDS_API.md                # Dedicated Board API Specification
├── TESTING_GUIDE.md             # E2E Test Execution & Debugging Guide
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Environment Setup

Ensure `apps/Backend/.env` contains your database URL and JWT secret:
```env
JWT_SECRET="vishal@223"
DATABASE_URL="postgresql://neondb_owner:...@ep-autumn-feather-azo07j9q-pooler.../neondb?sslmode=require"
```

### 2. Start the Server

```bash
# Run standalone dev server
bun --watch src/index.ts

# Or run from monorepo root
bun run dev --filter=backend
```
Server listens on: `http://localhost:5500`

---

## 🧪 Automated Testing with Fake Data

Run the end-to-end automated test suite to verify all authentication, organization, and board endpoints:

```bash
bun src/test-fake-data.ts
```

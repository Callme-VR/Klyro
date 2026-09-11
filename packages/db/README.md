<div align="center">
  <img src="../../assets/animated-logo.svg" alt="Database Package Logo" width="120" />

  # Database Package (`@repo/db`)

  <p align="center">
    <strong>Centralized Prisma ORM Schema & PostgreSQL Client Shared Across Monorepo Services.</strong>
  </p>

  <p align="center">
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" /></a>
    <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun-black?style=flat-square&logo=bun" alt="Bun" /></a>
  </p>
</div>

---

## 📐 Architecture & First Principles

The `@repo/db` package is the **Single Source of Truth** for data persistence across the entire monorepo:
1. **Unified Schema**: Defines Prisma models for Users, Organizations, OrganizationMembers, Boards, Lists, and Cards.
2. **Type Safety**: Generates unified TypeScript types used directly by `apps/Backend` and `apps/websockets`.
3. **Singleton Client Instance**: Exports a singleton `PrismaClient` to avoid connection pool exhaustion in serverless or multi-service environments.

---

## 📁 Package Structure

```text
packages/db/
├── prisma/
│   └── schema.prisma    # Primary PostgreSQL relational schema definition
├── src/
│   ├── client.ts        # Prisma Client singleton export (@repo/db/client)
│   └── index.ts         # Package entry point (@repo/db)
├── package.json
└── tsconfig.json
```

---

## 🚀 Environment & Workflow Commands

### 1. Configure Database Connection

Create a `.env` file in `packages/db/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trello_db?schema=public"
```

### 2. Prisma Operations

| Command | Description |
| :--- | :--- |
| `bunx prisma generate` | Generate Prisma Client types in `node_modules/@prisma/client` |
| `bunx prisma db push` | Push Prisma schema changes directly to the target database |
| `bunx prisma migrate dev` | Create and execute database migration scripts |
| `bunx prisma studio` | Open Prisma GUI database browser on `http://localhost:5555` |

---

## 💡 Usage in Workspace Services

Import the shared database client in any monorepo application:

```typescript
import { prisma } from "@repo/db";

// Query database
const boards = await prisma.board.findMany({
  where: { orgId: "org_123" },
  include: { lists: true }
});
```

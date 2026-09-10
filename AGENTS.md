# AGENTS.md — Monorepo Engineering Directives & First-Principles Guidelines

This document specifies mandatory rules, architectural guidelines, and execution boundaries for AI assistants and software engineers contributing to the `trello` monorepo.

---

## 🧠 First-Principles Core Rules

1. **Deconstruct Before Modifying**:
   - Always trace data flow end-to-end: UI (`apps/frentend`) ↔ REST (`apps/Backend`) / WebSocket (`apps/websockets`) ↔ Shared Database (`packages/db`).
   - Do not invent speculative abstractions or duplicated database clients. Reuse the existing `@repo/db` client pattern (`db/client`).

2. **Package Boundaries & Scoping**:
   - Do not cross-import code between `apps/Backend`, `apps/frentend`, and `apps/websockets` directly.
   - Common code, schemas, types, or UI components MUST live inside `packages/` (`packages/db`, `packages/ui`, `packages/typescript-config`, `packages/eslint-config`).

3. **Runtime & Package Management**:
   - Use **Bun** (`bun install`, `bun run`, `bunx`) exclusively as the package manager and runtime executor.
   - Do not add `yarn.lock` or `pnpm-lock.yaml` files.

4. **Logging & Observability**:
   - Do NOT use raw `console.log` in backend services (`apps/Backend`, `apps/websockets`).
   - Always use the structured **Pino** logger instance configured in each service.

5. **Type Safety & Contracts**:
   - Strictly avoid using `any` types.
   - Infer types from Prisma client models or explicitly define TypeScript interfaces/types.
   - Run `bun run check-types` before completing tasks to verify type compliance across all apps.

6. **Port Topologies**:
   - Frontend: `3000`
   - Backend API: `5500`
   - WebSocket Engine: `6000`
   - Do not change port assignments without updating all relevant environment configs and documentation.

---

## 📋 Workspace Task Execution Rules

- **Development**: Execute `bun run dev` from the root directory to leverage Turborepo caching and parallel process spawning.
- **Database Migrations**: Manage database schema changes inside `packages/db/prisma/schema.prisma` and run `bunx prisma generate` or `bunx prisma migrate dev`.
- **Code Edits**: Ensure all edits maintain zero linting errors (`bun run lint`).

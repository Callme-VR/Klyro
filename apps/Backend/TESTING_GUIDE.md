# 🧪 Backend Testing Guide

---

## ⚡ 1. Pure Unit Tests (100% Offline, Zero Database Dependency)

Pure unit tests run in isolation without connecting to any external database server. They will pass **100% of the time**, even when PostgreSQL is completely stopped or disconnected.

Test suites located in `src/__tests__/unit/`:
- `jwt.test.ts` (JWT token generation, signature verification, decoding)
- `password.test.ts` (Argon2id password hashing & verification)
- `schemas.test.ts` (Zod validation schemas across all 6 model domains)
- `services.test.ts` (Fractional order calculation & business logic algorithms)
- `middleware.test.ts` (Authentication middleware header checks, user payload injection, 401 error cases)
- `controllers.test.ts` (HTTP Controllers status code mapping, payload validation responses)

### To Run Pure Unit Tests:

```bash
cd apps/Backend
bun test
```

### Expected Output:
```text
 29 pass
 0 fail
 57 expect() calls
Ran 29 tests across 6 files. [1019.00ms]
```

---

## 🗄️ 2. Database Integration Service Tests (Requires PostgreSQL)

Integration test suites located in `src/__tests__/integration/` execute real Prisma queries against PostgreSQL:
- `auth_service.test.ts` (User registration, 409 duplicate email conflict, login, invalid password, user lookup)
- `org_service.test.ts` (Org creation, member roles, invite generation, invite acceptance, member removal, org deletion)
- `board_and_issue_services.test.ts` (Board, Section, Issue, Assignee, and Comment service operations & author permissions)

### To Run Database Integration Tests:

*Ensure PostgreSQL is running locally before running this command.*

```bash
cd apps/Backend
bun run test:integration
```

---

## 🌐 3. Full API E2E Test Suite (HTTP Server + PostgreSQL)

The test suite in [test-fake-data.ts](file:///d:/Complex_backend/trello/apps/Backend/src/test-fake-data.ts) executes a complete 32-step end-to-end integration flow over HTTP:

### Step 1: Start Backend Server
```bash
cd apps/Backend
bun src/index.ts
```

### Step 2: Execute E2E Test Suite
```bash
cd apps/Backend
bun src/test-fake-data.ts
```

---

## 🛠️ 4. TypeScript Type Checks

```bash
cd apps/Backend
bun run check-types
```

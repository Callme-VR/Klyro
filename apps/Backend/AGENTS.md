# AGENTS.md — Backend Service Directives

Specific development guidelines for `apps/Backend`.

---

## 🎯 Directives & Principles

1. **Routing & Controllers**:
   - Keep route handlers lean and modular. Move business logic into separate controller or service modules as the service expands.
   - Use async route handlers with proper error handling middleware to avoid unhandled promise rejections.

2. **Middleware Usage**:
   - Always retain `express.json()` for parsing incoming JSON request bodies.
   - Retain `cors()` configuration for cross-origin access from the frontend (`http://localhost:3000`).
   - Use `pino-http` logger for automatic HTTP request/response logging.

3. **Database Interactions**:
   - Import `prisma` exclusively from `db/client`.
   - Always wrap explicit database connections and queries in try-catch blocks and log database errors using `logger.error(...)`.

4. **Port Configuration**:
   - Service listens on port `5500`. Do not modify port `5500` without updating the frontend API configuration and monorepo documentation.

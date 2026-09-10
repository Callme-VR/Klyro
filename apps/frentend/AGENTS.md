<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Frontend Application Directives

Specific development guidelines for `apps/frentend`.

---

## 🎯 Directives & Principles

1. **Server & Client Component Boundaries**:
   - Use Server Components by default for static UI rendering and server-side data fetching.
   - Use `"use client"` explicitly only when component logic requires interactivity, React hooks (`useState`, `useEffect`), or WebSocket event listeners.

2. **Styling Conventions**:
   - Use Tailwind CSS v4 utility classes.
   - Maintain accessibility standards (semantic HTML elements, proper `aria-*` attributes, clean focus rings).

3. **Backend Communication**:
   - HTTP REST API URL: `http://localhost:5500` (Backend app).
   - WebSocket URL: `ws://localhost:6000` (Websockets app).
   - Keep API fetch functions and WebSocket hook logic modular and abstracted away from presentational components.

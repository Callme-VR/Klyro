# Frontend Application (`apps/frentend`)

The web client for the Trello monorepo, built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.

---

## 📐 Architectural Design (First Principles)

1. **User Interface Layer**: Provides an interactive, reactive web application for board management, real-time collaboration, and task visualization.
2. **Dual-Channel Integration**:
   - **HTTP REST Channel**: Fetches and mutates persistent data via the Express backend server (`http://localhost:5500`).
   - **WebSocket Channel**: Establishes live bi-directional socket connections with the WebSocket engine (`ws://localhost:6000`) for real-time UI updates.
3. **Modern Styling System**: Styled using **Tailwind CSS v4** with full dark mode support and responsive layout structures.

---

## ⚡ Specifications

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Default Port**: `3000`

---

## 🚀 Running the Application

### From Monorepo Root (Recommended)

```bash
bun run dev --filter=frentend
```

### Standalone Execution

```bash
cd apps/frentend
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Directory Layout

```
apps/frentend/
├── app/
│   ├── globals.css      # Tailwind v4 styles & global rules
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main entry page
├── public/              # Static assets (images, SVGs)
├── next.config.ts       # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Frontend dependencies & scripts
```

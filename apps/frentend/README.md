<div align="center">
  <img src="../../assets/animated-logo.svg" alt="Frontend Client Logo" width="120" />

  # Frontend Application (`apps/frentend`)

  <p align="center">
    <strong>Modern Client Interface built with Next.js 16 (App Router), React 19, & Tailwind CSS v4.</strong>
  </p>

  <p align="center">
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4.0-38BDF8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun-black?style=flat-square&logo=bun" alt="Bun" /></a>
  </p>
</div>

---

## 📐 Architecture & First Principles

1. **Reactive UI Layer**: Built on Next.js 16 App Router and React 19 to provide a smooth, responsive collaborative board experience.
2. **Dual-Gateway Integration**:
   - **HTTP REST Gateway**: Communicates with `apps/Backend` (`http://localhost:5500`) for authentication, organization setup, and board CRUD operations.
   - **WebSocket Event Gateway**: Establishes live bi-directional socket connections with `apps/websockets` (`ws://localhost:6000`) for real-time card movements, live user indicators, and board sync.
3. **Tailwind CSS v4 Styling**: Features full dark mode support, crisp typography, and fluid micro-animations.

---

## ⚡ Specifications

| Feature | Tech / Specification |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Default Port** | `3000` |
| **API Endpoint** | `http://localhost:5500/api/v1` |
| **WebSocket Endpoint** | `ws://localhost:6000` |

---

## 📁 Directory Structure

```text
apps/frentend/
├── app/
│   ├── globals.css      # Tailwind CSS v4 styles & global theme tokens
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main entry dashboard page
├── public/              # Static public assets (images, SVGs, brand assets)
│   └── assets/
│       └── logo2.png    # Primary brand logo asset
├── next.config.ts       # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Frontend dependencies & scripts
```

---

## 🚀 Execution & Development

### Monorepo Execution (Recommended)

From the monorepo root:

```bash
bun run dev --filter=frentend
```

### Standalone Execution

```bash
cd apps/frentend
bun dev
```

Navigate to `http://localhost:3000` in your web browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file inside `apps/frentend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5500/api/v1"
NEXT_PUBLIC_WS_URL="ws://localhost:6000"
```

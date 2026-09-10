# Production Deployment Guide

This guide provides step-by-step instructions to push your monorepo codebase to **GitHub** and deploy each service cleanly to **Vercel** and **Render**.

---

## 🏗️ Architecture Summary

This repository is structured as a **Turborepo Monorepo**:

| Application / Package | Technology Stack | Deployment Target | Service Type |
| :--- | :--- | :--- | :--- |
| **`apps/frentend`** | Next.js 16, React 19, TailwindCSS | **Vercel** | Web Frontend |
| **`apps/Backend`** | Express.js, Bun/Node, Pino | **Render** | Web Service (HTTP API) |
| **`apps/websockets`** | `ws`, Bun/Node | **Render** | Web Service (Persistent WS) |
| **`packages/db`** | Prisma ORM, PostgreSQL | **Render Postgres / Neon / Supabase** | Database Layer |

> ℹ️ **How Vercel & Render Catch Monorepo Services**: 
> When you push your single GitHub repository, Vercel and Render locate the target app using **Root Directory** paths, custom **Start Commands**, and **Build Filters** (so each platform only builds its assigned app).

> ⚠️ **Note on WebSockets & Vercel**: Vercel Serverless Functions do **not** support persistent WebSocket connections. Therefore, `apps/websockets` **must** be deployed on a persistent server platform like **Render**, **Railway**, or **Fly.io**.

---

## 🔒 Step 1: Secure GitHub Commit & Push Workflow

Before pushing your code to GitHub, ensure sensitive environment credentials (`.env`) and build artifacts are completely ignored.

### 1.1 Verify `.gitignore` Security Check
Ensure your root `.gitignore` excludes sensitive files:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment Variables (CRITICAL)
.env
.env.*
!.env.example

# Build & Cache Directories
.next/
out/
build/
dist/
.turbo/
.turbo-clone-temp/
.vercel/

# Logs & System Files
*.log
.DS_Store
```

### 1.2 Stage, Commit, and Push safely to GitHub

Run the following commands in your terminal at the repository root (`trello/`):

```bash
# 1. Check current git status (Verify no .env files are staged)
git status

# 2. Add all untracked files
git add .

# 3. Commit your changes with a descriptive message
git commit -m "feat: setup project structure for Vercel and Render deployment"

# 4. Set default branch to main (if not already set)
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin https://github.com/Callme-VR/Klyro.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🗄️ Step 2: Database Provisioning (PostgreSQL)

You need a managed PostgreSQL database for Prisma (`packages/db`).

### Option A: Render PostgreSQL / Neon / Supabase (Recommended)
1. Create a PostgreSQL instance on [Neon](https://neon.tech), [Render](https://render.com), or [Supabase](https://supabase.com).
2. Copy the connection string format:
   ```env
   DATABASE_URL="postgresql://user:password@ep-host.pooler.region.aws.neon.tech/dbname?sslmode=require"
   ```

### 2.1 Push Database Schema
To sync your Prisma schema to your remote PostgreSQL database:

```bash
cd packages/db
bun db:push
```

---

## 🚀 Step 3: Deploying Services on Render

You will deploy **two separate Web Services** on Render: `Backend` and `websockets`.

---

### Service 3.1: Deploy Express API (`apps/Backend`)

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Web Service**.
2. Connect your GitHub repository: `Callme-VR/Klyro`.
3. Configure the service settings:
   - **Name**: `klyro-backend-api`
   - **Region**: Choose same region as PostgreSQL (e.g. Singapore / US East).
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Node` (or `Bun`)
   - **Build Command**:
     ```bash
     bun install && npx prisma generate --schema=packages/db/prisma/schema.prisma
     ```
   - **Start Command**:
     ```bash
     bun apps/Backend/src/index.ts
     ```
   - **Build Filter / Included Paths** *(Advanced)*:
     `apps/Backend/**, packages/db/**` *(tells Render to only rebuild this service when backend or database code changes)*
   - **Instance Type**: Free or Starter.

4. Add **Environment Variables** in Render Dashboard:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production environment mode |
   | `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
   | `JWT_SECRET` | `your_super_secret_jwt_key_here` | Secret key for signing JWT tokens |
   | `PORT` | `10000` *(Auto-assigned by Render)* | Port bound automatically |

5. Click **Create Web Service**. Note your deployment URL:
   `https://klyro-backend-api.onrender.com`

---

### Service 3.2: Deploy WebSockets Server (`apps/websockets`)

1. Click **New +** → **Web Service** in Render.
2. Select your GitHub repository: `Callme-VR/Klyro`.
3. Configure settings:
   - **Name**: `klyro-websockets`
   - **Region**: Same region as PostgreSQL & Backend API.
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Node` (or `Bun`)
   - **Build Command**:
     ```bash
     bun install && npx prisma generate --schema=packages/db/prisma/schema.prisma
     ```
   - **Start Command**:
     ```bash
     bun apps/websockets/index.ts
     ```
   - **Build Filter / Included Paths** *(Advanced)*:
     `apps/websockets/**, packages/db/**`

4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `DATABASE_URL` | `postgresql://...` | Connection string |

5. Click **Create Web Service**. Note your WebSocket service URL:
   `wss://klyro-websockets.onrender.com`

---

## ⚡ Step 4: Deploying Next.js Frontend (`apps/frentend`) on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new) and import your GitHub repository: `Callme-VR/Klyro`.
2. Select your repository and configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/frentend` *(Click Edit and select `apps/frentend`)*
   - **Build Command**: `cd ../.. && bun install && turbo run build --filter=frentend`
   - **Install Command**: `bun install`

3. Expand **Environment Variables** and add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://klyro-backend-api.onrender.com/api/v1` | Points to Render Backend API |
   | `NEXT_PUBLIC_WS_URL` | `wss://klyro-websockets.onrender.com` | Points to Render WebSocket Server |

4. Click **Deploy**. Vercel will build and assign your domain:
   `https://your-app-name.vercel.app`

---

## 📋 Environment Variables Checklist Matrix

Make sure every service has its required keys populated in production:

```
[apps/frentend] (.env / Vercel Env Settings)
├── NEXT_PUBLIC_API_URL=https://<your-render-backend>.onrender.com/api/v1
└── NEXT_PUBLIC_WS_URL=wss://<your-render-websockets>.onrender.com

[apps/Backend] (Render Web Service Env)
├── DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require
├── JWT_SECRET=<random-64-character-string>
└── PORT=10000 (Set dynamically by Render)

[apps/websockets] (Render Web Service Env)
├── DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require
└── PORT=10000 (Set dynamically by Render)
```

---

## 🛠️ Post-Deployment Verification & Checklist

1. **CORS Configuration**:
   Ensure `apps/Backend/src/index.ts` allows requests from your Vercel URL. If CORS issues occur, specify allowed origins in Express:
   ```ts
   app.use(cors({
     origin: ["https://your-app-name.vercel.app", "http://localhost:3000"],
     credentials: true
   }));
   ```

2. **WebSocket WSS Protocol**:
   In production, Next.js served over HTTPS requires secure WebSockets (`wss://`). Ensure your frontend connects via `wss://` on Render.

3. **Prisma Client Generation**:
   If Prisma Client is missing during build, confirm that `npx prisma generate` runs as part of the build step before starting the application server.

4. **Continuous Integration (CI/CD)**:
   Every time you `git push` to `main`, Vercel and Render will automatically rebuild and deploy your updated code!

<div align="center">
  <img src="../../assets/animated-logo.svg" alt="TypeScript Config Logo" width="120" />

  # Shared TypeScript Configurations (`@repo/typescript-config`)

  <p align="center">
    <strong>Centralized TypeScript Compiler Presets Shared Across Monorepo Apps and Packages.</strong>
  </p>

  <p align="center">
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-Workspace-EF4444?style=flat-square&logo=turborepo" alt="Turborepo" /></a>
  </p>
</div>

---

## 📐 Overview

The `@repo/typescript-config` package exports base and specialized `tsconfig.json` configurations to enforce strict type checking, consistent module resolution, and target options across all monorepo modules.

---

## 📁 Available Compiler Presets

| Config Preset | Purpose & Target Application |
| :--- | :--- |
| `base.json` | Core TypeScript configuration for Node.js / Bun services (`Backend`, `websockets`, `db`) |
| `nextjs.json` | Next.js 16 App Router compiler settings for `apps/frentend` |
| `react-library.json` | React component library compiler settings for `@repo/ui` |

---

## 💡 Usage in Apps & Packages

Extend a preset in an application's `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src/**/*"]
}
```

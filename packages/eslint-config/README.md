<div align="center">
  <img src="../../assets/animated-logo.svg" alt="ESLint Config Logo" width="120" />

  # Shared ESLint Configurations (`@repo/eslint-config`)

  <p align="center">
    <strong>Centralized Code Quality & Linting Rules Shared Across Monorepo Apps and Packages.</strong>
  </p>

  <p align="center">
    <a href="https://eslint.org"><img src="https://img.shields.io/badge/ESLint-v9-4B32C6?style=flat-square&logo=eslint" alt="ESLint" /></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-Config-000000?style=flat-square&logo=next.js" alt="Next.js Config" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-Config-61DAFB?style=flat-square&logo=react" alt="React Config" /></a>
  </p>
</div>

---

## 📐 Overview

The `@repo/eslint-config` package exports modular, composable ESLint configuration presets to enforce code standards, prevent bugs, and maintain clean formatting across all applications and shared packages.

---

## 📁 Available Configuration Presets

| Preset Path | Description & Target Application |
| :--- | :--- |
| `@repo/eslint-config/base` | Base TypeScript and Node.js code linting rules |
| `@repo/eslint-config/next-js` | Next.js App Router & React rules for `apps/frentend` |
| `@repo/eslint-config/react-internal` | Rules tailored for React UI libraries (`packages/ui`) |

---

## 💡 Usage in Apps & Packages

Extend a preset in an application's `eslint.config.mjs`:

```javascript
import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [...config];
```

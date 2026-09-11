<div align="center">
  <img src="../../assets/animated-logo.svg" alt="UI Package Logo" width="120" />

  # Shared UI Library (`@repo/ui`)

  <p align="center">
    <strong>Reusable React 19 Component Library Shared Across Monorepo Web Applications.</strong>
  </p>

  <p align="center">
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  </p>
</div>

---

## 📐 Architecture & Principles

The `@repo/ui` package contains atomic React 19 design components styled with Tailwind CSS v4. It enforces UI consistency across `apps/frentend` and future web applications.

---

## 📁 Package Structure

```text
packages/ui/
├── src/
│   ├── button.tsx       # Reusable Button component
│   ├── card.tsx         # Card layout container component
│   └── code.tsx         # Code display block component
├── package.json         # Component exports configuration
├── tsconfig.json        # TypeScript configuration
└── eslint.config.mjs    # Shared ESLint configuration
```

---

## 💡 Usage in Frontend Applications

Import UI components directly into React 19 applications:

```tsx
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export default function Dashboard() {
  return (
    <Card className="p-6">
      <Button appName="Frontend">Create New Board</Button>
    </Card>
  );
}
```

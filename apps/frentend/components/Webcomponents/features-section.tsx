"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, LayoutGrid, Layers, Server } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Instant WebSocket Sync",
    description:
      "All card movements, updates, and additions stream bi-directionally across clients with zero latency using WebSockets.",
    badge: "Real-Time",
  },
  {
    icon: LayoutGrid,
    title: "Dynamic Board Rooms",
    description:
      "Seamless Next.js App Router dynamic parameter routes (`/board/[boardId]`) allow instant room creation and sharing.",
    badge: "App Router",
  },
  {
    icon: Layers,
    title: "Shadcn & Base UI",
    description:
      "Built with high-performance Tailwind v4 styles, Radix/Base UI primitives, and custom accessible interactive dialogs.",
    badge: "UI Suite",
  },
  {
    icon: Server,
    title: "Bun & Monorepo Ready",
    description:
      "Optimized for high-speed Bun package execution and clean monorepo separation between frontend and backend.",
    badge: "Stack",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800/60 bg-[#f8f4f0]/50 dark:bg-zinc-950/60 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] bg-[#ff4f00]/10 font-mono text-xs rounded-full">
            Architecture & Capabilities
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors duration-300">
            Engineered for High-Performance Workspaces
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
            Everything you need for seamless project tracking and collaborative team execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-lg dark:shadow-xl hover:border-[#ff4f00]/50 transition-all duration-300 rounded-[12px]"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/10 border border-[#ff4f00]/20 text-[#ff4f00]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] rounded-full">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

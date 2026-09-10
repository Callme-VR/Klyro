"use client";

import React from "react";
import { VercelFull } from "@/components/ui/svgs/vercel";
import { SupabaseFull } from "@/components/ui/svgs/supabase";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <img src="/assets/logo2.png" alt="Klyro Logo" className="h-8 w-8 object-contain" />
      <span className="font-extrabold text-xl text-zinc-900 dark:text-white">Klyro</span>
    </div>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <img src="/assets/logo2.png" alt="Klyro Icon" className={`h-6 w-6 object-contain ${className || ""}`} />
  );
};

export function TechStackLogos() {
  return (
    <section className="border-t border-b border-zinc-200 dark:border-zinc-800/80 bg-[#f8f4f0]/60 dark:bg-zinc-900/40 py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
        <p className="text-xs font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
          POWERED BY NEXT-GEN PRODUCTION INFRASTRUCTURE
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-[#ff4f00]">▲</span> NEXT.JS 16
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-emerald-500">⚡</span> WEBSOCKETS
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-blue-500">TYPESCRIPT</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-sky-500">POSTGRESQL</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-amber-500">ZOD VALIDATION</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">
            <span className="text-purple-500">TURBOPACK</span>
          </div>
        </div>
      </div>
    </section>
  );
}

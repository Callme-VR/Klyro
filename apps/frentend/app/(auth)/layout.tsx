import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/Webcomponents/mode-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Warm Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112 h-112 bg-[#ff4f00]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Controls: Back to Home & Theme Toggle */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] px-3.5 py-2 rounded-[12px] bg-[#f8f4f0] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 transition-all active:scale-95 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4 text-[#ff4f00]" />
          <span>Back to Home</span>
        </Link>
        <ModeToggle />
      </div>

      {/* Brand Header */}
      <div className="mb-6 mt-12 sm:mt-0 flex items-center gap-2.5 z-10">
        <img
          src="/assets/logo2.png"
          alt="Klyro Logo"
          className="h-9 w-9 object-contain"
        />
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition">
          Klyro
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}

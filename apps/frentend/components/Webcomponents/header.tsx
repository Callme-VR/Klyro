"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Kanban, ArrowRight, User as UserIcon, LogOut } from "lucide-react";
import { ModeToggle } from "@/components/Webcomponents/mode-toggle";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-[#fffefb]/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/assets/logo2.png"
            alt="Klyro Logo"
            className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">
            Klyro
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-colors">
          <a href="#hero" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Workspace
          </a>
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Architecture
          </a>
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/organizations"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer transition-all active:scale-95"
                )}
              >
                Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-zinc-500 hover:text-red-400 transition cursor-pointer rounded-[12px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer transition-all active:scale-95"
                )}
              >
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



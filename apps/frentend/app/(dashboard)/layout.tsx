"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Kanban,
  LogOut,
  Building2,
  Menu,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ModeToggle } from "@/components/Webcomponents/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      name: "Organizations",
      href: "/organizations",
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 border-r border-zinc-200 dark:border-zinc-800/80 bg-[#fffefb] dark:bg-zinc-900/95 backdrop-blur-md flex flex-col justify-between transition-all duration-300 ease-in-out",
          isCollapsed && !isMobileOpen ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col flex-1 p-3 space-y-6 overflow-y-auto overflow-x-hidden">
          {/* Brand Header & Toggle Button */}
          <div className={cn("flex items-center justify-between px-1 pt-2 gap-2", isCollapsed && !isMobileOpen && "justify-center flex-col gap-3")}>
            <Link href="/organizations" className="flex items-center gap-2.5 group shrink-0 overflow-hidden">
              <img
                src="/assets/logo2.png"
                alt="Klyro Logo"
                className="h-8 w-8 object-contain shrink-0"
              />
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                  Klyro
                </span>
              )}
            </Link>

            {/* Desktop Collapse/Expand Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer shrink-0"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5 text-[#ff4f00]" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {(!isCollapsed || isMobileOpen) && (
              <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-2 truncate">
                Main Menu
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed && !isMobileOpen ? item.name : undefined}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all duration-200",
                    isCollapsed && !isMobileOpen ? "justify-center" : "justify-between",
                    isActive
                      ? "bg-[#ff4f00]/10 border border-[#ff4f00]/30 text-[#ff4f00] shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.name}</span>}
                  </div>
                  {(!isCollapsed || isMobileOpen) && isActive && (
                    <ChevronRight className="h-4 w-4 text-[#ff4f00] shrink-0 ml-2" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Profile & Mode Switcher */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-3 bg-[#f8f4f0]/60 dark:bg-zinc-950/40">
          <div className={cn("flex items-center gap-2", isCollapsed && !isMobileOpen ? "flex-col justify-center" : "justify-between")}>
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
              <Avatar className="h-9 w-9 shrink-0 border border-zinc-300 dark:border-zinc-700">
                <AvatarFallback className="bg-[#ff4f00] text-xs text-[#fffefb] font-extrabold">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              {(!isCollapsed || isMobileOpen) && (
                <div className="text-left min-w-0 overflow-hidden">
                  <p className="text-xs font-semibold truncate text-zinc-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            <ModeToggle />
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-[12px] transition cursor-pointer border border-red-500/20 active:scale-95",
              isCollapsed && !isMobileOpen && "px-0 py-2 justify-center"
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out", isCollapsed ? "lg:pl-20" : "lg:pl-64")}>
        {/* Mobile Header Toggle Bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-[#fffefb]/90 dark:bg-zinc-900/90 backdrop-blur-md">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo2.png"
              alt="Klyro Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold text-base">Klyro</span>
          </div>
          <ModeToggle />
        </header>

        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

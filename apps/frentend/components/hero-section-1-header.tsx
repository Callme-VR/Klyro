"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Menu, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/Webcomponents/mode-toggle";
import { useAuth } from "@/context/auth-context";

const menuItems = [
  { name: "Workspace", href: "#hero" },
  { name: "Features", href: "#features" },
  { name: "Architecture", href: "#architecture" },
  { name: "Organizations", href: "/organizations" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!menuState) return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateOverflow = () => {
      document.documentElement.classList.toggle("overflow-hidden", mediaQuery.matches);
    };
    updateOverflow();
    mediaQuery.addEventListener("change", updateOverflow);
    return () => {
      mediaQuery.removeEventListener("change", updateOverflow);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [menuState]);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-[#fffefb]/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative flex flex-wrap items-center justify-between py-3.5 max-lg:gap-6">
            {/* Brand Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="Klyro Home" className="flex items-center gap-2.5 group">
                <img
                  src="/assets/logo2.png"
                  alt="Klyro Logo"
                  className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
                />
                <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors">
                  Klyro
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 block cursor-pointer p-1.5 text-zinc-600 dark:text-zinc-300 lg:hidden"
              >
                {menuState ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Center Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Action Controls */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <ModeToggle />

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/organizations">
                        <span>Dashboard</span>
                        <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                      </Link>
                    }
                    className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold text-xs h-9 px-4 rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all"
                  />
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-[12px] transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    nativeButton={false}
                    variant="ghost"
                    render={<Link href="/login">Sign In</Link>}
                    className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white h-9 px-3 rounded-[12px]"
                  />
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/signup">
                        <span>Get Started</span>
                        <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                      </Link>
                    }
                    className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold text-xs h-9 px-4 rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Mobile Dropdown Menu */}
            {menuState && (
              <div className="w-full lg:hidden py-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex flex-col space-y-3">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#ff4f00]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <ModeToggle />
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-1.5 text-xs font-semibold bg-[#ff4f00] text-white rounded-[12px]"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

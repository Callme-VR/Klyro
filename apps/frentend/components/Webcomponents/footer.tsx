"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to TrelloSync updates!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#f4efe6] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 border-t border-zinc-300/80 dark:border-zinc-800 transition-colors duration-300 font-sans selection:bg-[#ff4f00] selection:text-white">
      {/* SECTION 1: TOP GRID ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-300/80 dark:divide-zinc-800 border-b border-zinc-300/80 dark:border-zinc-800">

        {/* Cell 1: Big Headline */}
        <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-[1.1] text-zinc-900 dark:text-white">
            REAL-TIME COLLABORATION THAT WORKS INSIDE YOUR WORKSPACE
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WEBSOCKET ENGINE ONLINE v2.4</span>
          </div>
        </div>

        {/* Cell 2: COMPANY */}
        <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            COMPANY
          </span>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <Link href="/" className="text-[#ff4f00] hover:underline font-semibold block">
                Home
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                About us
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/organizations" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Organizations
              </Link>
            </li>
          </ul>
        </div>

        {/* Cell 3: PRODUCT */}
        <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            PRODUCT
          </span>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <Link href="/organizations" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Kanban Boards
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Real-time Sync
              </Link>
            </li>
            <li>
              <Link href="#features" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Live Drag & Drop
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Cell 4: RESOURCES */}
        <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            RESOURCES
          </span>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Insights
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                API Docs
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                System Status
              </a>
            </li>
            <li>
              <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Cell 5: 3D Isometric Wireframe Graphic (Like the image) */}
        <div className="md:col-span-2 p-6 sm:p-8 flex items-center justify-center bg-zinc-200/40 dark:bg-zinc-900/40">
          <svg
            className="w-24 h-24 sm:w-28 sm:h-28 text-zinc-900 dark:text-white"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Isometric 3D Wireframe Box Construct */}
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" />
            <path d="M50 10 L50 90" />
            <path d="M15 30 L50 50 L85 30" />
            <path d="M15 70 L50 50 L85 70" />
            {/* Inner Trello Column Wireframe detail */}
            <path d="M32 40 L32 60" strokeDasharray="2 2" strokeWidth="1" />
            <path d="M68 40 L68 60" strokeDasharray="2 2" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* SECTION 2: MIDDLE GRID ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-300/80 dark:divide-zinc-800 border-b border-zinc-300/80 dark:border-zinc-800">

        {/* Cell 1: SUBSCRIBE */}
        <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-2">
              SUBSCRIBE
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Want to see more cool workspace features like this? Sign up for occasional updates from Klyro.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:border-[#ff4f00] transition-colors rounded-none overflow-hidden">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-xs bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 border-l border-zinc-300 dark:border-zinc-700 hover:bg-[#ff4f00] hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center"
              aria-label="Subscribe"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Cell 2: ADDRESS */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-2">
              ADDRESS
            </span>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
              100 Market St, San Francisco, CA 94105, USA
            </p>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors"
          >
            Direction <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Cell 3: NEW BUSINESS & GENERAL INQUIRIES */}
        <div className="md:col-span-3 divide-y divide-zinc-300/80 dark:divide-zinc-800">
          <div className="p-6 sm:p-8 space-y-1">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-1">
              NEW BUSINESS
            </span>
            <a href="mailto:business@klyro.com" className="text-xs font-medium text-zinc-900 dark:text-white hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
              business@klyro.com
            </a>
          </div>

          <div className="p-6 sm:p-8 space-y-1">
            <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-1">
              GENERAL INQUIRIES
            </span>
            <a href="mailto:hello@klyro.com" className="text-xs font-medium text-zinc-900 dark:text-white hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors block">
              hello@klyro.com
            </a>
          </div>
        </div>

        {/* Cell 4: SOCIAL */}
        <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
          <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            SOCIAL
          </span>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium">
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              Website
            </a>
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              Discord
            </a>
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              Twitter / X
            </a>
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-zinc-800 dark:text-zinc-300 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
              Status
            </a>
          </div>
        </div>

      </div>

      {/* SECTION 3: ARCHITECTURAL BLUEPRINT BANNER WITH "+" CORNER TICKS */}
      <div className="relative p-8 sm:p-12 md:p-16 border-b border-zinc-300/80 dark:border-zinc-800 bg-[#eee9df] dark:bg-zinc-950 overflow-hidden select-none">
        {/* Architectural 4-Corner Crosshair Ticks */}
        <span className="absolute top-2 left-2 text-zinc-400 dark:text-zinc-600 font-mono text-xs font-light">+</span>
        <span className="absolute top-2 right-2 text-zinc-400 dark:text-zinc-600 font-mono text-xs font-light">+</span>
        <span className="absolute bottom-2 left-2 text-zinc-400 dark:text-zinc-600 font-mono text-xs font-light">+</span>
        <span className="absolute bottom-2 right-2 text-zinc-400 dark:text-zinc-600 font-mono text-xs font-light">+</span>

        {/* Blueprint Grid Lines Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#201515_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

        {/* Wireframe Outline Text Graphics */}
        <div className="w-full flex justify-center items-center py-4">
          <svg className="w-full h-auto max-h-36 sm:max-h-48 md:max-h-56" viewBox="0 0 1000 180" fill="none">
            {/* Outline Text rendering "TRELLO SYNC" with blueprint strokes & vertex crosses */}
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              className="text-zinc-800 dark:text-zinc-200 font-extrabold tracking-[0.2em] uppercase text-[120px]"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              KLYRO
            </text>

            {/* Technical Construction Lines and Tick Marks */}
            <line x1="50" y1="20" x2="950" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />
            <line x1="50" y1="160" x2="950" y2="160" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />
            <circle cx="80" cy="20" r="2" fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
            <circle cx="920" cy="20" r="2" fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
            <circle cx="80" cy="160" r="2" fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
            <circle cx="920" cy="160" r="2" fill="currentColor" className="text-zinc-500 dark:text-zinc-400" />
          </svg>
        </div>
      </div>

      {/* SECTION 4: BOTTOM COPYRIGHT & LEGAL BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-300/80 dark:divide-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
        <div className="md:col-span-6 p-4 flex items-center justify-between sm:justify-start gap-4">
          <span>© {new Date().getFullYear()} KLYRO. ALL RIGHTS RESERVED.</span>
          <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-500">CRAFTED FOR COLLABORATIVE TEAMS</span>
        </div>

        <div className="md:col-span-6 grid grid-cols-3 divide-x divide-zinc-300/80 dark:divide-zinc-800 text-center">
          <Link href="#" className="p-4 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="p-4 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
            Terms & Conditions
          </Link>
          <Link href="#" className="p-4 hover:text-[#ff4f00] dark:hover:text-[#ff4f00] transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}


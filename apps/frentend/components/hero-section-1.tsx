"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Kanban, Users, Search, Plus, LayoutGrid, Layers, Settings, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeroHeader } from "@/components/hero-section-1-header";
import { TechStackLogos } from "@/components/logo";

export default function HeroSection() {
  const router = useRouter();
  const [boardId, setBoardId] = useState("sprint-alpha");
  const [error, setError] = useState<string | null>(null);

  const handleJoinBoard = (targetBoardId?: string) => {
    const target = (targetBoardId || boardId).trim();
    if (!target) {
      setError("Please enter a valid Board ID");
      return;
    }
    setError(null);
    router.push(`/boards/${encodeURIComponent(target)}`);
  };

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 transition-colors duration-300">
        <section id="hero" className="relative pt-28 md:pt-36 pb-16 md:pb-24">
          {/* Ambient Saturated Zapier Orange Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-96 bg-[#ff4f00]/10 blur-[140px] pointer-events-none rounded-full"
          />

          <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-8 text-center">

            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/90 dark:bg-zinc-900/90 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:border-[#ff4f00]/40 transition-all shadow-xs group"
              >
                <span className="font-extrabold text-[#ff4f00]">New:</span>
                <span>Real-Time WebSocket Canvas Engine v2.4</span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Main Centered Headline (display-xl 56px per DESIGN.md) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[#201515] dark:text-white max-w-4xl mx-auto leading-[1.12]"
            >
              Real-Time Collaborative Workspace, <br />
              <span className="bg-gradient-to-r from-[#ff4f00] via-amber-500 to-[#ff4f00] bg-clip-text text-transparent">
                Beautifully Connected
              </span>
            </motion.h1>

            {/* Subtitle Paragraph (body-lg 20px per DESIGN.md) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-[20px] text-[#605d52] dark:text-zinc-400 max-w-2xl mx-auto leading-[30px] font-normal"
            >
              Every board, card, team presence signal, and live update in one living workspace that helps agile teams turn momentum into results.
            </motion.p>

            {/* Action Buttons Group (button-md 18px / 12px rounded per DESIGN.md) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
            >
              <Button
                nativeButton={false}
                size="lg"
                render={
                  <Link href="/signup">
                    <span>Explore Workspaces</span>
                    <ArrowRight className="ml-2 h-4 w-4 inline" />
                  </Link>
                }
                className="w-full sm:w-auto bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold h-12 px-7 rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all text-sm"
              />

              <Button
                nativeButton={false}
                size="lg"
                variant="outline"
                render={
                  <Link href="#board-join">
                    <span>Watch the Flow</span>
                  </Link>
                }
                className="w-full sm:w-auto border-zinc-300 dark:border-zinc-700 bg-[#f8f4f0] dark:bg-zinc-900 text-[#201515] dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 font-semibold h-12 px-7 rounded-[12px] transition-all text-sm"
              />
            </motion.div>

            {/* Direct Board Room Join Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              id="board-join"
              className="pt-2 max-w-md mx-auto"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleJoinBoard();
                }}
                className="flex gap-2 p-1.5 rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb]/95 dark:bg-zinc-900/90 shadow-xl backdrop-blur"
              >
                <Input
                  type="text"
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  placeholder="Enter Board ID (e.g. sprint-alpha)"
                  className="flex-1 border-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                />
                <Button
                  type="submit"
                  className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold h-9 px-4 rounded-[12px] text-xs transition-all shadow-md shadow-[#ff4f00]/20"
                >
                  Join Canvas
                </Button>
              </form>
              {error && <p className="text-xs text-red-500 font-medium text-center mt-1.5">{error}</p>}

              <div className="flex items-center justify-center gap-1.5 pt-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                <span>Quick demo rooms:</span>
                {["sprint-alpha", "board-1", "design-hub"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleJoinBoard(preset)}
                    className="px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:text-[#ff4f00] hover:border-[#ff4f00]/40 transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Bottom Dashboard App Shell Preview Mockup (Animated reveal) */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="pt-8 max-w-5xl mx-auto text-left"
            >
              <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 shadow-2xl overflow-hidden transition-all duration-300">

                {/* App Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/80 dark:bg-zinc-900/80">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-800" />
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                      <Kanban className="h-3.5 w-3.5 text-[#ff4f00]" />
                      <span>Klyro Workspace / sprint-alpha</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live WebSocket Connected</span>
                    </div>
                    <div className="flex -space-x-1.5">
                      <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                        <AvatarFallback className="bg-[#ff4f00] text-[10px] text-white font-bold">AM</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                        <AvatarFallback className="bg-emerald-600 text-[10px] text-white font-bold">SK</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                        <AvatarFallback className="bg-zinc-800 text-[10px] text-white font-bold">+3</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                {/* App Content Body: Left Sidebar + Kanban Board Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">

                  {/* Left Sidebar */}
                  <div className="md:col-span-3 border-r border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/40 dark:bg-zinc-900/40 p-4 space-y-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-2.5 py-1.5 rounded-[8px] bg-[#ff4f00]/10 text-[#ff4f00] font-semibold">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4" />
                          <span>Active Board</span>
                        </div>
                        <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] text-[9px] px-1 py-0">LIVE</Badge>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition cursor-pointer">
                        <Layers className="h-4 w-4" />
                        <span>All Workspaces</span>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition cursor-pointer">
                        <Users className="h-4 w-4" />
                        <span>Team Members</span>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition cursor-pointer">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                      <p className="px-2.5 text-[10px] uppercase font-mono text-zinc-400 tracking-wider">Starred Boards</p>
                      <div className="mt-2 space-y-1">
                        <div className="px-2.5 py-1 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] flex items-center justify-between">
                          <span>sprint-alpha</span>
                          <span className="h-2 w-2 rounded-full bg-[#ff4f00]" />
                        </div>
                        <div className="px-2.5 py-1 text-zinc-500 text-[11px] font-mono">board-1</div>
                        <div className="px-2.5 py-1 text-zinc-500 text-[11px] font-mono">design-hub</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Board View: 3 Columns */}
                  <div className="md:col-span-9 p-4 bg-[#fffefb] dark:bg-zinc-950 space-y-4">

                    {/* Top Toolbar */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">Sprint Alpha Backlog</span>
                        <Badge variant="outline" className="text-[10px] border-zinc-300 dark:border-zinc-800">12 Tasks</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Filter cards..."
                            disabled
                            className="pl-8 pr-3 py-1 text-xs border border-zinc-200 dark:border-zinc-800 rounded-[6px] bg-zinc-50 dark:bg-zinc-900 text-zinc-400 w-36 sm:w-48"
                          />
                        </div>
                        <button className="flex items-center gap-1 bg-[#ff4f00] text-white text-xs font-semibold px-2.5 py-1 rounded-[6px]">
                          <Plus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Add Card</span>
                        </button>
                      </div>
                    </div>

                    {/* Columns Mockup */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                      {/* Column 1: To Do */}
                      <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/60 dark:bg-zinc-900/60 p-3 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          <span>To Do</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-300 dark:border-zinc-800">2</Badge>
                        </div>

                        <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 space-y-1.5 shadow-xs">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">WebSocket Connection Guard</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">Ensure zero drop reconnects on token expiry</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-[#ff4f00] font-mono font-bold bg-[#ff4f00]/10 px-1.5 py-0.5 rounded">Backend</span>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-zinc-800 text-[9px] text-white font-bold">AK</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>

                        <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 space-y-1.5 shadow-xs">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Zapier Design System Tokens</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">Update color variables to warm cream & orange</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">UI Design</span>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-[#ff4f00] text-[9px] text-white font-bold">AM</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: In Progress */}
                      <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/60 dark:bg-zinc-900/60 p-3 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          <span>In Progress</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#ff4f00]/40 text-[#ff4f00] bg-[#ff4f00]/10">1</Badge>
                        </div>

                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="rounded-[8px] border border-[#ff4f00]/50 bg-[#ff4f00]/10 p-3 space-y-1.5 shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Live Drag & Drop Cards</p>
                            <MoreHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                          </div>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-1">Broadcasting position x/y to room subscribers</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-[#ff4f00] font-mono font-extrabold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Syncing Now
                            </span>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-emerald-600 text-[9px] text-white font-bold">SK</AvatarFallback>
                            </Avatar>
                          </div>
                        </motion.div>
                      </div>

                      {/* Column 3: Done */}
                      <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/60 dark:bg-zinc-900/60 p-3 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          <span>Done</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-500">2</Badge>
                        </div>

                        <div className="rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 space-y-1.5 shadow-xs opacity-80">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs line-through text-zinc-400">Auth Cookie Session Validation</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Completed</span>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="bg-zinc-800 text-[9px] text-white font-bold">JD</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* Tech Stack Logo Cloud */}
        <TechStackLogos />
      </main>
    </>
  );
}

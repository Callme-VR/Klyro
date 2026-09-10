"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Zap, ArrowRight, Kanban, Users, CheckCircle2, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [boardId, setBoardId] = useState("board-1");
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
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden transition-colors duration-300">
      {/* Background Subtle Warm Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-[#ff4f00]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Heading & Board Form */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff4f00]/30 bg-[#ff4f00]/10 text-xs font-semibold text-[#ff4f00]">
              <Zap className="h-3.5 w-3.5" />
              <span>Real-Time WebSocket Sync Engine</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] transition-colors duration-300">
              Real-Time Collaboration <br />
              <span className="bg-gradient-to-r from-[#ff4f00] via-amber-500 to-[#ff4f00] bg-clip-text text-transparent">
                For Agile Teams
              </span>
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed transition-colors duration-300">
              Instantly create or join shared Kanban boards with live presence updates, dynamic room parameters (`/boards/[boardId]`), and seamless WebSocket synchronization.
            </p>

            {/* Join / Create Board Room Form */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb]/95 dark:bg-zinc-900/90 text-zinc-900 dark:text-white shadow-xl dark:shadow-2xl backdrop-blur-xl max-w-lg rounded-[12px] transition-colors duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  <span>Enter a Workspace Room</span>
                  <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] bg-[#ff4f00]/10 text-[11px] font-mono rounded-full">
                    Live Sync Ready
                  </Badge>
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Type any custom Board ID to jump directly into real-time collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleJoinBoard();
                  }}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <Input
                    type="text"
                    value={boardId}
                    onChange={(event) => setBoardId(event.target.value)}
                    placeholder="Enter Board ID (e.g. board-1)"
                    className="flex-1 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-mono text-sm h-10 rounded-[6px] transition-colors duration-300"
                  />

                  <Button
                    type="submit"
                    className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold h-10 px-5 transition-all cursor-pointer rounded-[12px] shadow-lg shadow-[#ff4f00]/20 active:scale-95"
                  >
                    Join Board
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </form>

                {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}

                {/* Quick Presets */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono mb-2">
                    Quick Demo Rooms:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["board-1", "sprint-alpha", "design-hub", "dev-team"].map((preset) => (
                      <Badge
                        key={preset}
                        variant="outline"
                        onClick={() => handleJoinBoard(preset)}
                        className="cursor-pointer border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 hover:border-[#ff4f00]/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs px-2.5 py-1 transition-all duration-300"
                      >
                        {preset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Highlights */}
            <div className="pt-2 flex flex-wrap gap-6 text-xs text-zinc-600 dark:text-zinc-400 transition-colors duration-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>Zero Latency Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#ff4f00]" />
                <span>Next.js 16 App Router</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Multi-User Rooms</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Kanban Board Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb]/95 dark:bg-zinc-900/80 p-5 shadow-xl dark:shadow-2xl backdrop-blur space-y-4 transition-colors duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Kanban className="h-4 w-4 text-[#ff4f00]" />
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Board Preview: sprint-alpha</span>
                </div>
                <div className="flex -space-x-1.5">
                  <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                    <AvatarFallback className="bg-[#ff4f00] text-[10px] text-white">JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                    <AvatarFallback className="bg-zinc-800 text-[10px] text-white">AK</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-white dark:border-zinc-900">
                    <AvatarFallback className="bg-amber-600 text-[10px] text-white">+3</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Column Mockups */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* To Do Column */}
                <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 p-3 space-y-2.5 transition-colors duration-300">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>To Do</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-300 dark:border-zinc-800">2</Badge>
                  </div>
                  <div className="rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">Refactor WebSocket Reconnect</p>
                    <span className="text-[10px] text-[#ff4f00] block font-mono">Frontend</span>
                  </div>
                  <div className="rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition">
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">Add Base UI Components</p>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-mono">UI Design</span>
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/70 p-3 space-y-2.5 transition-colors duration-300">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>In Progress</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#ff4f00]/40 text-[#ff4f00]">1</Badge>
                  </div>
                  <div className="rounded-[6px] border border-[#ff4f00]/30 bg-[#ff4f00]/10 p-2.5 space-y-1 shadow-xs">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">Live Drag-and-Drop</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#ff4f00] font-mono">Sync Active</span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowLeftRight, Layers, ShieldCheck, Zap, MessageSquare, Users } from "lucide-react";

export default function FeaturesOne() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff4f00]/30 bg-[#ff4f00]/10 text-xs font-semibold text-[#ff4f00]">
            <Zap className="h-3.5 w-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-[#201515] dark:text-white max-w-4xl text-balance text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Zero-Latency Kanban Engine. <br />
            <span className="text-[#ff4f00]">Columns & cards synced live in real time.</span>
          </h2>
        </motion.div>

        {/* Top Feature Grid */}
        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3">

          {/* Feature Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full p-8 border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/70 dark:bg-zinc-900/80 rounded-[12px] shadow-lg flex flex-col justify-between transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00] mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Instant WebSocket Sync</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
                  Card updates, new columns, and order changes broadcast instantly to every connected team member without refreshing.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-[12px] bg-[#fffefb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-inner font-mono text-xs text-[#ff4f00]">
                <span className="text-emerald-500 font-bold">● WebSocket Connected</span>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-1">payload: issue.reordered (delay &lt;4ms)</p>
              </div>
            </Card>
          </motion.div>

          {/* Feature Card 2 (Spans 2 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full p-8 border-zinc-200 dark:border-zinc-800 bg-[#f8f4f0]/70 dark:bg-zinc-900/80 rounded-[12px] shadow-lg flex flex-col justify-between transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00] mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Fluid Drag-and-Drop Canvas</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 max-w-lg leading-relaxed">
                  Reorder lists and task cards effortlessly with smooth physics, fractional index positioning, and active drop highlight zones.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-[8px] bg-[#fffefb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 block mb-1">TO DO</span>
                  <div className="h-2 w-12 rounded bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <div className="p-3 rounded-[8px] bg-[#ff4f00]/10 border border-[#ff4f00]/40 shadow-sm">
                  <span className="text-[11px] font-bold text-[#ff4f00] block mb-1">IN PROGRESS</span>
                  <div className="h-2 w-16 rounded bg-[#ff4f00]" />
                </div>
                <div className="p-3 rounded-[8px] bg-[#fffefb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 block mb-1">DONE</span>
                  <div className="h-2 w-10 rounded bg-emerald-500" />
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* 4 Feature Pills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-8 border-t border-zinc-200 dark:border-zinc-800"
        >
          <div className="space-y-2">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-[#ff4f00]" /> Real-Time Presence
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              See active user avatars and active board connections live on the header canvas.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-[#ff4f00]" /> Organization Roles
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Group teams into workspaces with custom slug URLs and role permissions.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#ff4f00]" /> Activity Discussions
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Threaded card comments, due date tracking, and task detail modals.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#ff4f00]" /> JWT Protected API
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              End-to-end authentication guard on all REST endpoints and WebSockets.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#201515] dark:text-white max-w-4xl text-balance text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Built for sub-millisecond execution. <br />
              <span className="text-[#ff4f00]">Guaranteed real-time state sync.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-10"
          >
            <p className="text-zinc-600 dark:text-zinc-400 text-balance text-base md:text-lg leading-relaxed">
              Modern engineering teams move faster when every card drag, list update, and comment discussion syncs instantly across all connected screens. Klyro eliminates manual page refreshes with high-efficiency WebSocket rooms.
            </p>

            <div className="grid gap-8 sm:grid-cols-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ff4f00] font-mono">
                  &lt; 5ms
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  Sync Latency
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-mono">
                  100k+
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  Cards Synced
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="space-y-1"
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-500 font-mono">
                  99.99%
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  Engine Uptime
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

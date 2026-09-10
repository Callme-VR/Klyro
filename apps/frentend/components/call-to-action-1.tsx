"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 md:py-28 bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background Soft Glow */}
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-80 bg-[#ff4f00]/10 blur-[120px] pointer-events-none rounded-full"
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center space-y-6"
        >

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#ff4f00]/30 bg-[#ff4f00]/10 text-xs font-semibold text-[#ff4f00]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Start Building in Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
            Ready to elevate your team&apos;s <br />
            <span className="text-[#ff4f00]">collaborative workflow?</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Join thousands of product teams, engineers, and agile leads managing real-time Kanban boards with zero latency on Klyro.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/signup">
                  <span>Create Free Account</span>
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                </Link>
              }
              className="w-full sm:w-auto bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold h-12 px-8 rounded-[12px] shadow-lg shadow-[#ff4f00]/25 cursor-pointer active:scale-95 transition-all text-sm"
            />

            <Button
              size="lg"
              nativeButton={false}
              variant="outline"
              render={
                <Link href="/organizations">
                  <span>Explore Workspaces</span>
                </Link>
              }
              className="w-full sm:w-auto border-zinc-300 dark:border-zinc-700 bg-[#f8f4f0] dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 font-semibold h-12 px-8 rounded-[12px] transition-all text-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

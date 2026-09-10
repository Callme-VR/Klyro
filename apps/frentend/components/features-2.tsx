"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building2, UserPlus, Sliders, Smartphone, Shield, Zap, Sparkles } from "lucide-react";

export default function FeaturesTwo() {
  return (
    <section className="py-16 md:py-24 bg-[#f8f4f0]/60 dark:bg-zinc-900/40 text-[#201515] dark:text-zinc-100 transition-colors duration-300">
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
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workflow Engineering</span>
          </div>
          <h2 className="text-[#201515] dark:text-white max-w-4xl text-balance text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Built For Enterprise Velocity. <br />
            <span className="text-[#ff4f00]">From sprint planning to org governance.</span>
          </h2>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-3">

          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full p-8 border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 rounded-[12px] shadow-md space-y-4 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00]">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Multi-Tenant Workspaces</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Organize multiple engineering teams and product initiatives under isolated organization accounts with custom slug URLs.
              </p>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 font-mono text-xs text-[#ff4f00]">
                slug: /organizations/sprint-team
              </div>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full p-8 border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 rounded-[12px] shadow-md space-y-4 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00]">
                <UserPlus className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Member Onboarding</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                Seamlessly invite collaborators into organizations via email with role permissions and member management tables.
              </p>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 font-mono text-xs text-emerald-500">
                Role: ADMIN | MEMBER
              </div>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full p-8 border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 rounded-[12px] shadow-md space-y-4 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00]">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Fractional Order Math</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                High-performance ordering algorithms ensure instant O(1) position updates without database re-indexing lag.
              </p>
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-400">
                order = (prev + next) / 2
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Bottom 4 Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-8 border-t border-zinc-200 dark:border-zinc-800"
        >
          <div className="space-y-1.5">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#ff4f00]" /> Dynamic Theme Tokens
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Zapier warm cream canvas light theme and deep zinc dark mode.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#ff4f00]" /> Fully Responsive UI
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Optimized touch drag handles and adaptive navigation drawer.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#ff4f00]" /> High Availability
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stateless API routing with persistent PostgreSQL transactions.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-zinc-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#ff4f00]" /> Instant Room Join
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Direct access link parameterization for any workspace board.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

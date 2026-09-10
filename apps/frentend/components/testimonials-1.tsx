"use client";

import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[#f8f4f0]/60 dark:bg-zinc-900/40 text-[#201515] dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-12 px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl space-y-3"
        >
          <span className="text-xs font-mono font-bold tracking-widest text-[#ff4f00] uppercase">
            USER TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            Loved by engineering leads & product makers
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Testimonial Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="h-full p-8 rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 shadow-md flex flex-col justify-between space-y-6 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                &quot;Klyro completely transformed our team&apos;s sprint planning. The real-time WebSocket sync is so fast it feels like magic when moving task cards across columns.&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Avatar className="h-10 w-10 border border-[#ff4f00]/30">
                  <AvatarFallback className="bg-[#ff4f00] text-white font-extrabold text-xs">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Alex Mercer</h3>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Tech Lead @ Vercel Ecosystem</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <div className="h-full p-8 rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 shadow-md flex flex-col justify-between space-y-6 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                &quot;The clean Zapier-inspired light theme and crisp dark mode make managing complex product backlogs an absolute joy. Multi-tenant organizations are seamless.&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Avatar className="h-10 w-10 border border-[#ff4f00]/30">
                  <AvatarFallback className="bg-emerald-600 text-white font-extrabold text-xs">
                    ER
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Elena Rostova</h3>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Staff PM @ Supabase</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <div className="h-full p-8 rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-950 shadow-md flex flex-col justify-between space-y-6 transition-all hover:border-[#ff4f00]/30 hover:shadow-xl">
              <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                &quot;Zero setup hassle. We typed in our custom board room parameters, shared the link, and were instantly collaborating in real-time with full presence indicators.&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Avatar className="h-10 w-10 border border-[#ff4f00]/30">
                  <AvatarFallback className="bg-amber-600 text-white font-extrabold text-xs">
                    SK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Shekinah Tshiokufila</h3>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Senior Architect @ Cloudflare</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

"use client";

import HeroSection from "@/components/hero-section-1";
import FeaturesOne from "@/components/features-1";
import FeaturesTwo from "@/components/features-2";
import StatsSection from "@/components/stats-1";
import Testimonials from "@/components/testimonials-1";
import CallToAction from "@/components/call-to-action-1";
import { Footer } from "@/components/Webcomponents/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffefb] dark:bg-zinc-950 text-[#201515] dark:text-zinc-100 transition-colors duration-300 selection:bg-[#ff4f00] selection:text-white">
      {/* 1. Hero Header & Banner */}
      <HeroSection />
      {/* vishal */}

      {/* 2. Primary Capabilities (WebSocket Engine & Drag-and-Drop) */}
      <FeaturesOne />

      {/* 3. Real-Time Performance Metrics */}
      <StatsSection />

      {/* 4. Enterprise Velocity & Workspace Management */}
      <FeaturesTwo />

      {/* 5. Loved by Makers & Engineering Leads */}
      <Testimonials />

      {/* 6. High-Converting Call To Action */}
      <CallToAction />

      {/* 7. Architectural Blueprint Footer (Preserved Unchanged) */}
      <Footer />
    </div>
  );
}

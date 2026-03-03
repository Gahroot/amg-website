"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/layout/preloader";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { initGSAP, ScrollTrigger } from "@/lib/gsap";

const loading = () => <SectionSkeleton />;

const Hero = dynamic(
  () => import("./hero").then((m) => m.Hero),
  { ssr: false, loading }
);
const Problem = dynamic(
  () => import("./problem").then((m) => m.Problem),
  { ssr: false, loading }
);
const BlindSpots = dynamic(
  () => import("./blind-spots").then((m) => m.BlindSpots),
  { ssr: false, loading }
);
const Solution = dynamic(
  () => import("./solution").then((m) => m.Solution),
  { ssr: false, loading }
);
const Domains = dynamic(
  () => import("./domains").then((m) => m.Domains),
  { ssr: false, loading }
);
const HowItWorks = dynamic(
  () => import("./how-it-works").then((m) => m.HowItWorks),
  { ssr: false, loading }
);
const Metrics = dynamic(
  () => import("./metrics").then((m) => m.Metrics),
  { ssr: false, loading }
);
const CaseStudy = dynamic(
  () => import("./case-study").then((m) => m.CaseStudy),
  { ssr: false, loading }
);
const EngagementModel = dynamic(
  () => import("./engagement-model").then((m) => m.EngagementModel),
  { ssr: false, loading }
);
const CTA = dynamic(
  () => import("./cta").then((m) => m.CTA),
  { ssr: false, loading }
);

export function HomeClient() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // After all dynamic sections have mounted, refresh ScrollTrigger
  // so it recalculates all positions correctly
  useEffect(() => {
    if (!preloaderDone) return;

    initGSAP();

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Pass 1: after fonts + 2 frames for layout stability
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    });

    // Pass 2: catch late dynamic imports
    timers.push(setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800));

    // Pass 3: final safety net
    timers.push(setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500));

    return () => timers.forEach(clearTimeout);
  }, [preloaderDone]);

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <BlindSpots />
        <Solution />
        <Domains />
        <HowItWorks />
        <Metrics />
        <CaseStudy />
        <EngagementModel />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

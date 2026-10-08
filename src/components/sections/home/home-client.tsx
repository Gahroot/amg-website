"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { initGSAP, ScrollTrigger } from "@/lib/gsap";
import { Hero } from "./hero";
import { Problem } from "./problem";
import { BlindSpots } from "./blind-spots";
import { Solution } from "./solution";
import { Domains } from "./domains";
import { Metrics } from "./metrics";
import { CaseStudy } from "./case-study";
import { CTA } from "./cta";

export function HomeClient() {
  // Refresh after fonts and late decorative imports settle, without gating content.
  useEffect(() => {
    initGSAP();

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    // Pass 1: after fonts + 2 frames for layout stability
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      });
    });

    // Pass 2: catch late decorative imports
    timers.push(setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800));

    // Pass 3: final safety net
    timers.push(setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <BlindSpots />
        <Solution />
        <Metrics />
        <Domains />
        <CaseStudy />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

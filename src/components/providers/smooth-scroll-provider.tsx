"use client";

import { useEffect, useRef, useCallback } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";

function LenisGSAPBridge() {
  const lenis = useLenis();
  const tickerRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!lenis) return;

    initGSAP();

    // Tell ScrollTrigger to update on every Lenis scroll frame
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    // Drive Lenis from GSAP ticker (Lenis autoRaf is off)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
    tickerRef.current = tickerCallback;

    // Refresh after fonts and a short delay for dynamic components
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.off("scroll", onScroll);
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
    };
  }, [lenis]);

  return null;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const getOptions = useCallback(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return {
      lerp: reducedMotion ? 1 : 0.1,
      duration: reducedMotion ? 0 : 1.2,
      smoothWheel: !reducedMotion,
      autoRaf: false, // GSAP ticker drives Lenis — no double RAF
    };
  }, []);

  return (
    <ReactLenis root options={getOptions()}>
      <LenisGSAPBridge />
      {children}
    </ReactLenis>
  );
}

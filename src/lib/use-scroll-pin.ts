"use client";

import { useRef, useSyncExternalStore } from "react";
import { useScroll, type MotionValue } from "motion/react";

interface UseScrollPinOptions {
  /** Total height of the scroll track as CSS value (e.g., "400vh") */
  trackHeight?: string;
}

interface UseScrollPinReturn {
  /** Ref for the outer tall container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** 0→1 progress through the scroll track */
  scrollYProgress: MotionValue<number>;
  /** Whether scroll-pinning is active (false on mobile or reduced motion) */
  isActive: boolean;
  /** The track height to apply to the container */
  trackHeight: string;
}

function subscribeToMedia(cb: () => void) {
  const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqlWidth = window.matchMedia("(min-width: 768px)");
  mqlMotion.addEventListener("change", cb);
  mqlWidth.addEventListener("change", cb);
  return () => {
    mqlMotion.removeEventListener("change", cb);
    mqlWidth.removeEventListener("change", cb);
  };
}

function getSnapshot() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  return !reducedMotion && isDesktop;
}

function getServerSnapshot() {
  return false;
}

export function useScrollPin(
  options: UseScrollPinOptions = {},
): UseScrollPinReturn {
  const { trackHeight = "400vh" } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = useSyncExternalStore(
    subscribeToMedia,
    getSnapshot,
    getServerSnapshot,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return {
    containerRef,
    scrollYProgress,
    isActive,
    trackHeight: isActive ? trackHeight : "auto",
  };
}

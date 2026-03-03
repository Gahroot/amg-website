import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/*  Shared media-query hooks (useSyncExternalStore)                    */
/*                                                                     */
/*  Replaces the duplicated subscribe/snapshot pattern across all       */
/*  scroll-pinned sections.                                            */
/* ------------------------------------------------------------------ */

function subscribeToMediaQueries(cb: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  mqlMotion.addEventListener("change", cb);
  return () => {
    mql.removeEventListener("change", cb);
    mqlMotion.removeEventListener("change", cb);
  };
}

function getCanPinSnapshot() {
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getCanPinServerSnapshot() {
  return false;
}

function subscribeToReducedMotion(cb: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * True when viewport ≥ 768px AND prefers-reduced-motion is not set.
 * Used to gate GSAP scroll-pinned animations (desktop only).
 */
export function useCanPin() {
  return useSyncExternalStore(
    subscribeToMediaQueries,
    getCanPinSnapshot,
    getCanPinServerSnapshot
  );
}

/**
 * True when the user prefers reduced motion.
 * Used to gate mobile animations (Motion whileInView, GSAP ScrollTrigger without pin).
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

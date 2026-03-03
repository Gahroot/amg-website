"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Spotlight } from "./spotlight";
import { StarParticles } from "./star-particles";

const emptySubscribe = () => () => {};

function subscribeToMobile(cb: () => void) {
  const mql = window.matchMedia("(max-width: 767px)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function getIsMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getIsMobileServerSnapshot() {
  return false;
}

export function ThemeEffects() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isMobile = useSyncExternalStore(
    subscribeToMobile,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot,
  );

  // Avoid hydration mismatch — render nothing until mounted on client
  if (!mounted) return null;

  // Dark mode: render spotlight + star particles
  // Light mode: the warm linen background IS the aesthetic
  if (resolvedTheme === "dark") {
    return (
      <>
        <Spotlight fixed />
        <StarParticles fixed starCount={isMobile ? 30 : 100} />
      </>
    );
  }

  return null;
}

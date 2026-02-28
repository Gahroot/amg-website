"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Spotlight } from "./spotlight";
import { StarParticles } from "./star-particles";

const emptySubscribe = () => () => {};

export function ThemeEffects() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Avoid hydration mismatch — render nothing until mounted on client
  if (!mounted) return null;

  // Dark mode: render spotlight + star particles
  // Light mode: the warm linen background IS the aesthetic
  if (resolvedTheme === "dark") {
    return (
      <>
        <Spotlight fixed />
        <StarParticles fixed starCount={100} />
      </>
    );
  }

  return null;
}

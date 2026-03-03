"use client";

/**
 * ScrollJourneyProvider
 *
 * GSAP context provider for the scroll-journey experience.
 * Handles:
 * - GSAP initialization and plugin registration
 * - Mobile/desktop detection
 * - GSAP context management for cleanup
 * - ScrollTrigger refresh coordination after hydration
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";

interface JourneyContextValue {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  isMobile: boolean;
  isReducedMotion: boolean;
  refresh: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

interface ScrollJourneyProviderProps {
  children: React.ReactNode;
}

export function ScrollJourneyProvider({
  children,
}: ScrollJourneyProviderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    // Initialize GSAP plugins first
    initGSAP();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () =>
      setIsReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

    checkMobile();
    checkReducedMotion();

    const resizeHandler = () => checkMobile();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Create GSAP context on mount (client-side only)
  useEffect(() => {
    // Create a main context for all journey animations
    gsapContextRef.current = gsap.context(() => {});

    // Refresh ScrollTrigger after hydration
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Also refresh after images/media load
    const loadHandler = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      // Document already loaded — fire handler on next tick
      const loadTimer = setTimeout(loadHandler, 50);
      return () => {
        clearTimeout(refreshTimer);
        clearTimeout(loadTimer);
        gsapContextRef.current?.revert();
      };
    }

    window.addEventListener("load", loadHandler);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", loadHandler);
      // Clean up GSAP context
      gsapContextRef.current?.revert();
    };
  }, []);

  // Refresh all ScrollTriggers
  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  const contextValue: JourneyContextValue = {
    gsap,
    ScrollTrigger,
    isMobile,
    isReducedMotion,
    refresh,
  };

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
}

/**
 * Hook to access journey context
 * Throws error if used outside of provider
 */
export function useJourney(): JourneyContextValue {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used within ScrollJourneyProvider");
  }
  return context;
}

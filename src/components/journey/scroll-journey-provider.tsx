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
  registerTimeline: (id: string, timeline: gsap.core.Timeline) => void;
  unregisterTimeline: (id: string) => void;
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
  const isClient = typeof window !== "undefined";
  const timelinesRef = useRef<Map<string, gsap.core.Timeline>>(new Map());
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
    if (!isClient) return;

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
    window.addEventListener("load", loadHandler);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", loadHandler);
      // Clean up GSAP context
      gsapContextRef.current?.revert();
    };
  }, [isClient]);

  // Refresh all ScrollTriggers
  const refresh = useCallback(() => {
    if (isClient) {
      ScrollTrigger.refresh();
    }
  }, [isClient]);

  // Register a timeline for tracking
  const registerTimeline = useCallback((id: string, timeline: gsap.core.Timeline) => {
    timelinesRef.current.set(id, timeline);
  }, []);

  // Unregister a timeline
  const unregisterTimeline = useCallback((id: string) => {
    timelinesRef.current.delete(id);
  }, []);

  const contextValue: JourneyContextValue = {
    gsap,
    ScrollTrigger,
    isMobile,
    isReducedMotion,
    refresh,
    registerTimeline,
    unregisterTimeline,
  };

  if (!isClient) {
    // Server-side: render children without provider functionality
    return <>{children}</>;
  }

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

/**
 * Hook to create a GSAP context for a component
 * Automatically cleans up on unmount
 */
export function useJourneyContext(
  callback: (ctx: gsap.Context) => void,
  // deps: React.DependencyList = []
  deps: unknown = []
) {
  const { gsap: gsapInstance } = useJourney();
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    contextRef.current = gsapInstance.context(callback);
    return () => {
      contextRef.current?.revert();
    };
    // We only want to create the context once on mount and clean up on unmount.
    // The callback is wrapped in the component's own dependency handling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return contextRef;
}

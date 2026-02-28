/**
 * Journey Page
 *
 * Scroll-journey experience for the AMG website.
 * Client component that renders the journey only on the client side.
 */

"use client";

import { useEffect, useState } from "react";

// Loading component
function JourneyLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebe7df]">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          Anchor Mill Group
        </div>
        <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

export default function JourneyPage() {
  const [ScrollJourneyComponent, setScrollJourneyComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Only import and render on client side to avoid SSR issues with GSAP
    let mounted = true;

    import("@/components/journey/scroll-journey").then((mod) => {
      if (mounted) {
        setScrollJourneyComponent(() => mod.ScrollJourney);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ScrollJourneyComponent) {
    return <JourneyLoading />;
  }

  return <ScrollJourneyComponent />;
}

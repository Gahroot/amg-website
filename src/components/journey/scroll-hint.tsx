"use client";

/**
 * ScrollHint
 *
 * Animated "scroll to explore" indicator that:
 * - Appears with a fade-in animation
 * - Bobs up and down to encourage scrolling
 * - Auto-hides when user begins scrolling
 * - Respects prefers-reduced-motion
 */

import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface ScrollHintProps {
  /**
   * CSS class name for styling
   */
  className?: string;
  /**
   * Delay before showing the hint (ms)
   */
  showDelay?: number;
  /**
   * Scroll distance to trigger hide (px)
   */
  hideThreshold?: number;
}

export function ScrollHint({
  className = "",
  showDelay = 500,
  hideThreshold = 50,
}: ScrollHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePrefersReduced = () => setPrefersReduced(mediaQuery.matches);

    updatePrefersReduced();

    mediaQuery.addEventListener("change", updatePrefersReduced);
    return () => mediaQuery.removeEventListener("change", updatePrefersReduced);
  }, []);

  // Show hint after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay]);

  // Hide on scroll
  const handleScroll = useCallback(() => {
    if (window.scrollY > hideThreshold) {
      setIsHidden(true);
    }
  }, [hideThreshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Don't render if user prefers reduced motion
  if (prefersReduced) {
    return null;
  }

  // Don't render if hidden
  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`scroll-hint ${className} ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        transition: "opacity 0.5s ease",
        zIndex: 10,
      }}
    >
      <span
        className="font-mono text-xs uppercase tracking-widest text-primary"
        style={{ opacity: 0.8 }}
      >
        Scroll to Explore
      </span>
      <div
        className="scroll-hint-icon"
        style={{
          animation: prefersReduced ? "none" : "scroll-bob 2s ease-in-out infinite",
        }}
      >
        <ChevronDown className="w-6 h-6 text-primary" strokeWidth={1.5} />
      </div>
    </div>
  );
}

// Add animation keyframes via style element
// In production, these would be in globals.css
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes scroll-bob {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-hint-icon {
      animation: none !important;
    }
  }
}`;

// Only inject on client
if (typeof document !== "undefined") {
  document.head.appendChild(styleElement);
}

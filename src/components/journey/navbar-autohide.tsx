"use client";

/**
 * NavbarAutohide
 *
 * Auto-hiding navigation bar for the journey experience.
 *
 * Features:
 * - Hides when scrolling down through the journey
 * - Shows when scrolling up
 * - Uses GSAP for smooth transform animation
 * - Minimal design to not distract from journey content
 */

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useJourney } from "@/components/journey/scroll-journey-provider";
import { X } from "lucide-react";

interface NavbarAutohideProps {
  /**
   * Logo text (default: AMG)
   */
  logoText?: string;
  /**
   * Link to exit journey and return to main site
   */
  exitLink?: string;
  /**
   * Whether to show the exit button
   */
  showExit?: boolean;
}

export function NavbarAutohide({
  logoText = "AMG",
  exitLink = "/",
  showExit = true,
}: NavbarAutohideProps) {
  const { gsap: gsapInstance, isMobile } = useJourney();
  const navbarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!navbarRef.current) return;

    const navbar = navbarRef.current;
    let isScrollingDown = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Determine scroll direction with threshold
      if (Math.abs(scrollDelta) > 5) {
        isScrollingDown = scrollDelta > 0;
      }

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce the actual hide/show action
      scrollTimeoutRef.current = setTimeout(() => {
        tweenRef.current?.kill();
        if (isScrollingDown && currentScrollY > 100) {
          // Scrolling down - hide navbar
          tweenRef.current = gsapInstance.to(navbar, {
            y: -100,
            duration: 0.4,
            ease: "power2.inOut",
          });
        } else if (!isScrollingDown) {
          // Scrolling up - show navbar
          tweenRef.current = gsapInstance.to(navbar, {
            y: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      }, 50);

      lastScrollY.current = currentScrollY;
    };

    // Add scroll listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      tweenRef.current?.kill();
    };
  }, [gsapInstance, isMobile]);

  // Progress bar scroll listener
  useEffect(() => {
    const progressBar = document.getElementById("journey-progress-bar");
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;
      progressBar.style.width = Math.min(scrollPercent, 100) + "%";
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <header
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      style={{
        background: "rgba(245, 242, 235, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(139, 125, 94, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={exitLink}
            className="font-mono uppercase tracking-[0.2em] text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            {logoText}
          </Link>

          {/* Progress indicator (text-based) */}
          <div className="hidden md:block">
            <span className="font-mono text-xs uppercase tracking-widest text-primary/60">
              Scroll to explore
            </span>
          </div>

          {/* Right side: Exit button */}
          {showExit && (
            <Link
              href={exitLink}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono text-xs uppercase tracking-wider group"
              aria-label="Exit journey"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
              {!isMobile && <span>Exit</span>}
            </Link>
          )}
        </div>
      </div>

      {/* Progress bar at bottom of navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/10">
        <div
          className="h-full bg-primary transition-all duration-100 ease-out"
          id="journey-progress-bar"
          style={{ width: "0%" }}
        />
      </div>

    </header>
  );
}

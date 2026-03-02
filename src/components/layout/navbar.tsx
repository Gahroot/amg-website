"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { OverlayNav } from "./overlay-nav";

export function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  // Initialize with reduced motion check (assumes client-side)
  const [isSolid, setIsSolid] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      return;
    }

    const setSolidFromIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        setIsSolid(!entry.isIntersecting);
      });
    };

    // Find the hero section (first section in main)
    const findHeroSection = () => {
      const main = document.querySelector("main");
      return main?.querySelector("section:first-child") as HTMLElement;
    };

    // Use IntersectionObserver to detect when leaving hero
    const observer = new IntersectionObserver(setSolidFromIntersection, {
      // Trigger when hero has scrolled 50% out of view
      threshold: 0,
      rootMargin: "-100px 0px 0px 0px",
    });

    // Wait for DOM to be ready, then observe
    const startObserving = () => {
      const hero = findHeroSection();
      if (hero) {
        observer.observe(hero);
      }
    };

    // Try immediately and also after a short delay for dynamic content
    startObserving();
    const timeoutId = setTimeout(startObserving, 100);

    // Also observe after preloader likely completes
    const preloaderTimeout = setTimeout(startObserving, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(preloaderTimeout);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isSolid ? "bg-background/80 backdrop-blur-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link
              href="/"
              className={`font-serif italic text-base hover:text-primary transition-colors duration-300 ${
                isSolid ? "text-foreground" : "text-white"
              }`}
            >
              Anchor Mill Group
            </Link>

            {/* Menu trigger */}
            <button
              onClick={() => setNavOpen(true)}
              className={`font-mono text-xs uppercase tracking-widest hover:opacity-80 transition-opacity duration-300 py-2 ${
                isSolid ? "text-muted-foreground" : "text-white"
              }`}
              aria-label="Open navigation menu"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <OverlayNav open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}

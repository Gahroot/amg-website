"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { OverlayNav } from "./overlay-nav";

export function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isSolid, setIsSolid] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let observer: IntersectionObserver | null = null;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const startObserving = () => {
      // Already observing — skip
      if (observer) return;

      const main = document.querySelector("main");
      const hero = main?.querySelector(
        "section:first-child"
      ) as HTMLElement | null;

      if (!hero) return;

      // Only observe full-viewport heroes (e.g. home page video hero)
      const isFullViewportHero =
        hero.classList.contains("min-h-screen") ||
        hero.offsetHeight >= window.innerHeight * 0.9;

      if (!isFullViewportHero) return;

      // Full-viewport hero found — start transparent and observe
      setIsSolid(false);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsSolid(!entry.isIntersecting);
          });
        },
        {
          threshold: 0,
          rootMargin: "-100px 0px 0px 0px",
        }
      );

      observer.observe(hero);
    };

    // Try immediately and with delays for dynamic content / preloader
    startObserving();
    timeouts.push(setTimeout(startObserving, 100));
    timeouts.push(setTimeout(startObserving, 500));

    return () => {
      observer?.disconnect();
      timeouts.forEach(clearTimeout);
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

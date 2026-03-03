"use client";

/**
 * JourneyHorizontalTiles
 *
 * Horizontal scroll section displaying the 6 solutions.
 *
 * Desktop behavior:
 * - Container pinned at 600vh track height
 * - Horizontal translation driven by vertical scroll
 * - GSAP ScrollTrigger with scrub: 1
 *
 * Mobile behavior:
 * - CSS Scroll Snap (scroll-snap-type: x mandatory)
 * - Native horizontal swipe gesture
 */

import React, { useRef, useLayoutEffect, useState } from "react";
import { journeyTiles } from "@/lib/journey-data";
import { loadGSAP } from "@/lib/gsap";

interface JourneyHorizontalTilesProps {
  trackHeight?: string;
}

export function JourneyHorizontalTiles({
  trackHeight = "600vh",
}: JourneyHorizontalTilesProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesWrapperRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    let mounted = true;

    const setupAnimation = async () => {
      const { gsap } = await loadGSAP();
      if (!mounted || !containerRef.current || !tilesRef.current) return;

      const container = containerRef.current;
      const tiles = tilesRef.current;

      const mobile = window.innerWidth < 768;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (mobile || reducedMotion) {
        return;
      }

      // Calculate horizontal scroll distance
      const scrollDistance = tiles.scrollWidth - window.innerWidth;

      // Create a GSAP context for this component
      const ctx = gsap.context(() => {
        // Animate horizontal translation based on vertical scroll
        gsap.to(tiles, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, container);

      ctxRef.current = ctx;
    };

    setupAnimation();

    return () => {
      mounted = false;
      ctxRef.current?.revert();
    };
  }, []);

  // Handle resize
  useLayoutEffect(() => {
    const handleResize = async () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Refresh ScrollTrigger on resize
      if (!mobile) {
        const { ScrollTrigger } = await loadGSAP();
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={containerRef}
      className="journey-horizontal-tiles relative bg-[#ebe7df]"
      style={
        isMobile
          ? { height: "auto", minHeight: "100vh" }
          : { height: trackHeight }
      }
    >
      <div
        ref={tilesWrapperRef}
        className="journey-tiles-wrapper relative"
        style={
          isMobile
            ? {
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                height: "100dvh",
              }
            : {
                position: "sticky",
                top: "0",
                height: "100vh",
                overflow: "hidden",
              }
        }
      >
        <style>{`.journey-tiles-wrapper::-webkit-scrollbar{display:none;}`}</style>

        <div
          ref={tilesRef}
          className="journey-tiles flex"
          style={
            isMobile
              ? { width: "max-content", height: "100dvh" }
              : { width: "max-content", height: "100vh", willChange: "transform" }
          }
        >
          {journeyTiles.map((tile, index) => {
            const Icon = tile.icon;

            return (
              <div
                key={tile.number}
                className="journey-tile relative flex items-center justify-center px-8 sm:px-16"
                style={{
                  width: "100vw",
                  height: "100%",
                  scrollSnapAlign: isMobile ? "start" : undefined,
                  flexShrink: 0,
                  background:
                    index === 0
                      ? "linear-gradient(90deg, #f5f2eb 0%, #ebe7df 100%)"
                      : index === journeyTiles.length - 1
                      ? "linear-gradient(90deg, #ebe7df 0%, #f5f2eb 100%)"
                      : "#ebe7df",
                }}
              >
                <div className="max-w-5xl mx-auto text-center px-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary mb-6 block">
                    {tile.number}
                  </span>

                  <div className="flex justify-center mb-8">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(139, 125, 94, 0.15)" }}
                    >
                      <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-8 leading-tight">
                    {tile.title}
                  </h2>

                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

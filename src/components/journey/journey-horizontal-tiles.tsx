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

interface JourneyHorizontalTilesProps {
  trackHeight?: string;
}

// Global GSAP instances (client-side only)
let gsapInstance: typeof import("gsap").gsap | null = null;
let ScrollTriggerInstance: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
let gsapInitialized = false;

async function getGSAP() {
  if (typeof window === "undefined") return null;
  if (gsapInitialized) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };

  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");

  gsapInstance = gsapModule.gsap;
  ScrollTriggerInstance = scrollTriggerModule.ScrollTrigger;

  gsapInstance.registerPlugin(ScrollTriggerInstance);
  gsapInitialized = true;

  return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };
}

export function JourneyHorizontalTiles({
  trackHeight = "600vh",
}: JourneyHorizontalTilesProps) {
  const [isClient] = useState(() => typeof window !== "undefined");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);
  const tilesWrapperRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isClient) return;

    const setupAnimation = async () => {
      const result = await getGSAP();
      if (!result || !containerRef.current || !tilesRef.current) return;

      const { gsap, ScrollTrigger } = result;
      if (!gsap || !ScrollTrigger) return;

      const container = containerRef.current;
      const tiles = tilesRef.current;

      const mobile = window.innerWidth < 768;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (mobile || reducedMotion) {
        console.log("Horizontal tiles: Using mobile/reduced motion mode");
        return;
      }

      console.log("Setting up horizontal scroll animation");

      // Clean up any existing ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Calculate horizontal scroll distance
      const scrollDistance = tiles.scrollWidth - window.innerWidth;
      console.log("Scroll distance:", scrollDistance);

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

      // Store context for cleanup
      (container as unknown as { _gsapContext?: gsap.Context })._gsapContext = ctx;
    };

    setupAnimation();

    // Capture ref value for cleanup
    const container = containerRef.current;
    return () => {
      if (container) {
        const ctx = (container as unknown as { _gsapContext?: gsap.Context })._gsapContext;
        if (ctx) ctx.revert();
      }
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, [isClient]);

  // Handle resize
  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Refresh ScrollTrigger on resize
      if (ScrollTriggerInstance && !mobile) {
        ScrollTriggerInstance.refresh();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render complex animations until client-side
  if (!isClient) {
    return (
      <section className="journey-horizontal-tiles relative bg-[#ebe7df] min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Loading...
            </p>
          </div>
        </div>
      </section>
    );
  }

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

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";
import { domains } from "@/lib/domains-data";
import { DomainsMobileSpine } from "./domains-mobile-spine";

/* ------------------------------------------------------------------ */
/*  Geometry                                                            */
/* ------------------------------------------------------------------ */

const CX = 220;
const CY = 220;
const RING_R = 180;
const MARKER_COUNT = 5;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const ARC_SEGMENT = CIRCUMFERENCE / MARKER_COUNT;

/** Get (x, y) for a point at index i on a given radius (12 o'clock, clockwise). */
function ringPoint(i: number, radius: number) {
  const angle = (i * 360) / MARKER_COUNT - 90; // -90 so index 0 is top
  const rad = (angle * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

const ICON_OFFSET = 22; // px outside the ring

/** Rotation (degrees) so the progress arc starts at a given marker index. */
function arcRotation(i: number) {
  return (i * 360) / MARKER_COUNT - 90;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DomainsDial() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const markerGroupRef = useRef<SVGGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(Math.random() * MARKER_COUNT)
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const reducedMotion = useReducedMotion();

  const activeDomain = domains[activeIndex];

  /* ---- Auto-rotation ---- */
  useEffect(() => {
    if (!isAutoPlaying || !entranceComplete || reducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MARKER_COUNT);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, entranceComplete, reducedMotion]);

  /* ---- Progress arc animation ---- */
  useEffect(() => {
    if (!isAutoPlaying || !entranceComplete || reducedMotion) return;
    const el = progressRef.current;
    if (!el) return;

    // Reset instantly
    el.style.transition = "none";
    el.style.strokeDashoffset = String(ARC_SEGMENT);

    // Force reflow
    void el.getBoundingClientRect();

    // Animate over 5s
    el.style.transition = "stroke-dashoffset 5000ms linear";
    el.style.strokeDashoffset = "0";
  }, [activeIndex, isAutoPlaying, entranceComplete, reducedMotion]);

  /* ---- Click handler ---- */
  const handleMarkerClick = useCallback(
    (i: number) => {
      setActiveIndex(i);
      setIsAutoPlaying(false);
    },
    []
  );

  /* ---- Keyboard navigation ---- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (activeIndex + 1) % MARKER_COUNT;
        setActiveIndex(next);
        setIsAutoPlaying(false);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (activeIndex - 1 + MARKER_COUNT) % MARKER_COUNT;
        setActiveIndex(prev);
        setIsAutoPlaying(false);
      }
    },
    [activeIndex]
  );

  /* ---- GSAP entrance ---- */
  useGSAP(
    () => {
      if (reducedMotion) {
        setEntranceComplete(true);
        return;
      }
      initGSAP();

      const logo = logoRef.current;
      const ring = ringRef.current;
      const markers = markerGroupRef.current?.querySelectorAll<SVGGElement>("[data-marker]");
      const content = contentRef.current;

      if (!ring || !markers || !content) return;

      // Prepare ring draw-in
      gsap.set(ring, {
        strokeDasharray: CIRCUMFERENCE,
        strokeDashoffset: CIRCUMFERENCE,
      });
      gsap.set(markers, { scale: 0, transformOrigin: "center center" });
      gsap.set(content, { autoAlpha: 0, x: 30 });
      if (logo) gsap.set(logo, { scale: 0.5, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // 1. Logo scales in
      if (logo) {
        tl.to(logo, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        });
      }

      // 2. Ring draws in
      tl.to(
        ring,
        {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
        },
        logo ? "-=0.3" : 0
      );

      // 3. Markers stagger in
      tl.to(
        markers,
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(2)",
          stagger: 0.1,
        },
        "-=0.4"
      );

      // 4. Content fades in
      tl.to(
        content,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 5. Enable auto-rotation
      tl.call(() => setEntranceComplete(true));

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Advisory Domains
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mt-4">
            Five Integrated Disciplines
          </h2>
        </div>

        {/* Desktop: two-column layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
          {/* Left: Dial SVG */}
          <div ref={svgContainerRef} className="relative flex items-center justify-center">
            <svg
              viewBox="-10 -10 460 460"
              className="w-full max-w-[400px] aspect-square"
              aria-hidden="true"
            >
              {/* Outer ring */}
              <circle
                ref={ringRef}
                cx={CX}
                cy={CY}
                r={RING_R}
                fill="none"
                stroke="var(--border, #e5e5e5)"
                strokeWidth={1}
              />

              {/* Progress arc (visible only during auto-play) */}
              <circle
                ref={progressRef}
                cx={CX}
                cy={CY}
                r={RING_R}
                fill="none"
                stroke="var(--primary, #8b7d5e)"
                strokeWidth={2}
                strokeDasharray={`${ARC_SEGMENT} ${CIRCUMFERENCE - ARC_SEGMENT}`}
                strokeDashoffset={ARC_SEGMENT}
                strokeLinecap="round"
                className="transition-opacity duration-300"
                style={{
                  opacity: isAutoPlaying && entranceComplete ? 1 : 0,
                  transform: `rotate(${arcRotation(activeIndex)}deg)`,
                  transformOrigin: `${CX}px ${CY}px`,
                }}
              />

              {/* Active spoke */}
              {(() => {
                const pos = ringPoint(activeIndex, RING_R);
                const dx = CX - pos.x;
                const dy = CY - pos.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const nx = dx / len;
                const ny = dy / len;
                return (
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.x + nx * 40}
                    y2={pos.y + ny * 40}
                    stroke="var(--primary, #8b7d5e)"
                    strokeWidth={1}
                    opacity={0.4}
                    className="transition-all duration-300"
                  />
                );
              })()}

              {/* Icon markers */}
              <g
                ref={markerGroupRef}
                role="tablist"
                aria-label="Domain selector"
              >
                {domains.map((domain, i) => {
                  const pos = ringPoint(i, RING_R + ICON_OFFSET);
                  const isActive = activeIndex === i;
                  const size = isActive ? 36 : 28;
                  return (
                    <g key={domain.title} data-marker>
                      {/* Hit area circle (invisible but clickable) */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={20}
                        fill="transparent"
                        className="cursor-pointer"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={domain.title}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleMarkerClick(i)}
                        onKeyDown={handleKeyDown}
                      />
                      {/* Icon via foreignObject */}
                      <foreignObject
                        x={pos.x - size / 2}
                        y={pos.y - size / 2}
                        width={size}
                        height={size}
                        className="pointer-events-none"
                      >
                        <div
                          className={`flex items-center justify-center w-full h-full rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-primary/40"
                          }`}
                        >
                          <domain.icon
                            className={`transition-all duration-300 ${
                              isActive ? "size-4.5" : "size-3.5"
                            }`}
                          />
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Shield logo overlay (HTML, not foreignObject) */}
            <div
              ref={logoRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Anchor-mill-group-logo.webp"
                alt=""
                className="w-[60px] brightness-0 dark:brightness-100 dark:invert-0 opacity-70"
              />
            </div>
          </div>

          {/* Right: Content panel */}
          <div ref={contentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                role="tabpanel"
                aria-labelledby={`dial-tab-${activeIndex}`}
              >
                {/* Icon watermark */}
                <activeDomain.icon className="size-12 lg:size-14 text-primary/20 mb-4" strokeWidth={1.5} />

                {/* Title */}
                <h3 className="font-serif text-2xl lg:text-3xl tracking-tight mb-4">
                  {activeDomain.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {activeDomain.description}
                </p>

                {/* Capabilities grid */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {activeDomain.capabilities.map((cap) => (
                    <div key={cap} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1 rounded-full bg-primary/40 shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile */}
        <DomainsMobileSpine domains={domains} />

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/strategies"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors group"
          >
            Discover How AMG Works
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

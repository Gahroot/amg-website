"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/*  Timeline data                                                      */
/* ------------------------------------------------------------------ */

const timeline = [
  {
    day: "Day 1",
    text: "Coordinated cyber breach targets family office infrastructure",
  },
  {
    day: "Day 17",
    text: "Extortion demand surfaces, threatening data exposure",
  },
  {
    day: "Day 32",
    text: "Family trust structure and financial details exposed publicly",
  },
  {
    day: "Day 45",
    text: "Crisis reaches inflection — losses compound, reputation fractured",
  },
];

/* ------------------------------------------------------------------ */
/*  Desktop + reduced-motion detection (same pattern as domains.tsx)    */
/* ------------------------------------------------------------------ */

function subscribeToDesktop(cb: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  mqlMotion.addEventListener("change", cb);
  return () => {
    mql.removeEventListener("change", cb);
    mqlMotion.removeEventListener("change", cb);
  };
}

function getDesktopSnapshot() {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  return isDesktop && !reducedMotion;
}

function getDesktopServerSnapshot() {
  return false;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CaseStudy() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const costRef = useRef<HTMLSpanElement>(null);

  const canPin = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );

  useGSAP(
    () => {
      if (!canPin) return;

      initGSAP();

      const pinContainer = pinContainerRef.current;
      const progress = progressRef.current;
      const costEl = costRef.current;
      if (!pinContainer || !progress || !costEl) return;

      const dots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
      const entries = entryRefs.current.filter(Boolean) as HTMLDivElement[];

      // Initial state
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dots, { scale: 0, autoAlpha: 0 });
      gsap.set(entries, { autoAlpha: 0, y: 20 });

      // Scrub-driven timeline with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainer,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Grow progress line
      tl.to(progress, {
        scaleX: 1,
        duration: 4,
        ease: "none",
      });

      // Stagger dots and text entries
      entries.forEach((entry, i) => {
        const dot = dots[i];
        const offset = i * 1;

        if (dot) {
          tl.to(
            dot,
            { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(2)" },
            offset,
          );
        }

        tl.to(
          entry,
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          offset + 0.15,
        );
      });

      // Cost counter synced to scroll (starts at 0, runs full duration)
      const proxy = { val: 0 };
      tl.to(
        proxy,
        {
          val: 4.2,
          duration: 4,
          ease: "power2.in",
          onUpdate() {
            costEl.textContent = `$${proxy.val.toFixed(1)}M`;
          },
        },
        0,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [canPin] },
  );

  /* Shared content renderer */
  const renderTimeline = (animated: boolean) => (
    <>
      {/* Label */}
      <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
        Case Study
      </p>

      {/* Title */}
      <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-16">
        The Compounding Cost
      </h2>

      {/* Timeline */}
      <div className="relative">
        {/* Progress line */}
        {animated && (
          <div className="absolute top-4 left-0 right-0 h-px bg-[#e8e4dc]/10">
            <div
              ref={progressRef}
              className="absolute inset-0 h-full bg-primary"
            />
          </div>
        )}

        {/* Timeline entries */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {timeline.map((entry, i) => (
            <div key={entry.day} className="relative pt-10 md:pt-12">
              {/* Dot */}
              {animated && (
                <div
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-[#1a1714]"
                />
              )}

              <div
                ref={
                  animated
                    ? (el) => {
                        entryRefs.current[i] = el;
                      }
                    : undefined
                }
              >
                <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">
                  {entry.day}
                </span>
                <p className="text-sm text-[#e8e4dc]/70 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost reveal */}
      <div className="mt-16 text-center">
        <span
          ref={animated ? costRef : undefined}
          className="block font-serif text-5xl md:text-6xl text-[#e8e4dc] tabular-nums"
        >
          {animated ? "$0.0M" : "$4.2M"}
        </span>
        <span className="block font-mono text-xs uppercase tracking-widest text-[#e8e4dc]/40 mt-2">
          Total cost in 45 days
        </span>
      </div>

      {/* CTA link */}
      <div className="mt-12 text-center">
        <Link
          href="/how-we-serve"
          className="font-mono text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
        >
          See How We Prevent This
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );

  return (
    <section ref={sectionRef} className="bg-[#1a1714] text-[#e8e4dc]">
      {canPin ? (
        /* Desktop: pinned scroll container */
        <div
          ref={pinContainerRef}
          className="h-screen overflow-hidden flex flex-col justify-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderTimeline(true)}
          </div>
        </div>
      ) : (
        /* Mobile / reduced-motion: static layout */
        <div className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderTimeline(false)}
          </div>
        </div>
      )}
    </section>
  );
}

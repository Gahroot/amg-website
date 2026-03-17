"use client";

import { useRef, useCallback } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";

/* ------------------------------------------------------------------ */
/*  Engagement data                                                    */
/* ------------------------------------------------------------------ */

const pillars = [
  {
    symbol: "\u2295", // ⊕
    title: "Single Trusted Relationship",
    description:
      "One dedicated partner serves as your single point of contact across every domain \u2014 eliminating coordination gaps and information silos.",
  },
  {
    symbol: "\u25CE", // ◎
    title: "Collaboration-First Model",
    description:
      "We integrate with your existing advisors rather than replacing them, amplifying their effectiveness through unified intelligence and coordination.",
  },
  {
    symbol: "\u2B22", // ⬡
    title: "Intelligence-Led Architecture",
    description:
      "Every recommendation is driven by real-time threat intelligence and cross-domain analysis \u2014 not assumptions or industry templates.",
  },
  {
    symbol: "\u25C8", // ◈
    title: "Strict Confidentiality",
    description:
      "Compartmentalized operations, need-to-know protocols, and government-grade information security protect your most sensitive matters.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EngagementModel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reducedMotion = useReducedMotion();

  const setRowRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      rowRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    () => {
      if (reducedMotion) return;

      initGSAP();

      const section = sectionRef.current;
      const hub = hubRef.current;
      const spine = spineRef.current;
      if (!section || !hub || !spine) return;

      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
      if (rows.length === 0) return;

      gsap.set(hub, { autoAlpha: 0, scale: 0.8, transformOrigin: "center center" });
      gsap.set(spine, { scaleY: 0, transformOrigin: "top" });
      gsap.set(rows, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(hub, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 0);
      tl.to(spine, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0.2);
      tl.to(
        rows,
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.12 },
        0.4
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 blueprint-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          The AMG Approach
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
          Our Engagement Model
        </h2>
        <p className="text-muted-foreground mb-16">
          Special Operations Discipline. Advisory Excellence.
        </p>

        {/* Schematic area */}
        <div className="relative max-w-2xl">
          {/* Hub marker */}
          <div ref={hubRef} className="flex items-center gap-3 mb-10">
            <div className="w-2.5 h-2.5 bg-primary rotate-45 shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
              Operational Architecture
            </span>
          </div>

          {/* Cards with spine */}
          <div className="relative pl-12">
            {/* Spine */}
            <div
              ref={spineRef}
              className="absolute left-[7px] top-0 bottom-0 w-px bg-primary/20 origin-top"
            />

            {/* Card list */}
            <div className="space-y-10">
              {pillars.map((pillar, i) => (
                <div key={pillar.title} ref={setRowRef(i)} className="flex items-start">
                  <div className="flex items-center shrink-0 mt-1.5 -ml-12">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="w-10 h-px bg-primary/20 ml-px" />
                  </div>
                  <div className="ml-1">
                    <span className="text-xl text-primary leading-none">
                      {pillar.symbol}
                    </span>
                    <h4 className="font-mono text-sm uppercase tracking-widest font-semibold mt-2 mb-2 text-foreground">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

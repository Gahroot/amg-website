"use client";

import { useRef, useCallback } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useCanPin, useReducedMotion } from "@/lib/use-can-pin";

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
  const pinRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const canPin = useCanPin();
  const reducedMotion = useReducedMotion();

  const setNodeRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      nodeRefs.current[i] = el;
    },
    []
  );

  const setConnectorRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      connectorRefs.current[i] = el;
    },
    []
  );

  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    () => {
      if (!canPin) return;

      initGSAP();

      const section = sectionRef.current;
      const pin = pinRef.current;
      const hub = hubRef.current;
      const spine = spineRef.current;

      if (!section || !pin || !hub || !spine) return;

      const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
      const connectors = connectorRefs.current.filter(
        Boolean
      ) as HTMLDivElement[];
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      if (nodes.length === 0) return;

      // Set initial hidden states
      gsap.set(hub, { opacity: 0, scale: 0, transformOrigin: "center center" });
      gsap.set(spine, { scaleY: 0, transformOrigin: "top" });
      gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(connectors, { scaleX: 0, transformOrigin: "left" });
      gsap.set(cards, { autoAlpha: 0, y: 20 });

      // Build scroll-pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: pin,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Hub appears (0 - 0.5)
      tl.to(
        hub,
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        0
      );

      // Phase 2: Spine draws (0.3 - 2)
      tl.to(spine, { scaleY: 1, duration: 1.7, ease: "none" }, 0.3);

      // Phase 3: Cards appear sequentially (1.5 - 5.5)
      const cardDuration = 1;
      pillars.forEach((_, i) => {
        const start = 1.5 + i * cardDuration;

        // Node dot pops in
        tl.to(
          nodes[i],
          { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" },
          start
        );

        // Connector draws
        tl.to(
          connectors[i],
          { scaleX: 1, duration: 0.3, ease: "power2.out" },
          start + 0.1
        );

        // Card fades in
        tl.to(
          cards[i],
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          start + 0.2
        );
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [canPin] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: canPin ? "400vh" : "auto" }}
    >
      <div
        ref={pinRef}
        className={
          canPin
            ? "flex flex-col justify-center min-h-screen py-24 lg:py-32 blueprint-grid"
            : "py-24 lg:py-32"
        }
      >
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
            {canPin || reducedMotion ? (
              <div ref={hubRef} className="flex items-center gap-3 mb-10">
                <div className="w-2.5 h-2.5 bg-primary rotate-45 shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                  Operational Architecture
                </span>
              </div>
            ) : (
              <motion.div
                ref={hubRef}
                className="flex items-center gap-3 mb-10"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="w-2.5 h-2.5 bg-primary rotate-45 shrink-0" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                  Operational Architecture
                </span>
              </motion.div>
            )}

            {/* Cards with spine */}
            <div className="relative pl-12">
              {/* Spine */}
              {canPin || reducedMotion ? (
                <div
                  ref={spineRef}
                  className="absolute left-[7px] top-0 bottom-0 w-px bg-primary/20"
                />
              ) : (
                <motion.div
                  ref={spineRef}
                  className="absolute left-[7px] top-0 bottom-0 w-px bg-primary/20 origin-top"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}

              {/* Card list */}
              <div className="space-y-10">
                {pillars.map((pillar, i) => {
                  if (canPin) {
                    return (
                      <div key={pillar.title} className="flex items-start">
                        <div className="flex items-center shrink-0 mt-1.5 -ml-12">
                          <div
                            ref={setNodeRef(i)}
                            className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                          />
                          <div
                            ref={setConnectorRef(i)}
                            className="w-10 h-px bg-primary/20 ml-px"
                          />
                        </div>
                        <div ref={setCardRef(i)} className="ml-1">
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
                    );
                  }

                  if (reducedMotion) {
                    return (
                      <div key={pillar.title} className="flex items-start">
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
                    );
                  }

                  return (
                    <motion.div
                      key={pillar.title}
                      className="flex items-start"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="flex items-center shrink-0 mt-1.5 -ml-12">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                        />
                        <motion.div
                          className="w-10 h-px bg-primary/20 ml-px origin-left"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
                        />
                      </div>
                      <motion.div
                        className="ml-1"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                      >
                        <span className="text-xl text-primary leading-none">
                          {pillar.symbol}
                        </span>
                        <h4 className="font-mono text-sm uppercase tracking-widest font-semibold mt-2 mb-2 text-foreground">
                          {pillar.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

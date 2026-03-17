"use client";

import { useRef } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

const capabilities = [
  {
    number: "01",
    title: "Assess",
    description:
      "Comprehensive cross-domain vulnerability assessments that reveal what siloed advisors miss.",
  },
  {
    number: "02",
    title: "Architect",
    description:
      "Unified strategic blueprints that coordinate legal, financial, security, health, and intelligence resources.",
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "Single point of accountability. We orchestrate every specialist, every timeline, every deliverable.",
  },
];

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          What We Do
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
          A Disciplined Methodology
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-16">
          Three phases. One integrated outcome.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-12">
          {capabilities.map((cap, i) => (
            <div
              key={cap.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="border-t border-[rgba(26,23,20,0.15)] pt-6"
            >
              <span className="font-serif italic text-2xl text-primary leading-none">
                {cap.number}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl tracking-tight mt-3 mb-2">
                {cap.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

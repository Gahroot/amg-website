"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

const leftItems = [
  {
    symbol: "\u2295",
    title: "Integration Over Isolation",
    description:
      "Where others provide point solutions, we provide a unified operating system.",
  },
  {
    symbol: "\u2B22",
    title: "Absolute Discretion",
    description:
      "We serve clients who cannot afford public exposure. Confidentiality is foundational, not aspirational.",
  },
];

const rightItems = [
  {
    symbol: "\u25CE",
    title: "World-Class Practitioners",
    description:
      "Every partner is a recognized leader in their field \u2014 former intelligence officers, Yale physicians, Fortune 100 coaches.",
  },
  {
    symbol: "\u25C8",
    title: "Adaptive Methodology",
    description:
      "Our framework evolves with your threats, your family, and your enterprise.",
  },
];

export function Differentiators() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      const lefts = leftRefs.current.filter(Boolean) as HTMLDivElement[];
      const rights = rightRefs.current.filter(Boolean) as HTMLDivElement[];

      if (lefts.length > 0) {
        gsap.fromTo(
          lefts,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      if (rights.length > 0) {
        gsap.fromTo(
          rights,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (sectionRef.current?.contains(st.trigger as Element)) st.kill();
        });
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          Why AMG
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
          What Sets AMG Apart
        </h2>
        <p className="text-muted-foreground mb-16">
          Four principles that define every engagement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground mb-8 border-b border-border pb-4">
              Core Principles
            </h3>
            <div className="space-y-10">
              {leftItems.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    leftRefs.current[i] = el;
                  }}
                >
                  <span className="text-2xl text-primary leading-none">
                    {item.symbol}
                  </span>
                  <h4 className="font-mono text-sm uppercase tracking-widest text-foreground mt-3 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground mb-8 border-b border-border pb-4">
              Our Edge
            </h3>
            <div className="space-y-10">
              {rightItems.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    rightRefs.current[i] = el;
                  }}
                >
                  <span className="text-2xl text-primary leading-none">
                    {item.symbol}
                  </span>
                  <h4 className="font-mono text-sm uppercase tracking-widest text-foreground mt-3 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

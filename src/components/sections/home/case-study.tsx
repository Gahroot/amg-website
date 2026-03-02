"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

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
    text: "Crisis reaches inflection \u2014 losses compound, reputation fractured",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CaseStudy() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const costRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const section = sectionRef.current;
      const progress = progressRef.current;
      const costEl = costRef.current;
      if (!section || !progress || !costEl) return;

      const dots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
      const entries = entryRefs.current.filter(Boolean) as HTMLDivElement[];

      if (prefersReducedMotion) {
        gsap.set(progress, { scaleX: 1 });
        gsap.set(dots, { scale: 1, autoAlpha: 1 });
        gsap.set(entries, { autoAlpha: 1, y: 0 });
        costEl.textContent = "$4.2M";
        return;
      }

      // Initial state
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dots, { scale: 0, autoAlpha: 0 });
      gsap.set(entries, { autoAlpha: 0, y: 20 });

      // Scrub-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "+=80%",
          scrub: 0.6,
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

      // Cost counter at the end
      const proxy = { val: 0 };
      tl.to(
        proxy,
        {
          val: 4.2,
          duration: 1.5,
          ease: "power2.out",
          onUpdate() {
            costEl.textContent = `$${proxy.val.toFixed(1)}M`;
          },
        },
        entries.length * 1,
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (section.contains(st.trigger as Element)) st.kill();
        });
      };
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#1a1714] text-[#e8e4dc]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:block absolute top-4 left-0 right-0 h-px bg-[#e8e4dc]/10">
            <div
              ref={progressRef}
              className="absolute inset-0 h-full bg-primary"
            />
          </div>

          {/* Timeline entries */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {timeline.map((entry, i) => (
              <div key={entry.day} className="relative pt-10 md:pt-12">
                {/* Dot */}
                <div
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-[#1a1714]"
                />

                <div
                  ref={(el) => {
                    entryRefs.current[i] = el;
                  }}
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
            ref={costRef}
            className="block font-serif text-5xl md:text-6xl text-[#e8e4dc] tabular-nums"
          >
            $0.0M
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
      </div>
    </section>
  );
}

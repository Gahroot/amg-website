"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

export function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      initGSAP();

      gsap.from(contentRef.current, {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="solution" className="py-24 lg:py-32">
      {/* Charcoal callout bar */}
      <div className="bg-[#2c2926] text-[#e8e4dc] py-12 mb-16 lg:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl tracking-tight italic">
            Turn risk into foresight. Turn foresight into action.
          </p>
        </div>
      </div>

      {/* Section header + prose */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE SOLUTION
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
            Take Control of Your Fragmented Reality
          </h2>
        </div>

        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            AMG provides a next-generation integrated platform that delivers a{" "}
            <strong className="text-foreground font-semibold">Unified Threat Picture</strong> through
            comprehensive{" "}
            <strong className="text-foreground font-semibold">Cross-Domain Coordination</strong>. By
            establishing a{" "}
            <strong className="text-foreground font-semibold">Single Point of Command</strong>, we
            empower organizations to harness{" "}
            <strong className="text-foreground font-semibold">Real-Time Intelligence</strong> for{" "}
            <strong className="text-foreground font-semibold">Proactive Risk Mitigation</strong>,
            transforming security operations from reactive postures to actionable,
            preemptive defense.
          </p>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src="/images/macro-eye.jpg"
              alt="Macro close-up of a human eye — seeing the unified threat picture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

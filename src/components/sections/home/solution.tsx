"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

const pillars = [
  {
    id: "01",
    title: "Unified Threat Picture",
    description:
      "A consolidated view across all risk domains — physical, cyber, reputational, and financial — rendered in real time and calibrated to your exposure.",
  },
  {
    id: "02",
    title: "Cross-Domain Coordination",
    description:
      "Security, legal, intelligence, and logistics disciplines operating from a single shared picture, eliminating gaps that adversaries exploit.",
  },
  {
    id: "03",
    title: "Single Point of Command",
    description:
      "One dedicated principal advisor who owns every response and orchestrates every resource — accountability without ambiguity.",
  },
  {
    id: "04",
    title: "Real-Time Intelligence",
    description:
      "Continuous open-source, human, and technical collection feeding live situational awareness so decisions are never made in an information vacuum.",
  },
  {
    id: "05",
    title: "Proactive Risk Mitigation",
    description:
      "Threats neutralized before they materialize, through anticipatory action and precision planning rather than reactive damage control.",
  },
];

export function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      initGSAP();

      // Animate section header
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Animate image
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          x: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Animate pillar rows with stagger
      if (pillarsRef.current) {
        const items =
          pillarsRef.current.querySelectorAll<HTMLElement>(".pillar-item");
        gsap.from(items, {
          y: 28,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="solution" className="py-24 lg:py-32">
      {/* Charcoal callout bar */}
      <div className="bg-charcoal text-background py-12 mb-16 lg:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl tracking-tight italic">
            Turn risk into foresight. Turn foresight into action.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-12 lg:mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE SOLUTION
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-xl">
            Take Control of Your Fragmented Reality
          </h2>
        </div>

        {/* Asymmetric editorial grid — pillars left, sticky image right */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">
          {/* Pillar list */}
          <div ref={pillarsRef} className="divide-y divide-border">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="pillar-item group py-7 first:pt-0 last:pb-0"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-primary shrink-0">
                    {pillar.id}
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-wider font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed pl-8">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Sticky image column */}
          <div className="lg:sticky lg:top-28">
            <div
              ref={imageRef}
              className="relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src="/images/macro-eye.jpg"
                alt="Macro close-up of a human eye — the unified threat picture"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              {/* Bottom gradient fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Subtle caption overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                  Integrated situational awareness
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

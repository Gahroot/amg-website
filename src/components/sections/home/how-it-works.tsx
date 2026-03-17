"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";

/* ------------------------------------------------------------------ */
/*  Steps data                                                         */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    title: "DISCOVERY & ALIGNMENT",
    description:
      "Confidential intake and cross-domain scoping to understand your full risk landscape, priorities, and existing advisory relationships.",
  },
  {
    number: "02",
    title: "INTELLIGENCE & ASSESSMENT",
    description:
      "Comprehensive baseline assessment across cyber, physical, digital exposure, health, governance, and geopolitical risk domains.",
  },
  {
    number: "03",
    title: "ARCHITECTURE & STRATEGY",
    description:
      "A unified strategic plan that coordinates resources across all domains into a single coherent action plan.",
  },
  {
    number: "04",
    title: "ECOSYSTEM ACTIVATION",
    description:
      "Single point of accountability across all domains. Your AMG partner orchestrates every specialist, every timeline, every deliverable.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reducedMotion = useReducedMotion();

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  GSAP stagger animation on mount                                  */
  /* ---------------------------------------------------------------- */

  useGSAP(
    () => {
      if (reducedMotion) return;

      initGSAP();

      const section = sectionRef.current;
      if (!section) return;

      const items = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      if (items.length === 0) return;

      gsap.set(items, { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section ref={sectionRef} id="how-it-works" className="relative z-0 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE PROCESS
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
            How AMG Works
          </h2>
        </div>

        {/* Two-column grid: compass image + steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Compass image — always visible, no entrance animation */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src="/images/compass.jpg"
                alt="Antique compass pointing north — symbol of decisive direction through complexity"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Numbered steps */}
          <div className="flex flex-col justify-center">
            {steps.map((step, i) => {
              const borderClass =
                i < steps.length - 1
                  ? "border-b border-[rgba(26,23,20,0.15)] pb-8 mb-8"
                  : "";

              return (
                <div key={step.number} ref={setStepRef(i)} className={borderClass}>
                  <span className="font-serif italic text-4xl text-primary leading-none">
                    {step.number}
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-widest font-semibold mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useCanPin, useReducedMotion } from "@/lib/use-can-pin";

const domains = [
  {
    number: "01",
    title: "Neurobiology & Performance",
    description:
      "Optimizing cognitive performance, stress resilience, and decision-making under pressure.",
    capabilities: [
      "Peak performance protocols",
      "Stress inoculation training",
      "Cognitive optimization",
      "Executive function enhancement",
    ],
  },
  {
    number: "02",
    title: "Cyber & Protective Security",
    description:
      "Comprehensive digital and physical security architecture protecting family members, assets, and reputation.",
    capabilities: [
      "Threat assessment & monitoring",
      "Digital forensics & incident response",
      "Executive protection",
      "Secure communications",
    ],
  },
  {
    number: "03",
    title: "Leadership Development",
    description:
      "Building next-generation leadership capacity and succession readiness across family enterprise.",
    capabilities: [
      "Succession planning",
      "Next-gen development programs",
      "Governance frameworks",
      "Family council facilitation",
    ],
  },
  {
    number: "04",
    title: "Integrative Medicine",
    description:
      "Personalized health optimization combining conventional and integrative approaches.",
    capabilities: [
      "Metabolic optimization",
      "Longevity protocols",
      "Personalized health plans",
      "Performance medicine",
    ],
  },
  {
    number: "05",
    title: "Business Intelligence",
    description:
      "Strategic intelligence gathering and analysis to identify threats and opportunities globally.",
    capabilities: [
      "Geopolitical risk assessment",
      "Due diligence investigations",
      "Competitive intelligence",
      "Crisis forecasting",
    ],
  },
];

export function Domains() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  const canPin = useCanPin();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!canPin || !trackRef.current || !panelsRef.current) return;

      initGSAP();

      const panels = panelsRef.current;
      const scrollDistance = panels.scrollWidth - window.innerWidth;

      if (scrollDistance <= 0) return;

      const tween = gsap.to(panels, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [canPin] }
  );

  return (
    <section ref={sectionRef} id="domains" className="overflow-hidden">
      {canPin ? (
        /* Desktop: GSAP horizontal scroll — header inside pinned container */
        <div ref={trackRef} className="h-dvh overflow-hidden flex flex-col">
          <div className="pt-24 pb-8 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
                OUR DOMAINS
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
                Five Domains. One Operating System.
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              ref={panelsRef}
              className="flex flex-nowrap h-full will-change-transform"
            >
              {domains.map((domain, index) => (
                <div
                  key={domain.number}
                  className="w-screen h-full flex-shrink-0 flex items-center"
                >
                <div className="max-w-5xl mx-auto px-8 relative">
                  <span
                    className="font-serif italic text-[10rem] text-primary/10 absolute -top-24 -left-4 select-none pointer-events-none leading-none"
                    aria-hidden="true"
                  >
                    {domain.number}
                  </span>

                  <div className="relative">
                    <h3 className="font-serif text-5xl tracking-tight mb-6">
                      {domain.title}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-lg mb-10">
                      {domain.description}
                    </p>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {domain.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="font-mono text-sm text-foreground"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {index < domains.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-px bg-border" />
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mobile: vertical stacked cards */
        <div className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              OUR DOMAINS
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Five Domains. One Operating System.
            </h2>
          </div>
          <div className="max-w-7xl mx-auto">
            {domains.map((domain, index) => {
              const cardContent = (
                <>
                  <motion.span
                    className="font-serif italic text-8xl text-primary/10 block leading-none mb-2 select-none"
                    aria-hidden="true"
                    {...(!reducedMotion
                      ? {
                          initial: { opacity: 0, scale: 0.9 },
                          whileInView: { opacity: 1, scale: 1 },
                          viewport: { once: true, margin: "-60px" },
                          transition: { duration: 0.5, ease: "easeOut" },
                        }
                      : {})}
                  >
                    {domain.number}
                  </motion.span>
                  <h3 className="font-serif text-3xl tracking-tight mb-4">
                    {domain.title}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-lg mb-6">
                    {domain.description}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {domain.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="font-mono text-sm text-foreground"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </>
              );

              const borderClass = `py-10 ${
                index < domains.length - 1
                  ? "border-b border-[rgba(26,23,20,0.15)]"
                  : ""
              }`;

              if (reducedMotion) {
                return (
                  <div key={domain.number} className={borderClass}>
                    {cardContent}
                  </div>
                );
              }

              return (
                <motion.div
                  key={domain.number}
                  className={borderClass}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

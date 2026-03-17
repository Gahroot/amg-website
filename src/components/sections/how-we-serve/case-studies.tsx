"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

const caseStudies = [
  {
    title: "Stabilizing a Family Office",
    client: "$680M AUM family office",
    image: "/images/stacked-stones.jpg",
    metrics: [
      "Security score improved from 34 to 87",
      "Incident response: 72 hours \u2192 4 hours",
      "Governance disputes reduced by 73%",
    ],
    narrative:
      "A multi-generational family office was hemorrhaging value through uncoordinated advisors and escalating internal conflicts. AMG deployed an integrated discovery across all five domains, revealing critical interdependencies between their cybersecurity gaps, governance dysfunction, and leadership succession failures. Within 12 months, the family had a unified protection architecture and a clear path forward.",
  },
  {
    title: "Crisis Containment",
    client: "$200M Series C founder",
    metrics: [
      "Coordinated threat neutralized in 72 hours",
      "$60M+ acquisition completed on schedule",
      "Zero public exposure of incident",
    ],
    narrative:
      "A high-profile founder faced a coordinated threat combining cyber intrusion, physical surveillance, and reputational attack \u2014 timed to derail a critical acquisition. AMG activated cross-domain response protocols, coordinating cyber forensics, executive protection, legal strategy, and media containment simultaneously. The threat was neutralized, the acquisition closed on schedule, and the incident never became public.",
  },
  {
    title: "Full Spectrum Protection",
    client: "Fortune 100 C-suite executive",
    metrics: [
      "Zero cyber or physical incidents",
      "210+ travel days covered",
      "Cognitive performance improved 40%",
    ],
    narrative:
      "A Fortune 100 executive with extreme travel demands and elevated threat profile needed comprehensive protection that didn\u2019t compromise performance. AMG integrated executive protection, cybersecurity, neurobiology protocols, and real-time intelligence into a seamless support system. The result: zero incidents across 210+ travel days and measurable improvement in cognitive performance and decision-making quality.",
  },
];

export function CaseStudies() {
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
          stagger: 0.15,
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
          Proven Results
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-16">
          Case Studies
        </h2>

        <div className="space-y-0">
          {caseStudies.map((study, i) => (
            <div
              key={study.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="border-t border-[rgba(26,23,20,0.15)] pt-8 mb-12 last:mb-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: title + metrics */}
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl tracking-tight mb-2">
                    {study.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-primary mb-6">
                    {study.client}
                  </p>
                  {study.image && (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                      <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <ul className="space-y-3">
                    {study.metrics.map((metric) => (
                      <li key={metric} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          {metric}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: narrative */}
                <div className="lg:col-span-2">
                  <p className="text-muted-foreground leading-relaxed">
                    {study.narrative}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

const partners = [
  {
    title: "Intelligence & Assessment",
    credential: "Former Senior Intelligence Officer",
  },
  {
    title: "Neurobiology & Performance",
    credential: "Yale School of Medicine \u2022 Former CIA",
  },
  {
    title: "Integrative Medicine",
    credential: "Clinical Pharmacist \u2022 Metabolic Medicine",
  },
  {
    title: "Leadership Development",
    credential: "Fortune 100 Executive Coach",
  },
  {
    title: "Cyber & Digital Security",
    credential: "NSA/Government-Level Threat Operations",
  },
  {
    title: "Protective Operations",
    credential: "USMC Veteran \u2022 Executive Protection",
  },
];

export function Partners() {
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
    <section ref={sectionRef} id="partners" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          Our Network
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-16">
          The Partner Ecosystem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
          {partners.map((partner, i) => (
            <div
              key={partner.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="border-b border-[rgba(26,23,20,0.15)] pb-6 mb-6"
            >
              <h3 className="font-serif text-lg text-foreground">
                {partner.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {partner.credential}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

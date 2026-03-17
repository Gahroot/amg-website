"use client";

import { useRef } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

const partners = [
  {
    title: "Intelligence & Assessment",
    credential: "Former Senior Intelligence Officer",
    bio: "Former Senior Intelligence Officer with decades of experience in human assessment and threat evaluation. Specializes in identifying behavioral indicators and psychological vulnerabilities in high-stakes environments.",
  },
  {
    title: "Neurobiology & Performance",
    credential: "Yale School of Medicine \u2022 Former CIA",
    bio: "Yale School of Medicine faculty and former CIA forensic psychiatrist. Pioneer in the neurobiology of resilience, stress inoculation, and peak performance under extreme conditions.",
  },
  {
    title: "Integrative Medicine",
    credential: "Clinical Pharmacist \u2022 Metabolic Medicine",
    bio: "Board-certified clinical pharmacist and internationally recognized expert in metabolic medicine. Developed integrative protocols optimizing health, cognition, and longevity for high-performing individuals.",
  },
  {
    title: "Leadership Development",
    credential: "Fortune 100 Executive Coach",
    bio: "Fortune 100 executive coach specializing in leadership development, succession planning, and organizational transformation. Trusted advisor to C-suite leaders across multiple industries.",
  },
  {
    title: "Cyber & Digital Security",
    credential: "NSA/Government-Level Threat Operations",
    bio: "A dedicated cyber and digital security division staffed by former NSA and government threat hunters. Provides threat assessment, digital forensics, incident response, and secure communications architecture.",
  },
  {
    title: "Protective Operations",
    credential: "USMC Veteran \u2022 Executive Protection",
    bio: "USMC veteran with extensive experience in protective operations and executive security. Designs and implements comprehensive physical security programs for UHNW families and global executives.",
  },
];

export function PartnerBios() {
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
          Our Network
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
          Our Specialist Network
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-16">
          AMG&apos;s strength lies in its curated network of world-class
          practitioners &mdash; each a recognized leader in their domain.
        </p>

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
              <p className="font-mono text-xs uppercase tracking-widest text-primary mt-1">
                {partner.credential}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                {partner.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

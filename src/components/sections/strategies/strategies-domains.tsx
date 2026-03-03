"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const domains = [
  {
    value: "neurobiology",
    number: "01",
    title: "Neurobiology & Performance",
    partner: "Dr. Charles Morgan III",
    description:
      "Optimizing cognitive performance, stress resilience, and decision-making under pressure for principals and key family members. Our neurobiology protocols are drawn from elite military and intelligence community methodologies, adapted for the unique demands of UHNW family leadership.",
    capabilities: [
      "Peak performance protocols",
      "Stress inoculation training",
      "Cognitive optimization",
      "Executive function enhancement",
    ],
  },
  {
    value: "cyber-security",
    number: "02",
    title: "Cyber & Protective Security",
    partner: "AMG Labs + Scot Holzschuh",
    description:
      "Comprehensive digital and physical security architecture protecting family members, assets, and reputation across all environments. We integrate cyber defense, executive protection, and secure communications into a unified shield.",
    capabilities: [
      "Threat assessment & monitoring",
      "Digital forensics & incident response",
      "Executive protection",
      "Secure communications",
    ],
  },
  {
    value: "leadership",
    number: "03",
    title: "Leadership Development",
    partner: "Ryan Krupa",
    description:
      "Building next-generation leadership capacity and succession readiness across family enterprise and governance structures. Our programs develop the strategic thinking, emotional intelligence, and operational competence that sustaining wealth requires.",
    capabilities: [
      "Succession planning",
      "Next-gen development programs",
      "Governance frameworks",
      "Family council facilitation",
    ],
  },
  {
    value: "medicine",
    number: "04",
    title: "Integrative Medicine",
    partner: "Dr. James LaValle",
    description:
      "Personalized health optimization combining conventional and integrative approaches for sustained peak performance and longevity. We address the metabolic, hormonal, and nutritional foundations that underpin cognitive and physical resilience.",
    capabilities: [
      "Metabolic optimization",
      "Longevity protocols",
      "Personalized health plans",
      "Performance medicine",
    ],
  },
  {
    value: "intelligence",
    number: "05",
    title: "Business Intelligence & Geopolitical Risk",
    partner: "Dr. Barry McManus",
    description:
      "Strategic intelligence gathering and analysis to identify threats, opportunities, and risks across global operations. Our analysts draw on decades of intelligence community experience to provide actionable insights for complex decision-making.",
    capabilities: [
      "Geopolitical risk assessment",
      "Due diligence investigations",
      "Competitive intelligence",
      "Crisis forecasting",
    ],
  },
];

export function StrategiesDomains() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      const targets = [headerRef.current, accordionRef.current].filter(
        Boolean
      ) as HTMLElement[];
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

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
        <div ref={headerRef}>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            Five Domains
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
            The AMG Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Each domain is led by world-class practitioners with deep expertise.
            Together, they form an integrated defense and performance system
            unlike anything available in the private sector.
          </p>
        </div>

        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="w-full">
            {domains.map((domain) => (
              <AccordionItem key={domain.value} value={domain.value}>
                <AccordionTrigger className="py-6 hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span className="font-serif italic text-2xl text-primary leading-none flex-shrink-0">
                      {domain.number}
                    </span>
                    <span className="font-serif text-lg sm:text-xl tracking-tight text-foreground text-left">
                      {domain.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12">
                  <p className="text-muted-foreground text-base mb-6">
                    {domain.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {domain.capabilities.map((capability) => (
                      <div
                        key={capability}
                        className="flex items-center gap-3"
                      >
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

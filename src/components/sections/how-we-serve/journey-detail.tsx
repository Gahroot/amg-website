"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

const steps = [
  {
    number: "01",
    title: "Discovery & Alignment",
    description:
      "Confidential intake and cross-domain scoping to understand your full risk landscape, priorities, and existing advisory relationships.",
    details:
      "Our discovery process begins with a confidential intake and spans 2-4 weeks. We deploy domain specialists across cybersecurity, intelligence, advisory, and operations to conduct parallel assessments. The result is a unified threat and opportunity map that no single advisor could produce alone.",
  },
  {
    number: "02",
    title: "Intelligence & Assessment",
    description:
      "Comprehensive baseline assessment across cyber, physical, digital exposure, health, governance, and geopolitical risk domains.",
    details:
      "Our intelligence team conducts a thorough baseline assessment spanning all relevant risk domains. We evaluate your current posture, identify gaps in existing coverage, and map interdependencies between threat vectors that siloed advisors typically miss.",
  },
  {
    number: "03",
    title: "Architecture & Strategy",
    description:
      "A unified strategic plan that coordinates resources across all domains into a single coherent action plan.",
    details:
      "Your blueprint prioritizes interventions by risk severity and interdependency. Each recommendation is sequenced, resourced, and assigned to a responsible domain partner \u2014 with clear timelines and measurable outcomes defined from the start.",
  },
  {
    number: "04",
    title: "Ecosystem Activation",
    description:
      "Single point of accountability across all domains. Your AMG partner orchestrates every specialist, every timeline, every deliverable.",
    details:
      "Your dedicated AMG partner serves as the single point of contact and accountability. They coordinate across all domain specialists, manage timelines, resolve conflicts between workstreams, and ensure nothing falls through the cracks between advisors.",
  },
  {
    number: "05",
    title: "Ongoing Operations & Evolution",
    description:
      "Continuous monitoring, quarterly reviews, and adaptive refinement as threats evolve and circumstances change.",
    details:
      "Threats evolve. Family dynamics shift. Markets move. Our ongoing support includes quarterly strategic reviews, 24/7 incident response capability, annual reassessments, and proactive intelligence briefings tailored to your specific risk profile.",
  },
];

export function JourneyDetail() {
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
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          The Process
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
          Your Journey with AMG
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mb-16">
          A disciplined five-phase methodology that transforms fragmented
          protection into integrated resilience.
        </p>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="border-b border-[rgba(26,23,20,0.15)] pb-8 mb-8 last:border-b-0 last:mb-0 last:pb-0"
            >
              <span className="font-serif italic text-2xl text-primary leading-none">
                {step.number}
              </span>
              <h3 className="font-mono text-sm uppercase tracking-widest font-semibold text-foreground mt-3 mb-2">
                {step.title}
              </h3>
              <p className="text-foreground font-medium mb-3">
                {step.description}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

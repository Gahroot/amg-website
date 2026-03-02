"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

const profiles = [
  {
    number: "01",
    title: "Family Offices",
    stat: "$250M+ AUM \u2022 2+ generations",
    description:
      "Multi-generational family offices facing complex cross-border, cybersecurity, and governance challenges.",
  },
  {
    number: "02",
    title: "Global Executives",
    stat: "C-Suite \u2022 100+ travel days/year",
    description:
      "High-profile executives requiring integrated security, performance optimization, and strategic intelligence.",
  },
  {
    number: "03",
    title: "UHNW Individuals",
    stat: "$100M+ net worth",
    description:
      "Ultra-high-net-worth individuals with significant philanthropic visibility and complex asset structures.",
  },
];

export function ClientProfiles() {
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
    <section ref={sectionRef} className="pt-32 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          Who We Serve
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-16">
          Client Profiles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-12">
          {profiles.map((profile, i) => (
            <div
              key={profile.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="border-t border-[rgba(26,23,20,0.15)] pt-6"
            >
              <span className="font-serif italic text-2xl text-primary leading-none">
                {profile.number}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl tracking-tight mt-3 mb-2">
                {profile.title}
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
                {profile.stat}
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

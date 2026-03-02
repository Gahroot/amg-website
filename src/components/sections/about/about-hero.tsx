"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      const items = itemRefs.current.filter(Boolean) as HTMLElement[];
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
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
    <section ref={sectionRef} className="py-24 lg:py-32 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          className="font-mono text-xs uppercase tracking-widest text-primary mb-4"
        >
          About AMG
        </p>

        <h1
          ref={(el) => {
            itemRefs.current[1] = el;
          }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-8"
        >
          The Strategic Partner Your Family Office Deserves
        </h1>

        <p
          ref={(el) => {
            itemRefs.current[2] = el;
          }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-6"
        >
          Anchor Mill Group was founded on a simple observation: the families
          and executives who need the most protection are often the most
          underserved — not for lack of advisors, but for lack of integration.
        </p>

        <p
          ref={(el) => {
            itemRefs.current[3] = el;
          }}
          className="text-lg text-muted-foreground max-w-3xl"
        >
          We bring together the world&apos;s leading practitioners across five
          critical domains and unify them under a single strategic layer. The
          result: comprehensive protection, optimized performance, and lasting
          resilience.
        </p>
      </div>
    </section>
  );
}

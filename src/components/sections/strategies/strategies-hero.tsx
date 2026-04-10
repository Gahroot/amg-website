"use client";

import { useRef } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

export function StrategiesHero() {
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
          duration: 0.7,
          stagger: 0.13,
          ease: "power2.out",
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-charcoal overflow-hidden"
    >
      {/* Subtle noise/grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        aria-hidden="true"
      />

      {/* Faint radial glow from top-left */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,201,168,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 pt-36 pb-24 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p
          ref={(el) => {
            itemRefs.current[0] = el;
          }}
          className="font-mono text-xs uppercase tracking-widest text-primary mb-4"
        >
          Our Approach
        </p>
        <h1
          ref={(el) => {
            itemRefs.current[1] = el;
          }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-background mb-6 max-w-4xl"
        >
          Sovereign Global Ecosystem
        </h1>
        <p
          ref={(el) => {
            itemRefs.current[2] = el;
          }}
          className="text-lg sm:text-xl text-background/60 max-w-3xl"
        >
          Five specialized domains — unified under one strategic command layer
          — delivering comprehensive protection, optimized performance, and
          lasting resilience for UHNW families and global executives.
        </p>

        {/* Decorative bottom rule */}
        <div
          ref={(el) => {
            itemRefs.current[3] = el as HTMLElement | null;
          }}
          className="mt-16 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

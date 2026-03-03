"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";
import { siteConfig } from "@/lib/site-config";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      initGSAP();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion || !bgRef.current || !sectionRef.current) return;

      gsap.fromTo(
        bgRef.current,
        { y: 0 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
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
    <section
      ref={sectionRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Background image - storm breaking with light emerging */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-16"
        aria-hidden="true"
      >
        <Image
          src="/images/sun come through clouids.jpg"
          alt="Storm clouds parting to reveal golden light — chaos turning into clarity"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#e8e4dc] mb-4">
            Turn Chaos Into Control
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-[#e8e4dc]/60 mb-8">
            Partner with Anchor Mill Group
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm text-[#e8e4dc]/60 hover:text-[#e8e4dc] active:text-[#e8e4dc]/80 transition-colors mb-10 block"
          >
            {siteConfig.email}
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#e8e4dc]/30 text-[#e8e4dc] hover:bg-[#e8e4dc]/10 active:bg-[#e8e4dc]/15 font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Begin Your Discovery
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

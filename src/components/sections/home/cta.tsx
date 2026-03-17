"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
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

      // Subtle parallax shift on mount instead of scroll-scrub
      gsap.fromTo(
        bgRef.current,
        { y: 0 },
        {
          y: -60,
          duration: 2,
          ease: "power2.out",
        }
      );
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
          src="/images/cta-sailboat.jpg"
          alt="Elegant sailboat navigating calm waters — turning chaos into control"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#1a1714] mb-4">
            Turn Chaos Into Control
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-[#1a1714]/60 mb-8">
            Partner with Anchor Mill Group
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm text-[#1a1714]/60 hover:text-[#1a1714] active:text-[#1a1714]/80 transition-colors mb-10 block"
          >
            {siteConfig.email}
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#1a1714]/30 text-[#1a1714] hover:bg-[#1a1714]/10 active:bg-[#1a1714]/15 font-mono text-xs uppercase tracking-widest transition-colors"
          >
            Begin Your Discovery
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

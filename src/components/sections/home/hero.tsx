"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, initGSAP } from "@/lib/gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reducedMotion) return;

      initGSAP();

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Rule draws across
      tl.fromTo(
        ".hero-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.inOut" },
        0.3
      );

      // Wordmark slides up
      tl.fromTo(
        ".hero-wordmark",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.1
      );

      // Tagline fades in
      tl.fromTo(
        ".hero-tagline",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.8
      );

      // CTA fades in
      tl.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        1.0
      );

      // Image rises
      tl.fromTo(
        ".hero-image",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.6
      );

      // Parallax on image during scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        animation: gsap.to(".hero-image", { y: -150, ease: "none" }),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Wordmark */}
        <h1 className="hero-wordmark font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] tracking-tight leading-[0.9] text-foreground mb-6">
          Anchor
          <br />
          Mill Group
        </h1>

        {/* Thin rule */}
        <div className="hero-rule h-px w-full max-w-md bg-foreground/20 origin-left mb-6" />

        {/* Tagline */}
        <p className="hero-tagline font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8 max-w-xl">
          Integrated Resilience, Protection, and Performance
        </p>

        {/* CTA */}
        <Link
          href="/contact"
          className="hero-cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors group"
        >
          Begin a Conversation
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Hero image */}
      <div className="hero-image mt-12 lg:mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[21/9] rounded-sm overflow-hidden">
          <Image
            src="/images/hero-lighthouse.jpg"
            alt="Lighthouse standing firm against stormy skies — a symbol of guidance through chaos"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

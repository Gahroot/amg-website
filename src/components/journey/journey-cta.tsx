"use client";

/**
 * JourneyCTA
 *
 * Final call-to-action section.
 */

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { ctaContent } from "@/lib/journey-data";

interface JourneyCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

// Global GSAP instances
let gsapInstance: typeof import("gsap").gsap | null = null;
let ScrollTriggerInstance: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
let gsapInitialized = false;

async function getGSAP() {
  if (typeof window === "undefined") return null;
  if (gsapInitialized) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };

  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");

  gsapInstance = gsapModule.gsap;
  ScrollTriggerInstance = scrollTriggerModule.ScrollTrigger;

  gsapInstance.registerPlugin(ScrollTriggerInstance);
  gsapInitialized = true;

  return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };
}

export function JourneyCTA({
  title = ctaContent.title,
  description = ctaContent.description,
  buttonText = ctaContent.buttonText,
  buttonLink = ctaContent.buttonLink,
}: JourneyCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setupAnimation = async () => {
      const result = await getGSAP();
      if (!result || !containerRef.current) return;

      const { gsap } = result;
      if (!gsap) return;

      const container = containerRef.current;
      const titleEl = container.querySelector(".cta-title");
      const descriptionEl = container.querySelector(".cta-description");
      const buttonEl = container.querySelector(".cta-button");

      if (!titleEl || !descriptionEl || !buttonEl) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          descriptionEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          buttonEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, container);

      (container as unknown as { _gsapContext?: gsap.Context })._gsapContext = ctx;
    };

    setupAnimation();

    // Capture ref value for cleanup
    const container = containerRef.current;
    return () => {
      if (container) {
        const ctx = (container as unknown as { _gsapContext?: gsap.Context })._gsapContext;
        if (ctx) ctx.revert();
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="journey-cta relative min-h-screen flex items-center justify-center bg-[#f5f2eb]"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,125,94,0.15)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 mb-8">
          Begin Your Journey
        </p>

        <h2
          className="cta-title font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground mb-8 leading-[1.1]"
          style={{ opacity: 0 }}
        >
          {title}
        </h2>

        <p
          className="cta-description text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ opacity: 0 }}
        >
          {description}
        </p>

        <Link
          href={buttonLink}
          className="cta-button group inline-flex items-center gap-4 bg-foreground text-background px-10 py-5 rounded-full font-mono text-sm uppercase tracking-widest font-semibold hover:bg-primary transition-all duration-300"
          style={{ opacity: 0 }}
        >
          {buttonText}
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" strokeWidth={2} />
        </Link>

        <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Confidential consultation • No obligation
        </p>
      </div>
    </section>
  );
}

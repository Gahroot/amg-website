"use client";

/**
 * JourneyHero
 *
 * Full-viewport hero section with parallax effects.
 */

import React, { useRef, useLayoutEffect } from "react";
import { VideoBackground } from "@/components/effects/video-background";
import { heroContent } from "@/lib/journey-data";
import { ArrowDown } from "lucide-react";
import { loadGSAP } from "@/lib/gsap";

interface JourneyHeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function JourneyHero({ videoSrc, posterSrc }: JourneyHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    let mounted = true;

    const setupAnimation = async () => {
      const { gsap } = await loadGSAP();
      if (!mounted || !containerRef.current || !titleRef.current || !subtitleRef.current || !descriptionRef.current) return;

      const container = containerRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const description = descriptionRef.current;
      const eyebrow = eyebrowRef.current;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) return;

      const ctx = gsap.context(() => {
        const target = eyebrow || title;
        gsap.to(target, {
          y: -60,
          opacity: 0.5,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(title, {
          y: -120,
          opacity: 0.4,
          scale: 1.05,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(subtitle, {
          y: -100,
          opacity: 0.5,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(description, {
          y: -80,
          opacity: 0.6,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(container, {
          opacity: 0,
          scrollTrigger: {
            trigger: container,
            start: "50% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, container);

      ctxRef.current = ctx;
    };

    setupAnimation();

    return () => {
      mounted = false;
      ctxRef.current?.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="journey-hero relative h-screen w-full overflow-hidden flex items-center justify-center bg-foreground"
    >
      {videoSrc && (
        <VideoBackground
          src={videoSrc}
          poster={posterSrc}
          overlayColor="#1a1815"
          overlayOpacity={0.7}
        />
      )}

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-pulse" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-8"
        >
          {heroContent.eyebrow}
        </p>

        <h1
          ref={titleRef}
          className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-background mb-6 leading-[0.9]"
        >
          {heroContent.title}
        </h1>

        <div
          ref={subtitleRef}
          className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-primary/80 mb-10"
        >
          {heroContent.subtitle}
        </div>

        <p
          ref={descriptionRef}
          className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
        >
          {heroContent.description}
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <span className="font-mono text-xs uppercase tracking-widest text-primary/60">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent" />
        <ArrowDown className="w-5 h-5 text-primary/60 animate-bounce" strokeWidth={1.5} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f5f2eb] to-transparent pointer-events-none" />
    </section>
  );
}

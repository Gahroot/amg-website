"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // On mobile, force 720p source since <source media=""> is ignored in <video>
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      video.src = "/videos/hero-coastline-720p.mp4";
    }
    video.playbackRate = 0.5;
  }, []);

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

      // Fade background as hero scrolls out of view
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center lg:justify-end overflow-hidden"
    >
      {/* Fixed Background Video for parallax effect */}
      <div ref={bgRef} className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-coastline-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* Desktop: WebM first (4.5 MB, Chrome/Firefox/Edge) */}
          <source
            src="/videos/hero-coastline-1080p.webm"
            type="video/webm"
          />
          {/* Desktop: MP4 fallback (5.6 MB, Safari/universal) */}
          <source
            src="/videos/hero-coastline-1080p.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark gradient overlay - progressively darker toward the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/50 to-black/70 z-10" />

      {/* Text Content - centered mobile, right-aligned desktop */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:pr-8 lg:pl-16 lg:w-1/2">
        <h1 className="hero-wordmark font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[11rem] tracking-tight leading-[0.9] text-white mb-6">
          Anchor
          <br />
          Mill Group
        </h1>

        {/* Thin rule */}
        <div className="hero-rule h-px w-full max-w-md bg-white/30 origin-left mb-6" />

        {/* Tagline */}
        <p className="hero-tagline font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80 mb-8 max-w-xl">
          Integrated Resilience, Protection, and Performance
        </p>

        {/* CTA */}
        <Link
          href="/contact"
          className="hero-cta inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white hover:text-primary active:text-primary/80 transition-colors group"
        >
          Begin a Conversation
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 group-active:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

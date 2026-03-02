"use client";

import { useRef, useEffect } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scroll during preloader
    document.body.style.overflow = "hidden";

    return () => {
      // Cleanup: restore scroll when unmounting
      document.body.style.overflow = "";
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      initGSAP();

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          onComplete();
        },
      });

      // Logo fades in + scale up (power3.out for smooth ease)
      tl.fromTo(
        ".preloader-logo",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0.3
      );

      // Wordmark fades in with slight rise
      tl.fromTo(
        ".preloader-wordmark",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      // Decorative rule draws from left
      tl.fromTo(
        ".preloader-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.3"
      );

      // Pause for brand impression
      tl.to({}, { duration: 0.6 });

      // Fade out center content
      tl.to(
        [".preloader-logo", ".preloader-wordmark", ".preloader-rule"],
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.in",
        }
      );

      // Curtain reveal - split panels slide apart
      tl.to(
        ".preloader-panel-top",
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.1"
      );
      tl.to(
        ".preloader-panel-bottom",
        {
          yPercent: 100,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "<"
      );
    },
    { scope: containerRef, dependencies: [onComplete] }
  );

  // Render immediately - no conditional rendering to prevent flash
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background pointer-events-none"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Split panels for curtain reveal */}
      <div className="preloader-panel-top absolute inset-0 bottom-1/2 bg-background" />
      <div className="preloader-panel-bottom absolute inset-0 top-1/2 bg-background" />

      {/* Centered logo reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Logo image with luxury styling */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Anchor-mill-group-logo.webp"
          alt="Anchor Mill Group"
          className="preloader-logo w-[120px] md:w-[180px] opacity-0 drop-shadow-lg"
        />

        {/* Brand name in elegant typography */}
        <h1
          className="preloader-wordmark font-serif italic text-lg md:text-xl
                     tracking-widest text-primary mt-6 opacity-0"
        >
          ANCHOR MILL GROUP
        </h1>

        {/* Decorative rule */}
        <div className="preloader-rule mt-4 h-px w-32 bg-primary/50 origin-left" />
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP, initGSAP } from "@/lib/gsap";

export function BlindSpots() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      initGSAP();

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;
      if (!bodyRef.current || !imageRef.current) return;

      // SplitText word-by-word reveal — auto-play over 1.5s instead of scrub
      const split = SplitText.create(bodyRef.current, {
        type: "words",
      });

      gsap.set(split.words, { opacity: 0.15 });

      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.05,
        duration: 1.5,
        ease: "power2.inOut",
      });

      // Image parallax — auto-play over 1.5s instead of scrub
      gsap.fromTo(
        imageRef.current,
        { y: 50 },
        {
          y: 0,
          duration: 1.5,
          ease: "power2.out",
        }
      );

      return () => {
        split.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: portrait image */}
          <div className="overflow-hidden rounded-xl">
            <div ref={imageRef} className="relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image
                src="/images/blind-spot-portrait.jpg"
                alt="Portrait of an elderly man with eyes closed — representing the blind spots in traditional advisory"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right column: body text */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              THE BLIND SPOT
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
              Traditional Advisors Create Blind Spots
            </h2>
            <p ref={bodyRef} className="text-muted-foreground text-lg mb-8">
              Your wealth advisor sees the portfolio. Your attorney sees the
              trust structure. Your security team sees the threat landscape. None
              of them see each other&apos;s blind spots. The result is a
              patchwork of protection — comprehensive on paper, catastrophically
              fragmented in practice.
            </p>
            <blockquote className="border-l-2 border-primary pl-6">
              <p className="italic font-serif text-foreground">
                Blind spots become fault lines where preventable crises take
                shape.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

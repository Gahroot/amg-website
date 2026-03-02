"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, useGSAP, initGSAP } from "@/lib/gsap";

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

      // SplitText word-by-word scrub reveal on body paragraph
      const split = SplitText.create(bodyRef.current, {
        type: "words",
      });

      gsap.set(split.words, { opacity: 0.15 });

      gsap.to(split.words, {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: bodyRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        },
      });

      // Image parallax via ScrollTrigger
      gsap.fromTo(
        imageRef.current,
        { y: 50 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      return () => {
        split.revert();
        ScrollTrigger.getAll().forEach((st) => {
          if (sectionRef.current?.contains(st.trigger as Element)) st.kill();
        });
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: fog image */}
          <div className="overflow-hidden rounded-sm">
            <div ref={imageRef} className="relative aspect-[3/4] rounded-sm overflow-hidden">
              <Image
                src="/images/fog.png"
                alt="Light emerging through fog — revealing what was hidden in blind spots"
                fill
                className="object-cover"
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

"use client";

import { useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/*  Steps data                                                         */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    title: "DISCOVERY & ALIGNMENT",
    description:
      "Confidential intake and cross-domain scoping to understand your full risk landscape, priorities, and existing advisory relationships.",
  },
  {
    number: "02",
    title: "INTELLIGENCE & ASSESSMENT",
    description:
      "Comprehensive baseline assessment across cyber, physical, digital exposure, health, governance, and geopolitical risk domains.",
  },
  {
    number: "03",
    title: "ARCHITECTURE & STRATEGY",
    description:
      "A unified strategic plan that coordinates resources across all domains into a single coherent action plan.",
  },
  {
    number: "04",
    title: "ECOSYSTEM ACTIVATION",
    description:
      "Single point of accountability across all domains. Your AMG partner orchestrates every specialist, every timeline, every deliverable.",
  },
];

/* ------------------------------------------------------------------ */
/*  Media query hooks (useSyncExternalStore)                           */
/* ------------------------------------------------------------------ */

function subscribeToDesktop(cb: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  mqlMotion.addEventListener("change", cb);
  return () => {
    mql.removeEventListener("change", cb);
    mqlMotion.removeEventListener("change", cb);
  };
}

function getCanPinSnapshot() {
  return (
    window.matchMedia("(min-width: 768px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getCanPinServerSnapshot() {
  return false;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const canPin = useSyncExternalStore(
    subscribeToDesktop,
    getCanPinSnapshot,
    getCanPinServerSnapshot
  );

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  GSAP scroll-pinned animation (desktop only)                      */
  /* ---------------------------------------------------------------- */

  useGSAP(
    () => {
      if (!canPin) return;

      initGSAP();

      const section = sectionRef.current;
      const pin = pinRef.current;
      const image = imageRef.current;

      if (!section || !pin || !image) return;

      const items = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      if (items.length === 0) return;

      // Initially hide all step items
      gsap.set(items, { autoAlpha: 0, y: 20 });

      // Master timeline scrubbed by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: pin,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Image parallax across full timeline
      tl.to(
        image,
        {
          y: 30,
          duration: items.length,
          ease: "none",
        },
        0
      );

      // Stagger each step in sequentially
      const segmentDuration = 1;
      items.forEach((item, i) => {
        tl.to(
          item,
          {
            autoAlpha: 1,
            y: 0,
            duration: segmentDuration * 0.5,
            ease: "power2.out",
          },
          i * segmentDuration
        );
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [canPin] }
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative"
      style={{ height: canPin ? "300vh" : "auto" }}
    >
      <div
        ref={pinRef}
        className={
          canPin
            ? "flex items-center min-h-screen py-24 lg:py-32"
            : "py-24 lg:py-32"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section header */}
          <div className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              THE PROCESS
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              How AMG Works
            </h2>
          </div>

          {/* Two-column grid (desktop) or single column (mobile) */}
          <div className={canPin ? "grid grid-cols-2 gap-16" : ""}>
            {/* Compass image */}
            <div className={canPin ? "relative" : "mb-12"}>
              <div ref={imageRef} className="relative aspect-[3/4] rounded-sm overflow-hidden">
                <Image
                  src="/images/compass.jpg"
                  alt="Antique compass pointing north — symbol of decisive direction through complexity"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Numbered steps */}
            <div className="flex flex-col justify-center">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  ref={setStepRef(i)}
                  className={
                    i < steps.length - 1
                      ? "border-b border-[rgba(26,23,20,0.15)] pb-8 mb-8"
                      : ""
                  }
                >
                  <span className="font-serif italic text-4xl text-primary leading-none">
                    {step.number}
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-widest font-semibold mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

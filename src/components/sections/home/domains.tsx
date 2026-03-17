"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";
import { domains } from "@/lib/domains-data";

/* ------------------------------------------------------------------ */
/*  Spoke angle positions (evenly distributed around the circle)       */
/* ------------------------------------------------------------------ */

const SPOKE_ANGLES = [-90, -18, 54, 126, 198]; // degrees, starting from top

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Domains() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const spokeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSpineRef = useRef<HTMLDivElement>(null);
  const mobileRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeDomain, setActiveDomain] = useState<number | null>(null);

  const reducedMotion = useReducedMotion();

  const setSpokeRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      spokeRefs.current[i] = el;
    },
    []
  );

  const setLineRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      lineRefs.current[i] = el;
    },
    []
  );

  const setMobileRowRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      mobileRowRefs.current[i] = el;
    },
    []
  );

  /* ---------------------------------------------------------------- */
  /*  GSAP entrance animation                                          */
  /* ---------------------------------------------------------------- */

  useGSAP(
    () => {
      if (reducedMotion) return;

      initGSAP();

      const section = sectionRef.current;
      const hub = hubRef.current;
      const spine = mobileSpineRef.current;
      if (!section) return;

      /* Desktop: hub + spokes */
      if (hub) {
        const spokes = spokeRefs.current.filter(Boolean) as HTMLDivElement[];
        const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];

        gsap.set(hub, { autoAlpha: 0, scale: 0.6 });
        gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(spokes, { autoAlpha: 0, scale: 0.8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });

        tl.to(hub, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
        tl.to(
          lines,
          {
            scaleX: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08,
          },
          0.25
        );
        tl.to(
          spokes,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08,
          },
          0.4
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }

      /* Mobile: spine + rows */
      if (spine) {
        const rows = mobileRowRefs.current.filter(
          Boolean
        ) as HTMLDivElement[];

        gsap.set(spine, { scaleY: 0, transformOrigin: "top" });
        gsap.set(rows, { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });

        tl.to(spine, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0);
        tl.to(
          rows,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.12,
          },
          0.3
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* ---------------------------------------------------------------- */
  /*  Detail panel (shown below diagram when a domain is selected)     */
  /* ---------------------------------------------------------------- */

  const activeData = activeDomain !== null ? domains[activeDomain] : null;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section ref={sectionRef} id="domains" className="relative z-10 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          OUR DOMAINS
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-16 lg:mb-20">
          An Integrated Suite of Capabilities
        </h2>

        {/* -------------------------------------------------------- */}
        {/*  Desktop: Hub-and-spoke radial layout                     */}
        {/* -------------------------------------------------------- */}
        <div className="hidden md:flex flex-col items-center">
          <div className="relative w-full max-w-[640px] aspect-square">
            {/* Central Hub */}
            <div
              ref={hubRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="w-20 h-20 border-2 border-primary bg-background flex items-center justify-center rotate-45">
                <span className="font-mono text-sm font-bold tracking-widest text-primary -rotate-45">
                  AMG
                </span>
              </div>
            </div>

            {/* Spokes + Connecting Lines */}
            {domains.map((domain, i) => {
              const angle = SPOKE_ANGLES[i];
              const rad = (angle * Math.PI) / 180;
              const radius = 44; // % from center
              const x = 50 + radius * Math.cos(rad);
              const y = 50 + radius * Math.sin(rad);

              // Line geometry: from center to spoke
              const lineLength = Math.sqrt(
                Math.pow((x - 50) * 6.4, 2) + Math.pow((y - 50) * 6.4, 2)
              );
              const lineAngle = Math.atan2((y - 50), (x - 50)) * (180 / Math.PI);

              return (
                <div key={domain.title}>
                  {/* Connecting line */}
                  <div
                    ref={setLineRef(i)}
                    className="absolute origin-left"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${lineLength}px`,
                      height: "1px",
                      backgroundColor: "var(--primary)",
                      opacity: 0.3,
                      transform: `rotate(${lineAngle}deg)`,
                    }}
                  />

                  {/* Spoke node */}
                  <div
                    ref={setSpokeRef(i)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDomain(activeDomain === i ? null : i)
                      }
                      className={`group flex flex-col items-center text-center transition-all duration-300 cursor-pointer ${
                        activeDomain === i
                          ? "scale-110"
                          : "hover:scale-105"
                      }`}
                    >
                      {/* Node dot */}
                      <div
                        className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 mb-2 ${
                          activeDomain === i
                            ? "bg-primary border-primary"
                            : "bg-background border-primary/50 group-hover:border-primary"
                        }`}
                      />
                      {/* Label */}
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest leading-tight max-w-[120px] transition-colors duration-300 ${
                          activeDomain === i
                            ? "text-primary font-semibold"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {domain.title}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            className="w-full max-w-lg text-center mt-8 overflow-hidden transition-all duration-300"
            style={{
              maxHeight: activeData ? "300px" : "0",
              opacity: activeData ? 1 : 0,
            }}
          >
            {activeData && (
              <div className="py-4">
                <h3 className="font-serif text-2xl tracking-tight mb-3">
                  {activeData.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeData.description}
                </p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                  {activeData.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="font-mono text-xs text-foreground"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/*  Mobile: Vertical spine layout                            */}
        {/* -------------------------------------------------------- */}
        <div className="md:hidden">
          <div className="relative pl-12">
            {/* Spine */}
            <div
              ref={mobileSpineRef}
              className="absolute left-[7px] top-0 bottom-0 w-px bg-primary/20 origin-top"
            />

            {/* Domain list */}
            <div className="space-y-10">
              {domains.map((domain, i) => (
                <div
                  key={domain.title}
                  ref={setMobileRowRef(i)}
                  className="flex items-start"
                >
                  {/* Connector */}
                  <div className="flex items-center shrink-0 mt-1.5 -ml-12">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="w-10 h-px bg-primary/20 ml-px" />
                  </div>

                  {/* Content */}
                  <div className="ml-1">
                    <h4 className="font-mono text-sm uppercase tracking-widest font-semibold mb-2 text-foreground">
                      {domain.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {domain.description}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {domain.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="font-mono text-[11px] text-muted-foreground"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/strategies"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors group"
          >
            Discover How AMG Works
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

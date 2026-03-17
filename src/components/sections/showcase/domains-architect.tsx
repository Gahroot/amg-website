"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";
import { domains } from "@/lib/domains-data";
import { DomainsMobileSpine } from "./domains-mobile-spine";

/* ------------------------------------------------------------------ */
/*  Spoke angle positions (evenly distributed, starting from top)      */
/* ------------------------------------------------------------------ */

const SPOKE_ANGLES = [-90, -18, 54, 126, 198];
const SPOKE_RADIUS = 44; // % from center

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Determine which side of the hub the card should extend toward. */
function getCardPlacement(angleDeg: number) {
  // Normalize to 0..360
  const norm = ((angleDeg % 360) + 360) % 360;
  // Right hemisphere: 270-360 (top-right) or 0-90 (bottom-right)
  const isRight = norm >= 270 || norm <= 90;
  return isRight ? "right" : "left";
}

/** Compute label text-alignment and offset based on angle quadrant. */
function getLabelStyle(angleDeg: number): {
  textAlign: "left" | "right" | "center";
  offsetX: number;
  offsetY: number;
} {
  const norm = ((angleDeg % 360) + 360) % 360;

  // Top quadrant (350-10): center, push down below icon
  if (norm >= 350 || norm <= 10) {
    return { textAlign: "center", offsetX: 0, offsetY: 4 };
  }
  // Right quadrant (10-135 + 315-350): left-align, push right
  if ((norm > 10 && norm <= 135) || (norm >= 315 && norm < 350)) {
    return { textAlign: "left", offsetX: 28, offsetY: -4 };
  }
  // Bottom quadrant (135-225): center, push down
  if (norm > 135 && norm <= 225) {
    return { textAlign: "center", offsetX: 0, offsetY: 24 };
  }
  // Left quadrant (225-315): right-align, push left
  return { textAlign: "right", offsetX: -28, offsetY: -4 };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DomainsArchitect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const spokeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  /* ---------------------------------------------------------------- */
  /*  GSAP entrance animation                                          */
  /* ---------------------------------------------------------------- */

  useGSAP(
    () => {
      if (reducedMotion) return;

      initGSAP();

      const section = sectionRef.current;
      const hub = hubRef.current;
      if (!section || !hub) return;

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
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* ---------------------------------------------------------------- */
  /*  Active domain data                                               */
  /* ---------------------------------------------------------------- */

  const activeData = activeDomain !== null ? domains[activeDomain] : null;
  const activeAngle = activeDomain !== null ? SPOKE_ANGLES[activeDomain] : 0;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="domains"
      className="relative z-10 py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          OUR DOMAINS
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-16 lg:mb-20">
          An Integrated Suite of Capabilities
        </h2>

        {/* ------------------------------------------------------ */}
        {/*  Desktop: Hub-and-spoke radial layout                   */}
        {/* ------------------------------------------------------ */}
        <div className="hidden md:flex flex-col items-center">
          <div className="relative w-full max-w-[640px] aspect-square">
            {/* Central Hub - diamond */}
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
              const rad = toRad(angle);
              const x = 50 + SPOKE_RADIUS * Math.cos(rad);
              const y = 50 + SPOKE_RADIUS * Math.sin(rad);

              // Line from center to spoke node
              const lineLength = Math.sqrt(
                Math.pow((x - 50) * 6.4, 2) + Math.pow((y - 50) * 6.4, 2)
              );
              const lineAngle =
                Math.atan2(y - 50, x - 50) * (180 / Math.PI);

              const isActive = activeDomain === i;
              const Icon = domain.icon;
              const labelStyle = getLabelStyle(angle);

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
                      opacity: isActive ? undefined : 0.3,
                      transform: `rotate(${lineAngle}deg)`,
                      animation: isActive
                        ? "gold-pulse 1.5s ease-in-out infinite"
                        : undefined,
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
                        isActive ? "scale-110" : "hover:scale-105"
                      }`}
                    >
                      {/* Icon circle node */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 mb-2 ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-primary/30 text-muted-foreground group-hover:border-primary group-hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>

                      {/* Label - positioned based on angle quadrant */}
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest leading-tight max-w-[120px] transition-colors duration-300 whitespace-nowrap ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                        style={{
                          textAlign: labelStyle.textAlign,
                          transform: `translate(${labelStyle.offsetX}px, ${labelStyle.offsetY}px)`,
                        }}
                      >
                        {domain.title}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Adjacent detail panel */}
            <AnimatePresence mode="wait">
              {activeData !== null && activeDomain !== null && (
                <DetailCard
                  key={activeDomain}
                  domain={activeData}
                  angle={activeAngle}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/*  Mobile: Vertical spine layout                          */}
        {/* ------------------------------------------------------ */}
        <DomainsMobileSpine domains={domains} />

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

/* ------------------------------------------------------------------ */
/*  Detail Card - positioned outward from the active spoke             */
/* ------------------------------------------------------------------ */

function DetailCard({
  domain,
  angle,
}: {
  domain: (typeof domains)[number];
  angle: number;
}) {
  const rad = toRad(angle);
  const spokeX = 50 + SPOKE_RADIUS * Math.cos(rad);
  const spokeY = 50 + SPOKE_RADIUS * Math.sin(rad);
  const placement = getCardPlacement(angle);

  // Push card further outward from the spoke node
  const cardOffsetX = placement === "right" ? 32 : -292; // 32px gap or card width + gap
  const cardOffsetY = -40; // vertically center relative to node

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute z-20 w-60 bg-card border border-border/50 p-4 shadow-sm"
      style={{
        left: `${spokeX}%`,
        top: `${spokeY}%`,
        transform: `translate(${cardOffsetX}px, ${cardOffsetY}px)`,
      }}
    >
      <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-foreground mb-2">
        {domain.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {domain.description}
      </p>
      <ul className="space-y-1">
        {domain.capabilities.map((cap) => (
          <li
            key={cap}
            className="font-mono text-[11px] text-muted-foreground flex items-start gap-1.5"
          >
            <span className="text-primary mt-0.5 shrink-0">&bull;</span>
            {cap}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

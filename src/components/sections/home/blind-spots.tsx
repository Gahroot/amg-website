"use client";

import { motion, useTransform } from "motion/react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Separator } from "@/components/ui/separator";
import { useScrollPin } from "@/lib/use-scroll-pin";

const fragmentedItems = [
  "Wealth Advisor",
  "Estate Attorney",
  "Security Consultant",
  "Insurance Broker",
  "IT / Cyber Team",
];

const integratedItems = [
  "Unified Threat Picture",
  "Cross-Domain Coordination",
  "Single Point of Command",
  "Real-Time Intelligence",
  "Proactive Risk Mitigation",
];

function DesktopScrollTransition() {
  const { containerRef, scrollYProgress, isActive, trackHeight } =
    useScrollPin({ trackHeight: "300vh" });

  // Phase 1 (0–0.4): Fragmented visible
  const fragmentedOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [1, 1, 0],
  );
  // Phase 3 (0.6–1.0): Integrated visible
  const integratedOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 1],
    [0, 1, 1],
  );

  // Left column text cross-fade
  const fragmentedTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5],
    [1, 1, 0],
  );
  const integratedTextOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.5, 1],
    [0, 1, 1],
  );

  // Scatter/converge as single x values applied at container level
  const fragmentedX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [0, 0, 20],
  );
  const integratedX = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7],
    [-20, 0, 0],
  );

  // Connecting lines opacity for integrated phase
  const lineOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  // Background tint shift
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 0.05]);

  return (
    <div
      ref={containerRef}
      className={isActive ? "hidden md:block scroll-pin-container" : "hidden"}
      style={{ height: trackHeight }}
    >
      <div className="scroll-pin-viewport">
        <div className="h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-2 gap-16 items-center">
              {/* Left column: text that cross-fades */}
              <div className="relative">
                {/* Fragmented text */}
                <motion.div style={{ opacity: fragmentedTextOpacity }}>
                  <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
                    The Blind Spot
                  </p>
                  <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
                    Every Advisor Holds a Vital Piece — in Isolation
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    Your wealth advisor sees the portfolio. Your attorney sees
                    the trust structure. Your security team sees the threat
                    landscape. None of them see each other&apos;s blind spots.
                  </p>
                  <blockquote className="border-l-2 border-primary pl-6">
                    <p className="italic text-foreground">
                      Blind spots become fault lines where preventable crises
                      take shape.
                    </p>
                  </blockquote>
                </motion.div>

                {/* Integrated text */}
                <motion.div
                  className="absolute inset-0"
                  style={{ opacity: integratedTextOpacity }}
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
                    The Solution
                  </p>
                  <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
                    One Command Structure. Total Visibility.
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    AMG unifies every domain under a single operating system —
                    one partner who orchestrates your entire protection
                    ecosystem.
                  </p>
                  <blockquote className="border-l-2 border-primary pl-6">
                    <p className="italic text-foreground">
                      Integration isn&apos;t a luxury. It&apos;s the only
                      architecture that works.
                    </p>
                  </blockquote>
                </motion.div>
              </div>

              {/* Right column: items that transition */}
              <div className="relative">
                {/* Background tint */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary"
                  style={{ opacity: bgOpacity }}
                />

                <div className="bg-secondary/50 rounded-lg p-8 relative">
                  {/* Fragmented items */}
                  <motion.div
                    style={{ opacity: fragmentedOpacity, x: fragmentedX }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-destructive">
                        Fragmented
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {fragmentedItems.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-destructive/60" />
                          <span className="text-sm text-muted-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <Separator className="my-6" />

                  {/* Integrated items */}
                  <motion.div
                    style={{ opacity: integratedOpacity, x: integratedX }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                        Integrated
                      </h3>
                    </div>
                    <ul className="space-y-3 relative">
                      {/* Connecting line */}
                      <motion.div
                        className="absolute left-[3px] top-1 bottom-1 w-px bg-primary/40"
                        style={{ opacity: lineOpacity }}
                      />
                      {integratedItems.map((item) => (
                        <li key={item} className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm text-foreground">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlindSpots() {
  return (
    <section className="bg-card/90">
      {/* Desktop: scroll-driven transition */}
      <DesktopScrollTransition />

      {/* Mobile: static layout */}
      <div className="md:hidden py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 items-center">
            <AnimateOnScroll>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
                The Blind Spot
              </p>
              <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
                Every Advisor Holds a Vital Piece — in Isolation
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Your wealth advisor sees the portfolio. Your attorney sees the
                trust structure. Your security team sees the threat landscape.
                None of them see each other&apos;s blind spots.
              </p>
              <blockquote className="border-l-2 border-primary pl-6">
                <p className="italic text-foreground">
                  Blind spots become fault lines where preventable crises take
                  shape.
                </p>
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <div className="bg-secondary/50 rounded-lg p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-destructive">
                      Fragmented
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {fragmentedItems.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-destructive/60" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                      Integrated
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {integratedItems.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

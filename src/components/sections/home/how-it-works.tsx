"use client";

import { motion, useTransform } from "motion/react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Search, Eye, Map, Users, RefreshCw } from "lucide-react";
import { useScrollPin } from "@/lib/use-scroll-pin";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "DISCOVERY & ALIGNMENT",
    description:
      "Confidential intake and cross-domain scoping to understand your full risk landscape, priorities, and existing advisory relationships.",
  },
  {
    number: "02",
    icon: Eye,
    title: "INTELLIGENCE & ASSESSMENT",
    description:
      "Comprehensive baseline assessment across cyber, physical, digital exposure, health, governance, and geopolitical risk domains.",
  },
  {
    number: "03",
    icon: Map,
    title: "ARCHITECTURE & STRATEGY",
    description:
      "A unified strategic plan that coordinates resources across all domains into a single coherent action plan with clear timelines and measurable outcomes.",
  },
  {
    number: "04",
    icon: Users,
    title: "ECOSYSTEM ACTIVATION",
    description:
      "Single point of accountability across all domains. Your AMG partner orchestrates every specialist, every timeline, every deliverable.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "ONGOING OPERATIONS & EVOLUTION",
    description:
      "Continuous monitoring, quarterly reviews, and adaptive refinement as threats evolve and circumstances change.",
  },
];

function DesktopScrollPinned() {
  const { containerRef, scrollYProgress, isActive, trackHeight } =
    useScrollPin({ trackHeight: "400vh" });

  // Horizontal translation: move cards from 0% to -80%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  // Progress line width
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Per-card fade-in based on scroll position
  const cardOpacities = [
    useTransform(scrollYProgress, [0, 0.05], [0, 1]),
    useTransform(scrollYProgress, [0.1, 0.2], [0, 1]),
    useTransform(scrollYProgress, [0.25, 0.35], [0, 1]),
    useTransform(scrollYProgress, [0.4, 0.5], [0, 1]),
    useTransform(scrollYProgress, [0.55, 0.65], [0, 1]),
  ];

  return (
    <div
      ref={containerRef}
      className={isActive ? "hidden md:block scroll-pin-container" : "hidden"}
      style={{ height: trackHeight }}
    >
      <div className="scroll-pin-viewport">
        <div className="h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              THE PROCESS
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
              HOW AMG WORKS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A disciplined five-phase methodology that transforms fragmented
              protection into integrated resilience.
            </p>
          </div>

          {/* Progress line */}
          <div className="relative h-px bg-border mb-8">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Horizontal card track */}
          <div className="overflow-hidden">
            <motion.div className="flex gap-8" style={{ x }}>
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    className="flex-shrink-0 w-80 border border-border rounded-lg p-8 bg-card relative overflow-hidden"
                    style={{ opacity: cardOpacities[index] }}
                  >
                    {/* Watermark step number */}
                    <span className="absolute -bottom-4 -right-2 font-mono text-[8rem] font-bold leading-none text-primary/5 select-none">
                      {step.number}
                    </span>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <span className="font-mono text-sm text-primary font-bold">
                            {step.number}
                          </span>
                        </div>
                        <Icon className="size-5 text-primary" />
                      </div>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-tight mb-3 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card/90">
      {/* Desktop: scroll-pinned horizontal reveal */}
      <DesktopScrollPinned />

      {/* Mobile: vertical stack */}
      <div className="md:hidden py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              THE PROCESS
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
              HOW AMG WORKS
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A disciplined five-phase methodology that transforms fragmented
              protection into integrated resilience.
            </p>
          </AnimateOnScroll>

          <div className="mt-16 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimateOnScroll key={step.number} delay={index * 0.1}>
                  <div className="flex items-start gap-4">
                    <div className="flex w-12 h-12 rounded-full bg-primary/10 border border-primary/30 items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-primary font-bold mb-1">
                        {step.number}
                      </div>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-tight mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Search, Eye, Map, Users, RefreshCw } from "lucide-react";

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

export function HowItWorks() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-card/90">
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

        {/* Desktop: horizontal scroll */}
        <div
          ref={scrollRef}
          className="hidden md:flex mt-16 gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimateOnScroll key={step.number} delay={index * 0.1}>
                <div className="snap-start flex-shrink-0 w-72 border border-border rounded-lg p-6 bg-background">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="font-mono text-xs text-primary font-bold">
                        {step.number}
                      </span>
                    </div>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-tight mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Mobile: vertical stack */}
        <div className="md:hidden mt-16 space-y-6">
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
    </section>
  );
}

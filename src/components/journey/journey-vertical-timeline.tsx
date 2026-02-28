"use client";

/**
 * JourneyVerticalTimeline
 *
 * Vertical timeline section with 5 content stops.
 *
 * Desktop behavior:
 * - Pinned scroll (500vh track height)
 * - Vertical line with animated dot that travels down
 * - Content panels fade/slide in when dot reaches each stop
 *
 * Mobile behavior:
 * - Vertical stack with progress indicator at top
 */

import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { timelineStops } from "@/lib/journey-data";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  Award,
  Globe,
} from "lucide-react";

interface JourneyVerticalTimelineProps {
  trackHeight?: string;
}

// Global GSAP instances
let gsapInstance: typeof import("gsap").gsap | null = null;
let ScrollTriggerInstance: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;
let gsapInitialized = false;

async function getGSAP() {
  if (typeof window === "undefined") return null;
  if (gsapInitialized) return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };

  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");

  gsapInstance = gsapModule.gsap;
  ScrollTriggerInstance = scrollTriggerModule.ScrollTrigger;

  gsapInstance.registerPlugin(ScrollTriggerInstance);
  gsapInitialized = true;

  return { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance };
}

// Icon components
const SingleRelationshipIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <Shield className="w-6 h-6 text-primary" strokeWidth={1.5} />
  </div>
);

const CollaborationIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative flex-shrink-0">
    <div className="absolute w-4 h-4 rounded-full bg-primary/30 -top-1 -left-1" />
    <div className="absolute w-4 h-4 rounded-full bg-primary/50 -bottom-1 -right-1" />
    <div className="w-6 h-6 rounded-full bg-primary" />
  </div>
);

const IntelligenceIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <Zap className="w-6 h-6 text-primary" strokeWidth={2} />
  </div>
);

const ConfidentialityIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-primary" />
    </div>
  </div>
);

const VisibilityIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <Globe className="w-6 h-6 text-primary" strokeWidth={1.5} />
  </div>
);

const ResponseIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <Zap className="w-6 h-6 text-primary" strokeWidth={2} />
  </div>
);

const ProactiveIcon = () => (
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
    <Award className="w-6 h-6 text-primary" strokeWidth={1.5} />
  </div>
);

export function JourneyVerticalTimeline({
  trackHeight = "500vh",
}: JourneyVerticalTimelineProps) {
  const [isClient] = useState(() => typeof window !== "undefined");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const stopsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!isClient) return;

    const setupAnimation = async () => {
      const result = await getGSAP();
      if (!result || !containerRef.current) return;

      const { gsap, ScrollTrigger } = result;
      if (!gsap || !ScrollTrigger) return;

      const container = containerRef.current;
      const line = lineRef.current;
      const dot = dotRef.current;
      const stops = stopsRefs.current.filter(Boolean);

      if (!line || !dot || stops.length === 0) return;

      const mobile = window.innerWidth < 768;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (mobile || reducedMotion) return;

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      const firstStop = stops[0];
      const lastStop = stops[stops.length - 1];

      if (!firstStop || !lastStop) return;

      const lineTop = firstStop.offsetTop + firstStop.offsetHeight / 2;
      const lineBottom = lastStop.offsetTop + lastStop.offsetHeight / 2;
      const lineDistance = lineBottom - lineTop;

      gsap.set(line, { height: lineDistance });

      const ctx = gsap.context(() => {
        gsap.to(dot, {
          top: lineDistance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        stops.forEach((stop) => {
          if (!stop) return;
          const content = stop.querySelector(".timeline-content");
          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0.3, y: 30 },
              {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                  trigger: stop,
                  start: "top 60%",
                  end: "top 40%",
                  scrub: true,
                },
              }
            );
          }
        });
      }, container);

      (container as unknown as { _gsapContext?: gsap.Context })._gsapContext = ctx;
    };

    setupAnimation();

    // Capture ref value for cleanup
    const container = containerRef.current;
    return () => {
      if (container) {
        const ctx = (container as unknown as { _gsapContext?: gsap.Context })._gsapContext;
        if (ctx) ctx.revert();
      }
    };
  }, [isClient]);

  // Mobile detection
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isClient]);

  // Mobile: IntersectionObserver for active stop tracking
  useEffect(() => {
    if (!isMobile) return;

    const stops = stopsRefs.current.filter(Boolean);
    if (stops.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stops.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveStopIndex(index);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-50% 0px -50% 0px" }
    );

    stops.forEach((stop) => stop && observer.observe(stop));
    return () => stops.forEach((stop) => stop && observer.unobserve(stop));
  }, [isMobile]);

  const renderStopContent = (stop: (typeof timelineStops)[0]) => {
    if (stop.id === "problem" && stop.cards) {
      return (
        <div className="timeline-content space-y-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              {stop.label}
            </p>
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
              {stop.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {stop.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stop.cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-mono text-base font-semibold uppercase tracking-tight mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {stop.quote && (
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-foreground text-lg">
              {stop.quote}
            </blockquote>
          )}
        </div>
      );
    }

    if (stop.id === "blind-spots") {
      return (
        <div className="timeline-content space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              {stop.label}
            </p>
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
              {stop.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              {stop.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-destructive/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-destructive" strokeWidth={2} />
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-destructive">
                  Fragmented
                </h3>
              </div>
              <ul className="space-y-4">
                {["Wealth Advisor", "Estate Attorney", "Security Consultant", "IT / Cyber Team"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-destructive/60" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-card border border-primary/30 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-primary" strokeWidth={2} />
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
                  Integrated
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Unified Threat Picture",
                  "Cross-Domain Coordination",
                  "Single Point of Command",
                  "Real-Time Intelligence",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {stop.quote && (
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-foreground text-lg">
              {stop.quote}
            </blockquote>
          )}
        </div>
      );
    }

    if (stop.id === "amg-approach" && stop.differentiators) {
      return (
        <div className="timeline-content space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              {stop.label}
            </p>
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
              {stop.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {stop.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-5 p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300">
              <SingleRelationshipIcon />
              <div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Single Trusted Relationship
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  One dedicated partner who understands your full picture.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300">
              <CollaborationIcon />
              <div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Collaboration-First Model
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We work alongside your existing advisors — enhancing, not replacing.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300">
              <IntelligenceIcon />
              <div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Intelligence-Led Architecture
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every recommendation grounded in real-time intelligence.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300">
              <ConfidentialityIcon />
              <div>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mb-2">
                  Strict Confidentiality
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discretion engineered into every process.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (stop.id === "integrated-solutions") {
      return (
        <div className="timeline-content space-y-8 text-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              {stop.label}
            </p>
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
              {stop.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {stop.description}
            </p>
          </div>

          {stop.quote && (
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-foreground text-lg max-w-2xl mx-auto">
              {stop.quote}
            </blockquote>
          )}

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
            {[
              { num: "01", label: "Cybersecurity" },
              { num: "02", label: "Due Diligence" },
              { num: "03", label: "Communications" },
              { num: "04", label: "Intelligence" },
              { num: "05", label: "Advisory" },
              { num: "06", label: "Training" },
            ].map((domain) => (
              <div key={domain.num} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-mono text-primary font-bold">
                    {domain.num}
                  </span>
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {domain.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (stop.id === "outcomes" && stop.differentiators) {
      return (
        <div className="timeline-content space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              {stop.label}
            </p>
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
              {stop.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {stop.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <VisibilityIcon />
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mt-4 mb-3">
                Total Visibility
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                See your entire risk landscape in one place.
              </p>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <ResponseIcon />
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mt-4 mb-3">
                Rapid Response
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Immediate, coordinated action across all domains.
              </p>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <ProactiveIcon />
              <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-primary mt-4 mb-3">
                Proactive Resilience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Identify and mitigate threats before they materialize.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="timeline-content">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          {stop.label}
        </p>
        <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground mb-6">
          {stop.title}
        </h2>
        <p className="text-xl text-muted-foreground">{stop.description}</p>
      </div>
    );
  };

  // Desktop: Pinned timeline with animated dot
  if (!isMobile) {
    return (
      <section
        ref={containerRef}
        className="journey-vertical-timeline relative bg-background"
        style={{ height: trackHeight }}
      >
        <div className="timeline-viewport sticky top-0 overflow-hidden" style={{ height: "100vh" }}>
          <div className="h-full flex items-center py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-12 gap-8 lg:gap-12">
                <div className="col-span-1 relative">
                  <div
                    ref={lineRef}
                    className="absolute left-1/2 top-0 w-px bg-primary/20 -translate-x-1/2"
                    style={{ height: 0 }}
                  >
                    <div
                      ref={dotRef}
                      className="absolute top-0 left-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background -translate-x-1/2 -translate-y-1/2 shadow-lg"
                      style={{ top: 0 }}
                    />
                  </div>
                </div>

                <div className="col-span-11 space-y-40">
                  {timelineStops.map((stop, index) => (
                    <div
                      key={stop.id}
                      ref={(el) => {
                        stopsRefs.current[index] = el;
                      }}
                      className="timeline-stop min-h-[40vh] flex items-center"
                    >
                      <div className="w-full">{renderStopContent(stop)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile
  return (
    <section className="journey-vertical-timeline-mobile py-20 bg-background">
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary/10 z-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((activeStopIndex + 1) / timelineStops.length) * 100}%`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-12">
        {timelineStops.map((stop, index) => (
          <div
            key={stop.id}
            ref={(el) => {
              stopsRefs.current[index] = el;
            }}
            className="timeline-stop-mobile min-h-[60vh] flex items-center scroll-mt-20"
          >
            <div className="mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-primary/60">
                0{index + 1} / {timelineStops.length.toString().padStart(2, "0")}
              </span>
            </div>
            {renderStopContent(stop)}
          </div>
        ))}
      </div>
    </section>
  );
}

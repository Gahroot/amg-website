"use client";

/**
 * JourneyVerticalTimeline
 *
 * Vertical timeline section with 5 content stops.
 *
 * Desktop behavior:
 * - Natural-height stack: every stage scrolls with the document
 * - Static timeline rail and stage markers, including reduced motion
 *
 * Mobile behavior:
 * - Vertical stack with progress indicator at top
 */

import React, { useRef, useState, useEffect } from "react";
import { timelineStops } from "@/lib/journey-data";
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  Award,
  Globe,
} from "lucide-react";

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

export function JourneyVerticalTimeline(): React.JSX.Element {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const stopsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

          <div className="timeline-outcomes-grid grid grid-cols-1 md:grid-cols-3 gap-6">
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

  // Desktop content stays in document flow, independent of viewport height or motion.
  if (!isMobile) {
    return (
      <section className="journey-vertical-timeline relative bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative space-y-24 lg:space-y-32">
            <div
              aria-hidden="true"
              className="absolute left-4 inset-y-0 w-px bg-primary/20"
            />
            {timelineStops.map((stop, index) => (
              <div
                key={stop.id}
                className="timeline-stop relative pl-16 lg:pl-24"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border border-primary/30 flex items-center justify-center font-mono text-xs text-primary"
                >
                  {index + 1}
                </span>
                {renderStopContent(stop)}
              </div>
            ))}
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

import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const capabilities = [
  {
    title: "ASSESS",
    description:
      "Comprehensive cross-domain vulnerability assessments that reveal what siloed advisors miss.",
  },
  {
    title: "ARCHITECT",
    description:
      "Unified strategic blueprints that coordinate legal, financial, security, health, and intelligence resources.",
  },
  {
    title: "DELIVER",
    description:
      "Single point of accountability. We orchestrate every specialist, every timeline, every deliverable.",
  },
];

export function WhatWeDo() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            WHAT WE DO
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            A DISCIPLINED METHODOLOGY
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Three phases. One integrated outcome.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {capabilities.map((cap, i) => (
            <AnimateOnScroll key={cap.title} delay={i * 0.1}>
              <Card className="bg-background border-border hover:border-primary/30 transition-colors h-full">
                <CardContent className="p-6">
                  <h3 className="font-mono text-lg font-bold uppercase tracking-tight text-foreground mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-muted-foreground">{cap.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

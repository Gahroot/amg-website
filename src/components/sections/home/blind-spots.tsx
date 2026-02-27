import { AlertTriangle, CheckCircle } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Separator } from "@/components/ui/separator";

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

export function BlindSpots() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimateOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              The Blind Spot
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
              Every Advisor Holds a Vital Piece — in Isolation
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Your wealth advisor sees the portfolio. Your attorney sees the
              trust structure. Your security team sees the threat landscape. None
              of them see each other&apos;s blind spots.
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
    </section>
  );
}

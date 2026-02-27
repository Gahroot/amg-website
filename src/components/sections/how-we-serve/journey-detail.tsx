import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Search, Eye, Map, Users, RefreshCw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "DISCOVERY & ALIGNMENT",
    description:
      "Confidential intake and cross-domain scoping to understand your full risk landscape, priorities, and existing advisory relationships.",
    details:
      "Our discovery process begins with a confidential intake and spans 2-4 weeks. We deploy domain specialists across cybersecurity, intelligence, advisory, and operations to conduct parallel assessments. The result is a unified threat and opportunity map that no single advisor could produce alone.",
  },
  {
    number: "02",
    icon: Eye,
    title: "INTELLIGENCE & ASSESSMENT",
    description:
      "Comprehensive baseline assessment across cyber, physical, digital exposure, health, governance, and geopolitical risk domains.",
    details:
      "Our intelligence team conducts a thorough baseline assessment spanning all relevant risk domains. We evaluate your current posture, identify gaps in existing coverage, and map interdependencies between threat vectors that siloed advisors typically miss.",
  },
  {
    number: "03",
    icon: Map,
    title: "ARCHITECTURE & STRATEGY",
    description:
      "A unified strategic plan that coordinates resources across all domains into a single coherent action plan.",
    details:
      "Your blueprint prioritizes interventions by risk severity and interdependency. Each recommendation is sequenced, resourced, and assigned to a responsible domain partner — with clear timelines and measurable outcomes defined from the start.",
  },
  {
    number: "04",
    icon: Users,
    title: "ECOSYSTEM ACTIVATION",
    description:
      "Single point of accountability across all domains. Your AMG partner orchestrates every specialist, every timeline, every deliverable.",
    details:
      "Your dedicated AMG partner serves as the single point of contact and accountability. They coordinate across all domain specialists, manage timelines, resolve conflicts between workstreams, and ensure nothing falls through the cracks between advisors.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "ONGOING OPERATIONS & EVOLUTION",
    description:
      "Continuous monitoring, quarterly reviews, and adaptive refinement as threats evolve and circumstances change.",
    details:
      "Threats evolve. Family dynamics shift. Markets move. Our ongoing support includes quarterly strategic reviews, 24/7 incident response capability, annual reassessments, and proactive intelligence briefings tailored to your specific risk profile.",
  },
];

export function JourneyDetail() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE PROCESS
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            YOUR JOURNEY WITH AMG
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A disciplined five-phase methodology that transforms fragmented
            protection into integrated resilience.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 relative">
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-border" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimateOnScroll key={step.number} delay={index * 0.1}>
                <div className="flex items-start gap-6 mb-16">
                  <div className="md:flex hidden w-16 h-16 rounded-full bg-primary/10 border border-primary/30 items-center justify-center flex-shrink-0">
                    <span className="font-mono text-primary font-bold">
                      {step.number}
                    </span>
                  </div>
                  <div className="md:hidden flex w-12 h-12 rounded-full bg-primary/10 border border-primary/30 items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono text-lg font-semibold uppercase tracking-tight mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-foreground font-medium mb-3">
                      {step.description}
                    </p>
                    <p className="text-muted-foreground">
                      {step.details}
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

import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import {
  ShieldCheck,
  Search,
  Lock,
  Eye,
  UserCheck,
  Target,
} from "lucide-react";

const solutions = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Cybersecurity Strategy & Risk Management",
    description:
      "Enterprise-grade cyber defense tailored for private clients — from threat modeling and penetration testing to incident response and digital hygiene.",
  },
  {
    number: "02",
    icon: Search,
    title: "Corporate & Investment Due Diligence",
    description:
      "Deep-dive intelligence on counterparties, investments, and partnerships — uncovering hidden risks before they become liabilities.",
  },
  {
    number: "03",
    icon: Lock,
    title: "Secure Communications Platforms",
    description:
      "Encrypted, sovereign communication infrastructure for families and organizations that demand absolute privacy.",
  },
  {
    number: "04",
    icon: Eye,
    title: "Business Intelligence & Threat Monitoring",
    description:
      "Continuous monitoring of geopolitical, reputational, and operational threats with real-time intelligence briefings.",
  },
  {
    number: "05",
    icon: UserCheck,
    title: "Private Client Advisory",
    description:
      "Bespoke strategic counsel for UHNW individuals and family offices navigating complex risk landscapes.",
  },
  {
    number: "06",
    icon: Target,
    title: "Training & Simulation",
    description:
      "Realistic scenario-based exercises that prepare principals and their teams for crisis, breach, and disruption.",
  },
];

export function SixSolutions() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            WHAT WE DO
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            INTEGRATED SOLUTIONS FOR TOTAL ASSET PROTECTION
          </h2>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <AnimateOnScroll key={solution.number} delay={index * 0.08}>
                <div className="border border-border rounded-lg p-6 bg-background h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-primary font-bold">
                      {solution.number}
                    </span>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-tight mb-3 text-foreground">
                    {solution.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {solution.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll delay={0.5}>
          <p className="mt-12 text-center font-mono text-lg text-primary italic">
            &ldquo;Where others see complexity, we build clarity.&rdquo;
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

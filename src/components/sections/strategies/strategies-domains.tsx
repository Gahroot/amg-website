"use client";

import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Brain,
  ShieldCheck,
  Target,
  HeartPulse,
  Globe,
  CheckCircle,
} from "lucide-react";

const domains = [
  {
    value: "neurobiology",
    icon: Brain,
    title: "NEUROBIOLOGY & PERFORMANCE",
    partner: "Dr. Charles Morgan III",
    description:
      "Optimizing cognitive performance, stress resilience, and decision-making under pressure for principals and key family members. Our neurobiology protocols are drawn from elite military and intelligence community methodologies, adapted for the unique demands of UHNW family leadership.",
    capabilities: [
      "Peak performance protocols",
      "Stress inoculation training",
      "Cognitive optimization",
      "Executive function enhancement",
    ],
  },
  {
    value: "cyber-security",
    icon: ShieldCheck,
    title: "CYBER & PROTECTIVE SECURITY",
    partner: "AMG Labs + Scot Holzschuh",
    description:
      "Comprehensive digital and physical security architecture protecting family members, assets, and reputation across all environments. We integrate cyber defense, executive protection, and secure communications into a unified shield.",
    capabilities: [
      "Threat assessment & monitoring",
      "Digital forensics & incident response",
      "Executive protection",
      "Secure communications",
    ],
  },
  {
    value: "leadership",
    icon: Target,
    title: "LEADERSHIP DEVELOPMENT",
    partner: "Ryan Krupa",
    description:
      "Building next-generation leadership capacity and succession readiness across family enterprise and governance structures. Our programs develop the strategic thinking, emotional intelligence, and operational competence that sustaining wealth requires.",
    capabilities: [
      "Succession planning",
      "Next-gen development programs",
      "Governance frameworks",
      "Family council facilitation",
    ],
  },
  {
    value: "medicine",
    icon: HeartPulse,
    title: "INTEGRATIVE MEDICINE",
    partner: "Dr. James LaValle",
    description:
      "Personalized health optimization combining conventional and integrative approaches for sustained peak performance and longevity. We address the metabolic, hormonal, and nutritional foundations that underpin cognitive and physical resilience.",
    capabilities: [
      "Metabolic optimization",
      "Longevity protocols",
      "Personalized health plans",
      "Performance medicine",
    ],
  },
  {
    value: "intelligence",
    icon: Globe,
    title: "BUSINESS INTELLIGENCE & GEOPOLITICAL RISK",
    partner: "Dr. Barry McManus",
    description:
      "Strategic intelligence gathering and analysis to identify threats, opportunities, and risks across global operations. Our analysts draw on decades of intelligence community experience to provide actionable insights for complex decision-making.",
    capabilities: [
      "Geopolitical risk assessment",
      "Due diligence investigations",
      "Competitive intelligence",
      "Crisis forecasting",
    ],
  },
];

export function StrategiesDomains() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            FIVE DOMAINS
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            THE AMG ECOSYSTEM
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Each domain is led by world-class practitioners with deep expertise.
            Together, they form an integrated defense and performance system
            unlike anything available in the private sector.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <Accordion type="single" collapsible className="w-full">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <AccordionItem key={domain.value} value={domain.value}>
                  <AccordionTrigger className="py-6 text-base hover:no-underline">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-mono text-sm sm:text-base font-semibold uppercase tracking-tight text-foreground">
                        {domain.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-14">
                    <p className="text-muted-foreground text-base mb-6">
                      {domain.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {domain.capabilities.map((capability) => (
                        <div
                          key={capability}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{capability}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Domain Partner:
                      </span>
                      <span className="text-primary font-medium">
                        {domain.partner}
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

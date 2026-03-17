import { Brain, Shield, Users, Heart, Search, type LucideIcon } from "lucide-react";

export interface Domain {
  title: string;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
}

export const domains: Domain[] = [
  {
    title: "Neurobiology & Performance",
    description:
      "Optimizing cognitive performance, stress resilience, and decision-making under pressure.",
    capabilities: [
      "Peak performance protocols",
      "Stress inoculation training",
      "Cognitive optimization",
      "Executive function enhancement",
    ],
    icon: Brain,
  },
  {
    title: "Cyber & Protective Security",
    description:
      "Comprehensive digital and physical security architecture protecting family members, assets, and reputation.",
    capabilities: [
      "Threat assessment & monitoring",
      "Digital forensics & incident response",
      "Executive protection",
      "Secure communications",
    ],
    icon: Shield,
  },
  {
    title: "Leadership Development",
    description:
      "Building next-generation leadership capacity and succession readiness across family enterprise.",
    capabilities: [
      "Succession planning",
      "Next-gen development programs",
      "Governance frameworks",
      "Family council facilitation",
    ],
    icon: Users,
  },
  {
    title: "Integrative Medicine",
    description:
      "Personalized health optimization combining conventional and integrative approaches.",
    capabilities: [
      "Metabolic optimization",
      "Longevity protocols",
      "Personalized health plans",
      "Performance medicine",
    ],
    icon: Heart,
  },
  {
    title: "Business Intelligence",
    description:
      "Strategic intelligence gathering and analysis to identify threats and opportunities globally.",
    capabilities: [
      "Geopolitical risk assessment",
      "Due diligence investigations",
      "Competitive intelligence",
      "Crisis forecasting",
    ],
    icon: Search,
  },
];

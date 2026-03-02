/**
 * Journey Data for Scroll-Journey Experience
 *
 * Centralized content for the horizontal tiles and vertical timeline sections.
 * Extracted from existing home page sections.
 */

import {
  ShieldCheck,
  Search,
  Lock,
  Eye,
  UserCheck,
  Target,
  Globe,
  Radio,
  Database,
} from "lucide-react";

// ============================================================================
// HORIZONTAL TILES CONTENT (6 Solutions)
// ============================================================================

export interface JourneyTile {
  number: string;
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}

export const journeyTiles: JourneyTile[] = [
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

// ============================================================================
// VERTICAL TIMELINE CONTENT (5 Stops)
// ============================================================================

export interface TimelineStop {
  id: string;
  label: string;
  title: string;
  description: string;
  icon?: typeof Globe;
  quote?: string;
  cards?: Array<{
    icon: typeof Globe;
    title: string;
    description: string;
  }>;
  differentiators?: Array<{
    symbol: string;
    title: string;
    description: string;
  }>;
}

export const timelineStops: TimelineStop[] = [
  {
    id: "problem",
    label: "The Challenge",
    title: "Navigating Complex Realities",
    description:
      "The threats facing ultra-high-net-worth families are no longer isolated. They are converging, accelerating, and increasingly sophisticated.",
    quote: "Blind spots become fault lines where preventable crises take shape.",
    cards: [
      {
        icon: Globe,
        title: "Cross-Border Vulnerabilities",
        description:
          "Global operations spanning multiple jurisdictions create overlapping exposures that no single advisor can see.",
      },
      {
        icon: Eye,
        title: "Coordinated Threats",
        description:
          "Public visibility and digital footprints attract sophisticated, multi-vector attacks targeting family and enterprise.",
      },
      {
        icon: Database,
        title: "Fragmented Intelligence",
        description:
          "Critical data siloed across legal, financial, and security teams leaves dangerous gaps in your defense posture.",
      },
      {
        icon: Radio,
        title: "Outpaced Response",
        description:
          "Threat velocity now exceeds the speed at which traditional advisory teams communicate and coordinate.",
      },
    ],
  },
  {
    id: "blind-spots",
    label: "The Blind Spot",
    title: "Every Advisor Holds a Vital Piece — in Isolation",
    description:
      "Your wealth advisor sees the portfolio. Your attorney sees the trust structure. Your security team sees the threat landscape. None of them see each other's blind spots.",
    quote: "Integration isn't a luxury. It's the only architecture that works.",
  },
  {
    id: "amg-approach",
    label: "The AMG Approach",
    title: "What Sets AMG Apart",
    description:
      "Special Operations Discipline. Advisory Excellence. We replace fragmented advisory with a single, integrated command structure.",
    differentiators: [
      {
        symbol: "⊕",
        title: "SINGLE TRUSTED RELATIONSHIP",
        description:
          "One dedicated partner who understands your full picture — coordinating every specialist, every domain, every timeline.",
      },
      {
        symbol: "◎",
        title: "COLLABORATION-FIRST MODEL",
        description:
          "We work alongside your existing advisors, attorneys, and family office teams — enhancing, not replacing.",
      },
      {
        symbol: "⬢",
        title: "INTELLIGENCE-LED ARCHITECTURE",
        description:
          "Every recommendation is grounded in real-time intelligence, not assumptions. Data-driven protection for a data-driven world.",
      },
      {
        symbol: "◈",
        title: "STRICT CONFIDENTIALITY",
        description:
          "We serve clients who cannot afford exposure. Discretion is engineered into every process, communication, and engagement.",
      },
    ],
  },
  {
    id: "integrated-solutions",
    label: "The Solution",
    title: "One Operating System. Five Domains.",
    description:
      "AMG replaces fragmented advisory with a single, integrated command structure. Five specialized domains — unified under one strategic layer — so nothing falls between the cracks.",
    quote: "We don't just advise. We architect, coordinate, and deliver — functioning as your family's dedicated resilience partner.",
  },
  {
    id: "outcomes",
    label: "The Outcome",
    title: "Peace of Mind Through Proactive Protection",
    description:
      "Where others see complexity, we build clarity. Our clients enjoy the confidence that comes from knowing every aspect of their protection is coordinated, considered, and proactive.",
    differentiators: [
      {
        symbol: "✦",
        title: "TOTAL VISIBILITY",
        description:
          "See your entire risk landscape in one place — connected, contextualized, and continuously updated.",
      },
      {
        symbol: "⚡",
        title: "RAPID RESPONSE",
        description:
          "When seconds matter, having a unified command structure means immediate, coordinated action across all domains.",
      },
      {
        symbol: "◉",
        title: "PROACTIVE RESILIENCE",
        description:
          "We identify and mitigate threats before they materialize — turning reactive defense into proactive protection.",
      },
    ],
  },
];

// ============================================================================
// HERO CONTENT
// ============================================================================

export const heroContent = {
  eyebrow: "ANCHOR MILL GROUP",
  title: "Integrated Resilience",
  subtitle: "for a Complex World",
  description:
    "Comprehensive asset protection and risk management for UHNW families, family offices, and global executives.",
};

// ============================================================================
// CTA CONTENT
// ============================================================================

export const ctaContent = {
  title: "Ready to Secure Your Future?",
  description:
    "Schedule a confidential consultation to learn how AMG can integrate your protection strategy.",
  buttonText: "Schedule a Conversation",
  buttonLink: "/contact",
};


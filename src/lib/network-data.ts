export interface NetworkNode {
  id: string;
  name: string;
  group: "hub" | "domain" | "partner";
  val: number;
  color: string;
  description?: string;
  href?: string;
  fx?: number;
  fy?: number;
  fz?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkGraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  centerNodeId: string;
}

// AMG brand colors
const COLORS = {
  hub: "#d4c9a8",
  domain: "#b8ad88",
  partner: "#8a8578",
} as const;

// Pre-compute radial positions so nodes start in a hub-spoke shape
// instead of all at origin (which collapses into a line)
const INNER_RADIUS = 60;
const OUTER_RADIUS = 120;

function ringPosition(index: number, total: number, radius: number) {
  const angle = (2 * Math.PI * index) / total;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: Math.sin(index * 2654435761) * 10, // deterministic z-jitter (avoids SSR/client hydration mismatch)
  };
}

const domainPositions = Array.from({ length: 5 }, (_, i) =>
  ringPosition(i, 5, INNER_RADIUS),
);
const partnerPositions = Array.from({ length: 6 }, (_, i) =>
  ringPosition(i, 6, OUTER_RADIUS),
);

// Default partner ecosystem data
export const partnerNetworkData: NetworkGraphData = {
  centerNodeId: "amg",
  nodes: [
    // Hub — pinned at origin
    {
      id: "amg",
      name: "Anchor Mill Group",
      group: "hub",
      val: 25,
      color: COLORS.hub,
      description:
        "Central command node. Global asset protection and risk management for UHNW families, family offices, and global executives.",
      fx: 0,
      fy: 0,
      fz: 0,
    },

    // Domains (inner ring)
    {
      id: "d-intel",
      name: "Intelligence & Assessment",
      group: "domain",
      val: 8,
      color: COLORS.domain,
      description:
        "Strategic intelligence gathering and analysis to identify threats, opportunities, and risks across global operations.",
      href: "/strategies",
      ...domainPositions[0],
    },
    {
      id: "d-neuro",
      name: "Neurobiology & Performance",
      group: "domain",
      val: 8,
      color: COLORS.domain,
      description:
        "Optimizing cognitive performance, stress resilience, and decision-making under pressure using elite military and intelligence methodologies.",
      href: "/strategies",
      ...domainPositions[1],
    },
    {
      id: "d-cyber",
      name: "Cyber & Digital Security",
      group: "domain",
      val: 8,
      color: COLORS.domain,
      description:
        "Comprehensive digital and physical security architecture protecting family members, assets, and reputation across all environments.",
      href: "/strategies",
      ...domainPositions[2],
    },
    {
      id: "d-leadership",
      name: "Leadership Development",
      group: "domain",
      val: 8,
      color: COLORS.domain,
      description:
        "Building next-generation leadership capacity and succession readiness across family enterprise and governance structures.",
      href: "/strategies",
      ...domainPositions[3],
    },
    {
      id: "d-medicine",
      name: "Integrative Medicine",
      group: "domain",
      val: 8,
      color: COLORS.domain,
      description:
        "Personalized health optimization combining conventional and integrative approaches for sustained peak performance and longevity.",
      href: "/strategies",
      ...domainPositions[4],
    },

    // Partners (outer ring)
    {
      id: "p-mcmanus",
      name: "Dr. Barry McManus",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "Former Senior Intelligence Officer. Leads intelligence and assessment operations with decades of field experience.",
      href: "/#partners",
      ...partnerPositions[0],
    },
    {
      id: "p-morgan",
      name: "Dr. Charles Morgan III",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "Yale School of Medicine, Former CIA. Neurobiology and human performance specialist for high-stakes decision-making.",
      href: "/#partners",
      ...partnerPositions[1],
    },
    {
      id: "p-lavalle",
      name: "Dr. James LaValle",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "Clinical Pharmacist, Metabolic Medicine. Integrative health optimization for sustained cognitive and physical resilience.",
      href: "/#partners",
      ...partnerPositions[2],
    },
    {
      id: "p-krupa",
      name: "Ryan Krupa",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "Fortune 100 Executive Coach. Strategic leadership development and succession readiness for family enterprises.",
      href: "/#partners",
      ...partnerPositions[3],
    },
    {
      id: "p-labs",
      name: "AMG Labs",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "NSA/Government-level threat operations. Advanced cyber defense and digital security infrastructure.",
      href: "/#partners",
      ...partnerPositions[4],
    },
    {
      id: "p-holzschuh",
      name: "Scot Holzschuh",
      group: "partner",
      val: 3,
      color: COLORS.partner,
      description:
        "USMC Veteran, Executive Protection. Protective operations and physical security for principals and key family members.",
      href: "/#partners",
      ...partnerPositions[5],
    },
  ],
  links: [
    // Hub → Domains
    { source: "amg", target: "d-intel" },
    { source: "amg", target: "d-neuro" },
    { source: "amg", target: "d-cyber" },
    { source: "amg", target: "d-leadership" },
    { source: "amg", target: "d-medicine" },

    // Domains → Partners
    { source: "d-intel", target: "p-mcmanus" },
    { source: "d-neuro", target: "p-morgan" },
    { source: "d-medicine", target: "p-lavalle" },
    { source: "d-leadership", target: "p-krupa" },
    { source: "d-cyber", target: "p-labs" },
    { source: "d-intel", target: "p-holzschuh" },

    // Cross-domain connections (partners who span multiple domains)
    { source: "d-neuro", target: "p-mcmanus" },
    { source: "d-cyber", target: "p-holzschuh" },
  ],
};

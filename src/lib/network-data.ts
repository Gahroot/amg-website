export interface NetworkNode {
  id: string;
  name: string;
  group: "hub" | "domain";
  val: number;
  color: string;
  description?: string;
  href?: string;
  iconSvg?: string;
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
} as const;

// Pre-compute radial positions so nodes start in a hub-spoke shape
// instead of all at origin (which collapses into a line)
const INNER_RADIUS = 60;

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

  ],
  links: [
    // Hub → Domains
    { source: "amg", target: "d-intel" },
    { source: "amg", target: "d-neuro" },
    { source: "amg", target: "d-cyber" },
    { source: "amg", target: "d-leadership" },
    { source: "amg", target: "d-medicine" },

  ],
};

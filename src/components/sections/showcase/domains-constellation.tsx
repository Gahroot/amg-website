"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { DomainsMobileSpine } from "./domains-mobile-spine";
import { domains } from "@/lib/domains-data";
import type { NetworkNode, NetworkLink } from "@/lib/network-data";
import type { ConstellationGraphAPI } from "./constellation-graph";

const ConstellationGraph = dynamic(
  () =>
    import("./constellation-graph").then((m) => m.ConstellationGraph),
  { ssr: false, loading: () => <SectionSkeleton /> },
);

// Build minimal graph data for the 3D layer
const RING_RADIUS = 100;

function ringPosition(index: number, total: number, radius: number) {
  const angle = (2 * Math.PI * index) / total;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: Math.sin(index * 2654435761) * 10,
  };
}

const DOMAIN_IDS = [
  "d-neuro",
  "d-cyber",
  "d-leadership",
  "d-medicine",
  "d-intel",
];


export function DomainsConstellation() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const graphApiRef = useRef<ConstellationGraphAPI | null>(null);
  const rafRef = useRef<number>(0);

  // DOM refs for position tracking
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Graph data for the 3D layer
  const { nodes, links } = useMemo(() => {
    const hubNode: NetworkNode = {
      id: "amg",
      name: "Anchor Mill Group",
      group: "hub",
      val: 10,
      color: "#8b7d5e",
      fx: 0,
      fy: 0,
      fz: 0,
    };

    const domainNodes: NetworkNode[] = domains.map((domain, i) => {
      const pos = ringPosition(i, domains.length, RING_RADIUS);
      return {
        id: DOMAIN_IDS[i],
        name: domain.title,
        group: "domain" as const,
        val: 4,
        color: "#a89b7e",
        description: domain.description,
        ...pos,
      };
    });

    const domainLinks: NetworkLink[] = DOMAIN_IDS.map((id) => ({
      source: "amg",
      target: id,
    }));

    return {
      nodes: [hubNode, ...domainNodes],
      links: domainLinks,
    };
  }, []);

  // Compute highlight node ID for the 3D layer
  const highlightNodeId = useMemo(() => {
    if (hoverIndex !== null) return DOMAIN_IDS[hoverIndex];
    if (selectedIndex !== null) return DOMAIN_IDS[selectedIndex];
    return null;
  }, [hoverIndex, selectedIndex]);

  // RAF loop: continuously update DOM overlay positions from 3D node coords
  useEffect(() => {
    function updatePositions() {
      const api = graphApiRef.current;
      if (api) {
        // Hub position
        const hubPos = api.getNodeScreenPosition("amg");
        if (hubPos && hubRef.current) {
          hubRef.current.style.left = `${hubPos.x}px`;
          hubRef.current.style.top = `${hubPos.y}px`;
        }

        // Domain card positions
        for (let i = 0; i < DOMAIN_IDS.length; i++) {
          const pos = api.getNodeScreenPosition(DOMAIN_IDS[i]);
          const el = cardRefs.current.get(i);
          if (pos && el) {
            el.style.left = `${pos.x}px`;
            el.style.top = `${pos.y}px`;
          }
        }
      }

      rafRef.current = requestAnimationFrame(updatePositions);
    }

    rafRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleGraphReady = useCallback((api: ConstellationGraphAPI) => {
    graphApiRef.current = api;
  }, []);

  const handleCardClick = useCallback(
    (index: number) => {
      const api = graphApiRef.current;
      if (!api) return;

      if (selectedIndex === index) {
        // Deselect
        setSelectedIndex(null);
        api.resetCamera();
        api.setAutoRotate(true);
      } else {
        setSelectedIndex(index);
        api.zoomToNode(DOMAIN_IDS[index]);
        api.setAutoRotate(false);
      }
    },
    [selectedIndex],
  );

  const handleHubClick = useCallback(() => {
    const api = graphApiRef.current;
    if (!api) return;
    setSelectedIndex(null);
    api.resetCamera();
    api.setAutoRotate(true);
  }, []);

  const handleBackdropClick = useCallback(() => {
    const api = graphApiRef.current;
    if (!api) return;
    setSelectedIndex(null);
    api.resetCamera();
    api.setAutoRotate(true);
  }, []);

  // Escape key to dismiss
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBackdropClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleBackdropClick]);

  const isExpanded = selectedIndex !== null;

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-primary">
          Strategic Domains
        </p>
        <h2 className="mb-16 font-serif text-3xl tracking-tight md:text-4xl lg:mb-20 lg:text-5xl">
          Five disciplines, one integrated framework
        </h2>

        {/* Desktop: 3D constellation + DOM overlays */}
        <div className="relative hidden md:block" style={{ height: 640 }}>
          {/* 3D graph layer */}
          <ConstellationGraph
            nodes={nodes}
            links={links}
            centerNodeId="amg"
            height={640}
            highlightNodeId={highlightNodeId}
            onReady={handleGraphReady}
          />

          {/* DOM overlay layer */}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
            {/* Dismiss backdrop */}
            {isExpanded && (
              <div
                className="pointer-events-auto absolute inset-0"
                onClick={handleBackdropClick}
              />
            )}

            {/* Hub logo mark */}
            <div
              ref={hubRef}
              className="pointer-events-auto absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-3"
              onClick={handleHubClick}
              style={{ left: "50%", top: "50%" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Anchor-mill-group-logo.webp"
                alt="Anchor Mill Group"
                className="w-[80px] brightness-0 dark:brightness-100 dark:invert-0"
                style={{ opacity: 0.7 }}
              />
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-primary/50">
                Anchor Mill Group
              </span>
            </div>

            {/* Domain cards */}
            {domains.map((domain, i) => {
              const isSelected = selectedIndex === i;
              const isDimmed = isExpanded && !isSelected;
              const isHovered = hoverIndex === i;
              const Icon = domain.icon;

              return (
                <div
                  key={domain.title}
                  ref={(el) => {
                    if (el) cardRefs.current.set(i, el);
                    else cardRefs.current.delete(i);
                  }}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: "50%", top: "50%", zIndex: isSelected ? 30 : 20 }}
                >
                  <motion.div
                    className="cursor-pointer"
                    animate={{
                      opacity: isDimmed ? 0.25 : 1,
                      scale: isDimmed ? 0.9 : isHovered ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(i);
                    }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <motion.div
                      className="rounded-lg border border-primary/20 bg-card/90 shadow-sm backdrop-blur-sm"
                      layout
                      transition={{
                        layout: {
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1],
                        },
                      }}
                      style={{
                        boxShadow: isSelected
                          ? "0 8px 32px rgba(139, 125, 94, 0.15)"
                          : isHovered
                            ? "0 4px 16px rgba(139, 125, 94, 0.1)"
                            : "0 2px 8px rgba(139, 125, 94, 0.06)",
                        minWidth: isSelected ? 280 : 180,
                      }}
                    >
                      <div className="flex items-center gap-2.5 px-4 py-3">
                        <Icon
                          className="h-4 w-4 shrink-0 text-primary"
                          strokeWidth={1.5}
                        />
                        <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {domain.title}
                        </span>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: {
                                duration: 0.35,
                                ease: [0.25, 0.1, 0.25, 1],
                              },
                              opacity: { duration: 0.25, delay: 0.1 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-primary/10 px-4 pb-4 pt-3">
                              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                                {domain.description}
                              </p>
                              <Link
                                href="/strategies"
                                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary transition-colors hover:text-primary/70"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Learn more
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: spine layout */}
        <DomainsMobileSpine domains={domains} />
      </div>
    </section>
  );
}

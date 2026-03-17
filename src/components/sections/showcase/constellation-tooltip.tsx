"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NetworkNode } from "@/lib/network-data";

interface ConstellationTooltipProps {
  node: NetworkNode | null;
  screenPosition: { x: number; y: number } | null;
  containerRect: DOMRect | null;
  onDismiss: () => void;
}

export function ConstellationTooltip({
  node,
  screenPosition,
  containerRect,
  onDismiss,
}: ConstellationTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Dismiss on Escape
  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [node, onDismiss]);

  if (!screenPosition || !containerRect) return null;

  // Place tooltip adjacent to the node, extending OUTWARD from the graph
  // center. This keeps it connected to the node while pushing into empty space.
  const tooltipWidth = 320;
  const tooltipHeight = 180;
  const padding = 16;
  const gap = 24;

  // Direction from container center to node — tooltip extends outward
  const cx = containerRect.width / 2;
  const nodeOnRight = screenPosition.x >= cx;

  let left: number;
  if (nodeOnRight) {
    left = screenPosition.x + gap;
  } else {
    left = screenPosition.x - tooltipWidth - gap;
  }

  // Clamp to container bounds
  left = Math.max(
    padding,
    Math.min(left, containerRect.width - tooltipWidth - padding),
  );

  // Vertically: align near the node's Y, clamped
  let top = screenPosition.y - tooltipHeight / 2;
  top = Math.max(
    padding,
    Math.min(top, containerRect.height - tooltipHeight - padding),
  );

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop to catch dismiss clicks */}
          <div
            className="absolute inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
          />

          {/* Tooltip card */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-20 w-80 max-w-[calc(100vw-2rem)] rounded-sm border border-border/50 bg-card p-5 shadow-lg"
            style={{ left, top }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
              {node.name}
            </p>

            {/* Description */}
            {node.description && (
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                {node.description}
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

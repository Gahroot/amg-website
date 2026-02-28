"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NetworkNode } from "@/lib/network-data";

interface TerminalTooltipProps {
  node: NetworkNode | null;
  screenPosition: { x: number; y: number } | null;
  containerRect: DOMRect | null;
  onDismiss: () => void;
  onNavigate: (href: string) => void;
}

export function TerminalTooltip({
  node,
  screenPosition,
  containerRect,
  onDismiss,
  onNavigate,
}: TerminalTooltipProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!node?.description) {
      setDisplayedText("");
      setTypingDone(false);
      return;
    }

    const text = node.description;

    if (prefersReducedMotion.current) {
      setDisplayedText(text);
      setTypingDone(true);
      return;
    }

    setDisplayedText("");
    setTypingDone(false);
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [node]);

  // Dismiss on Escape
  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [node, onDismiss]);

  const handleNavigate = useCallback(() => {
    if (node?.href) onNavigate(node.href);
  }, [node, onNavigate]);

  if (!screenPosition || !containerRect) return null;

  // Place tooltip adjacent to the node, extending OUTWARD from the graph
  // center. This keeps it connected to the node while pushing into empty space.
  const tooltipWidth = 320;
  const tooltipHeight = 220;
  const padding = 16;
  const gap = 24;

  // Direction from container center to node — tooltip extends outward
  const cx = containerRect.width / 2;
  const nodeOnRight = screenPosition.x >= cx;

  let left: number;
  if (nodeOnRight) {
    // Node is right of center → tooltip extends right from node
    left = screenPosition.x + gap;
  } else {
    // Node is left of center → tooltip extends left from node
    left = screenPosition.x - tooltipWidth - gap;
  }

  // Clamp to container bounds
  left = Math.max(padding, Math.min(left, containerRect.width - tooltipWidth - padding));

  // Vertically: align near the node's Y, clamped
  let top = screenPosition.y - tooltipHeight / 2;
  top = Math.max(padding, Math.min(top, containerRect.height - tooltipHeight - padding));

  const linkLabel =
    node?.group === "partner" ? "VIEW PROFILE >>" : "ACCESS DOMAIN >>";

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

          {/* Tooltip panel */}
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-20 w-80 max-w-[calc(100vw-2rem)] border border-primary/20 bg-background/95 backdrop-blur-sm"
            style={{ left, top }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,201,168,0.4) 2px, rgba(212,201,168,0.4) 3px)",
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/10 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
                {"// MISSION OBJECTIVE"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="font-mono text-xs text-primary/40 transition-colors hover:text-primary"
              >
                [&times;]
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 px-4 py-3">
              {/* Node name */}
              <p className="font-mono text-sm font-bold uppercase tracking-wide text-primary">
                &gt; {node.name}
              </p>

              {/* Description with typewriter */}
              <div className="min-h-[3.5rem]">
                <p className="font-mono text-xs leading-relaxed text-foreground/70">
                  {displayedText}
                  {!typingDone && (
                    <span
                      className="inline-block text-primary"
                      style={{ animation: "terminal-blink 0.8s step-end infinite" }}
                    >
                      |
                    </span>
                  )}
                </p>
              </div>

              {/* Navigation link — appears after typing completes */}
              {typingDone && node.href && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleNavigate}
                  className="font-mono text-[11px] uppercase tracking-widest text-primary transition-colors hover:text-accent"
                >
                  {linkLabel}
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

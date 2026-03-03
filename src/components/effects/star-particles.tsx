"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-can-pin";

interface StarParticlesProps {
  className?: string;
  starCount?: number;
  fixed?: boolean;
}

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleDuration: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  color: string;
  delay: number;
}

const STAR_COLORS = [
  "#d4c9a8",
  "#d4c9a8",
  "#d4c9a8",
  "#d4c9a8",
  "#d4c9a8",
  "#f0ece4", // warm white (rare)
];

function generateStars(count: number): StarData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    baseOpacity: 0.15 + Math.random() * 0.55,
    twinkleDuration: 2 + Math.random() * 3,
    driftX: (Math.random() - 0.5) * 20,
    driftY: (Math.random() - 0.5) * 20,
    driftDuration: 10 + Math.random() * 15,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    delay: Math.random() * 3,
  }));
}

export function StarParticles({
  className,
  starCount = 80,
  fixed = false,
}: StarParticlesProps) {
  const stars = useMemo(() => generateStars(starCount), [starCount]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "100px" });

  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        fixed ? "fixed inset-0 z-0" : "absolute inset-0",
        "pointer-events-none overflow-hidden",
        className,
      )}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
          }}
          initial={{ opacity: star.baseOpacity * 0.3, scale: 0.85 }}
          animate={
            reducedMotion || !isInView
              ? { opacity: star.baseOpacity }
              : {
                  opacity: [
                    star.baseOpacity * 0.3,
                    star.baseOpacity,
                    star.baseOpacity * 0.3,
                  ],
                  scale: [0.85, 1.15, 0.85],
                  x: [0, star.driftX, 0],
                  y: [0, star.driftY, 0],
                }
          }
          transition={
            reducedMotion || !isInView
              ? undefined
              : {
                  opacity: {
                    duration: star.twinkleDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay,
                  },
                  scale: {
                    duration: star.twinkleDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay,
                  },
                  x: {
                    duration: star.driftDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay,
                  },
                  y: {
                    duration: star.driftDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: star.delay,
                  },
                }
          }
        />
      ))}
    </div>
  );
}

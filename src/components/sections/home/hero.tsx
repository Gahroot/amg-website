"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/effects/spotlight";

const metrics = [
  { value: "87%", label: "Vulnerability Reduction" },
  { value: "$3.2M", label: "Avg Loss Avoidance" },
  { value: "72hrs → 4hrs", label: "Response Time" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax speeds — each layer moves at a different rate
  const labelY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const metricsY = useTransform(scrollYProgress, [0, 1], [0, -230]);

  // All fade out by scroll progress 0.3
  const fadeOut = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      <Spotlight />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.0 }}
            style={{ y: labelY, opacity: fadeOut }}
            className="font-mono text-xs uppercase tracking-widest text-primary mb-6"
          >
            Asset Protection & Risk Management
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ y: headingY, opacity: fadeOut }}
            className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground mb-6"
          >
            Integrated Resilience, Protection, and Performance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ y: subtitleY, opacity: fadeOut }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Comprehensive protection for a complex world. Tailored solutions for
            family offices, ultra-high-net-worth individuals and families, and
            executive leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ y: ctaY, opacity: fadeOut }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Button size="lg" asChild>
              <a href="#who-we-are">
                Discover Our Approach
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                Schedule a Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ y: metricsY, opacity: fadeOut }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {metrics.map((metric, i) => (
              <div key={metric.label} className="flex items-center gap-8">
                {i > 0 && (
                  <div className="hidden sm:block h-10 w-px bg-border" />
                )}
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-primary">
                    {metric.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

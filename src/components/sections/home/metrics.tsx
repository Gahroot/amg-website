"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";

const metrics = [
  { value: 87, suffix: "%", label: "Average reduction in critical vulnerabilities" },
  { value: 94, suffix: "%", label: "Improvement in incident response time" },
  { value: 31, suffix: "%", label: "Average reduction in total security spend" },
  { value: 3.2, suffix: "M", label: "Average loss avoidance per client", prefix: "$" },
  { value: 68, suffix: "%", label: "Improvement in decision quality under pressure" },
  { value: 89, suffix: "%", label: "Client confidence improvement" },
  { value: 73, suffix: "%", label: "Reduction in governance disputes" },
  { value: 84, suffix: "%", label: "Next-gen meet succession milestones" },
];

function MetricCard({
  value,
  suffix,
  label,
  prefix,
}: {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  const formatted = Number.isInteger(value)
    ? Math.round(displayValue).toString()
    : displayValue.toFixed(1);

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-lg bg-secondary/50 border border-border"
    >
      <div className="font-mono text-4xl font-bold tabular-nums text-primary mb-2">
        {prefix}
        {isInView ? formatted : "0"}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Metrics() {
  return (
    <section id="metrics" className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          BY THE NUMBERS
        </p>
        <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
          MEASURED IMPACT
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Quantified outcomes across our client portfolio demonstrate the
          compound value of integrated protection.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useCanPin, useReducedMotion } from "@/lib/use-can-pin";

/* ------------------------------------------------------------------ */
/*  Data types & constants                                             */
/* ------------------------------------------------------------------ */

interface TransformMetric {
  kind: "transform";
  from: number;
  to: number;
  suffix: string;
  label: string;
}

interface StaticMetric {
  kind: "static";
  value: string;
  label: string;
}

interface Category {
  name: string;
  slot1: TransformMetric | StaticMetric;
  slot2: TransformMetric | StaticMetric;
}

const categories: Category[] = [
  {
    name: "Risk Reduction",
    slot1: {
      kind: "transform",
      from: 72,
      to: 4,
      suffix: " hrs",
      label: "Crisis Response Time",
    },
    slot2: {
      kind: "transform",
      from: 34,
      to: 87,
      suffix: " /100",
      label: "Security Posture Score",
    },
  },
  {
    name: "Economic Efficiency",
    slot1: { kind: "static", value: "$3.2M", label: "Avg Loss Avoidance" },
    slot2: {
      kind: "static",
      value: "31%",
      label: "Security Spend Reduction",
    },
  },
  {
    name: "Leadership Performance",
    slot1: {
      kind: "static",
      value: "68%",
      label: "Decision Quality Under Pressure",
    },
    slot2: {
      kind: "transform",
      from: 8.5,
      to: 3.0,
      suffix: " /10",
      label: "Executive Stress Level",
    },
  },
  {
    name: "Family & Governance",
    slot1: {
      kind: "static",
      value: "73%",
      label: "Governance Dispute Reduction",
    },
    slot2: {
      kind: "transform",
      from: 3,
      to: 9,
      suffix: " /10",
      label: "Succession Confidence",
    },
  },
];

const scatterOffsets = [
  { x: -18, y: -12, rotate: -0.8 }, // Crisis Response
  { x: 22, y: 8, rotate: 0.6 }, // Security Posture
  { x: -20, y: -6, rotate: -0.7 }, // Executive Stress
  { x: 14, y: 16, rotate: 0.5 }, // Succession Confidence
];

function formatTransform(m: TransformMetric, value: number): string {
  const isInteger = Number.isInteger(m.from) && Number.isInteger(m.to);
  const num = isInteger ? Math.round(value).toString() : value.toFixed(1);
  return `${num}${m.suffix}`;
}


/* ------------------------------------------------------------------ */
/*  Collect all transform metrics with their indices                   */
/* ------------------------------------------------------------------ */

interface TransformEntry {
  metric: TransformMetric;
  catIndex: number;
  slotIndex: number;
  scatterIndex: number;
}

const transformEntries: TransformEntry[] = [];
{
  let scatterIdx = 0;
  categories.forEach((cat, ci) => {
    [cat.slot1, cat.slot2].forEach((slot, si) => {
      if (slot.kind === "transform") {
        transformEntries.push({
          metric: slot,
          catIndex: ci,
          slotIndex: si,
          scatterIndex: scatterIdx,
        });
        scatterIdx++;
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Metrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const beforeTitleRef = useRef<HTMLHeadingElement>(null);
  const afterTitleRef = useRef<HTMLHeadingElement>(null);

  // Refs for transform metric number elements (keyed by "catIndex-slotIndex")
  const transformNumberRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  // Refs for transform metric card wrappers
  const transformCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // Refs for static metric wrappers
  const staticCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // Refs for category labels and dividers
  const categoryLabelRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const categoryDividerRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const canAnimate = useCanPin();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      initGSAP();

      const section = sectionRef.current;
      if (!section) return;

      if (canAnimate) {
        /* ── Desktop: auto-playing animation (no scroll pin) ── */
        const beforeTitle = beforeTitleRef.current;
        const afterTitle = afterTitleRef.current;
        if (!beforeTitle || !afterTitle) return;

        const styles = getComputedStyle(section);
        const mutedColor = styles.getPropertyValue("--muted-foreground").trim();
        const fgColor = styles.getPropertyValue("--foreground").trim();

        const transformCards: { el: HTMLDivElement; numEl: HTMLSpanElement; entry: TransformEntry }[] = [];
        for (const entry of transformEntries) {
          const key = `${entry.catIndex}-${entry.slotIndex}`;
          const cardEl = transformCardRefs.current.get(key);
          const numEl = transformNumberRefs.current.get(key);
          if (cardEl && numEl) {
            transformCards.push({ el: cardEl, numEl, entry });
          }
        }

        const staticCards: HTMLDivElement[] = [];
        categories.forEach((cat, ci) => {
          [cat.slot1, cat.slot2].forEach((slot, si) => {
            if (slot.kind === "static") {
              const el = staticCardRefs.current.get(`${ci}-${si}`);
              if (el) staticCards.push(el);
            }
          });
        });

        const categoryLabels: HTMLSpanElement[] = [];
        const categoryDividers: HTMLDivElement[] = [];
        categories.forEach((_, ci) => {
          const label = categoryLabelRefs.current.get(ci);
          const divider = categoryDividerRefs.current.get(ci);
          if (label) categoryLabels.push(label);
          if (divider) categoryDividers.push(divider);
        });

        gsap.set(beforeTitle, { autoAlpha: 1 });
        gsap.set(afterTitle, { autoAlpha: 0 });

        transformCards.forEach(({ el, numEl, entry }) => {
          const offset = scatterOffsets[entry.scatterIndex];
          gsap.set(el, { x: offset.x, y: offset.y, rotate: offset.rotate });
          gsap.set(numEl, { color: mutedColor });
        });

        gsap.set(staticCards, { autoAlpha: 0, y: 16 });
        gsap.set(categoryLabels, { autoAlpha: 0 });
        gsap.set(categoryDividers, { autoAlpha: 0 });

        // Scroll-triggered timeline (no pin — plays when section enters view)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });

        transformCards.forEach(({ numEl, entry }) => {
          const proxy = { val: entry.metric.from };
          tl.to(
            proxy,
            {
              val: entry.metric.to,
              duration: 2,
              ease: "power2.inOut",
              onUpdate() {
                numEl.textContent = formatTransform(entry.metric, proxy.val);
              },
            },
            0,
          );
        });

        transformCards.forEach(({ el }) => {
          tl.to(
            el,
            { x: 0, y: 0, rotate: 0, duration: 2, ease: "power2.inOut" },
            0,
          );
        });

        transformCards.forEach(({ numEl }) => {
          tl.to(
            numEl,
            { color: fgColor, duration: 2, ease: "power2.inOut" },
            0,
          );
        });

        tl.to(beforeTitle, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 0.8);
        tl.to(afterTitle, { autoAlpha: 1, duration: 0.5, ease: "power2.inOut" }, 1.0);

        tl.to(categoryLabels, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 1.4);
        tl.to(categoryDividers, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 1.4);

        tl.to(
          staticCards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          },
          2.0,
        );

        return () => {
          tl.kill();
        };
      }

      /* ── Mobile: GSAP number morphing (auto-play, no scroll) ── */
      if (reducedMotion) return;

      for (const entry of transformEntries) {
        const key = `${entry.catIndex}-${entry.slotIndex}`;
        const numEl = transformNumberRefs.current.get(key);
        if (!numEl) continue;

        const proxy = { val: entry.metric.from };
        gsap.to(proxy, {
          val: entry.metric.to,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate() {
            numEl.textContent = formatTransform(entry.metric, proxy.val);
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [canAnimate, reducedMotion] },
  );

  /* ---------------------------------------------------------------- */
  /*  Render helpers                                                    */
  /* ---------------------------------------------------------------- */

  function renderMetric(
    slot: TransformMetric | StaticMetric,
    catIndex: number,
    slotIndex: number,
  ) {
    const key = `${catIndex}-${slotIndex}`;
    const mobileAnimated = !canAnimate && !reducedMotion;

    if (slot.kind === "transform") {
      // Show `from` value when animated (desktop or mobile GSAP morph), `to` when static
      const showFrom = canAnimate || mobileAnimated;
      return (
        <div
          key={key}
          ref={(el) => {
            if (el) transformCardRefs.current.set(key, el);
          }}
        >
          <span
            ref={(el) => {
              if (el) transformNumberRefs.current.set(key, el);
            }}
            className="block font-serif text-4xl md:text-5xl tabular-nums"
            style={canAnimate ? { color: "var(--muted-foreground)" } : undefined}
          >
            {showFrom
              ? formatTransform(slot, slot.from)
              : formatTransform(slot, slot.to)}
          </span>
          <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {slot.label}
          </span>
        </div>
      );
    }

    // Static metric
    if (canAnimate) {
      return (
        <div
          key={key}
          ref={(el) => {
            if (el) staticCardRefs.current.set(key, el);
          }}
          style={{ opacity: 0 }}
        >
          <span className="block font-serif text-4xl md:text-5xl tabular-nums text-foreground">
            {slot.value}
          </span>
          <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {slot.label}
          </span>
        </div>
      );
    }

    if (mobileAnimated) {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="block font-serif text-4xl md:text-5xl tabular-nums text-foreground">
            {slot.value}
          </span>
          <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
            {slot.label}
          </span>
        </motion.div>
      );
    }

    return (
      <div key={key}>
        <span className="block font-serif text-4xl md:text-5xl tabular-nums text-foreground">
          {slot.value}
        </span>
        <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
          {slot.label}
        </span>
      </div>
    );
  }

  const renderContent = () => (
    <>
      {/* Label */}
      <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
        By the Numbers
      </p>

      {/* Title — crossfade container */}
      <div className="relative mb-16">
        {canAnimate && (
          <h2
            ref={beforeTitleRef}
            aria-hidden="true"
            className="absolute inset-0 font-serif text-3xl md:text-4xl tracking-tight"
          >
            Your Current Fragmented Reality
          </h2>
        )}
        <h2
          ref={afterTitleRef}
          className="font-serif text-3xl md:text-4xl tracking-tight"
          style={canAnimate ? { opacity: 0 } : undefined}
        >
          Your Future with AMG
        </h2>
      </div>

      {/* 4-category grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {categories.map((cat, ci) => {
          const mobileAnimated = !canAnimate && !reducedMotion;

          return (
            <div key={cat.name}>
              {/* Category label */}
              {canAnimate ? (
                <span
                  ref={(el) => {
                    if (el) categoryLabelRefs.current.set(ci, el);
                  }}
                  className="block font-mono text-xs uppercase tracking-widest text-primary mb-3"
                  style={{ opacity: 0 }}
                >
                  {cat.name}
                </span>
              ) : mobileAnimated ? (
                <motion.span
                  className="block font-mono text-xs uppercase tracking-widest text-primary mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {cat.name}
                </motion.span>
              ) : (
                <span className="block font-mono text-xs uppercase tracking-widest text-primary mb-3">
                  {cat.name}
                </span>
              )}

              {/* Divider */}
              {canAnimate ? (
                <div
                  ref={(el) => {
                    if (el) categoryDividerRefs.current.set(ci, el);
                  }}
                  className="h-px bg-border mb-6"
                  style={{ opacity: 0 }}
                />
              ) : mobileAnimated ? (
                <motion.div
                  className="h-px bg-border mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              ) : (
                <div className="h-px bg-border mb-6" />
              )}

              {/* 2-col sub-grid for the two metrics */}
              <div className="grid grid-cols-2 gap-x-8">
                {renderMetric(cat.slot1, ci, 0)}
                {renderMetric(cat.slot2, ci, 1)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <section ref={sectionRef} id="metrics" className="-mt-16 lg:-mt-24">
      {canAnimate ? (
        <div
          ref={pinContainerRef}
          className="pb-24 lg:pb-32"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {renderContent()}
          </div>
        </div>
      )}
    </section>
  );
}

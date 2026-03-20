"use client";

import { useRef, useCallback } from "react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-can-pin";
import type { Domain } from "@/lib/domains-data";

interface DomainsMobileSpineProps {
  domains: Domain[];
}

export function DomainsMobileSpine({ domains }: DomainsMobileSpineProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const setRowRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      rowRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    () => {
      if (reducedMotion) return;
      initGSAP();

      const spine = spineRef.current;
      const wrapper = wrapperRef.current;
      if (!spine || !wrapper) return;

      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(spine, { scaleY: 0, transformOrigin: "top" });
      gsap.set(rows, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 75%",
          once: true,
        },
      });

      tl.to(spine, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0);
      tl.to(
        rows,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.12,
        },
        0.3
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: wrapperRef, dependencies: [reducedMotion] }
  );

  return (
    <div ref={wrapperRef} className="md:hidden">
      <div className="relative pl-12">
        {/* Spine */}
        <div
          ref={spineRef}
          className="absolute left-[7px] top-0 bottom-0 w-px bg-primary/20 origin-top"
        />

        {/* Domain list */}
        <div className="space-y-10">
          {domains.map((domain, i) => (
            <div
              key={domain.title}
              ref={setRowRef(i)}
              className="flex items-start"
            >
              {/* Connector */}
              <div className="flex items-center shrink-0 mt-1.5 -ml-12">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <div className="w-10 h-px bg-primary/20 ml-px" />
              </div>

              {/* Content */}
              <div className="ml-1">
                <h4 className="font-mono text-sm uppercase tracking-widest font-semibold mb-2 text-foreground">
                  {domain.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {domain.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {domain.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="font-mono text-[11px] text-muted-foreground"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

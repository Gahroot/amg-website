"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { gsap, initGSAP } from "@/lib/gsap";

function subscribeToCursorCapability(cb: () => void) {
  const mqlHover = window.matchMedia("(hover: none)");
  const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  mqlHover.addEventListener("change", cb);
  mqlMotion.addEventListener("change", cb);
  return () => {
    mqlHover.removeEventListener("change", cb);
    mqlMotion.removeEventListener("change", cb);
  };
}

function getCursorCapability() {
  const isTouch = window.matchMedia("(hover: none)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return !isTouch && !reducedMotion;
}

function getCursorCapabilityServer() {
  return false;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const visible = useSyncExternalStore(
    subscribeToCursorCapability,
    getCursorCapability,
    getCursorCapabilityServer
  );

  useEffect(() => {
    if (!visible) return;

    initGSAP();

    document.documentElement.classList.add("cursor-none-global");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.01 });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.01 });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onMouseEnterInteractive = () => {
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0.5, duration: 0.3, ease: "power2.out" });
    };

    const onMouseLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const addHoverListeners = () => {
      const elements = document.querySelectorAll(
        "a, button, [data-cursor-hover]"
      );
      elements.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
      return elements;
    };

    window.addEventListener("mousemove", onMouseMove);

    let hoverElements = addHoverListeners();
    const observer = new MutationObserver(() => {
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
      hoverElements = addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.classList.remove("cursor-none-global");
      observer.disconnect();
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.9)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
    </>
  );
}

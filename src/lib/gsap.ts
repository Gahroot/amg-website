/**
 * GSAP Singleton for Next.js SSR Compatibility
 *
 * Handles client-side only initialization of GSAP and its plugins.
 * Import this file to ensure GSAP is only used on the client.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

let initialized = false;

/**
 * Initialize GSAP plugins (client-side only)
 * Call this once in your app or component
 */
export function initGSAP(): void {
  if (!isClient || initialized) return;

  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  initialized = true;
}

// Export GSAP and plugins for direct use
export { gsap, ScrollTrigger, SplitText, useGSAP };

/**
 * Dynamically import GSAP + ScrollTrigger with singleton guard.
 * Use this in journey components for dynamic GSAP loading.
 */
let gsapModule: {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
} | null = null;

export async function loadGSAP() {
  if (gsapModule) return gsapModule;
  const [{ gsap: g }, { ScrollTrigger: ST }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  g.registerPlugin(ST);
  gsapModule = { gsap: g, ScrollTrigger: ST };
  return gsapModule;
}

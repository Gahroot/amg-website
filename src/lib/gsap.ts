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
export const isClient = typeof window !== "undefined";

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

/**
 * Get the GSAP instance with plugins already registered
 * Automatically initializes on first call if not already done
 */
export function getGSAP() {
  if (isClient && !initialized) {
    initGSAP();
  }
  return gsap;
}

// Export GSAP and plugins for direct use
export { gsap, ScrollTrigger, SplitText, useGSAP };

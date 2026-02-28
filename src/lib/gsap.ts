/**
 * GSAP Singleton for Next.js SSR Compatibility
 *
 * Handles client-side only initialization of GSAP and its plugins.
 * Import this file to ensure GSAP is only used on the client.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Check if we're on the client side
export const isClient = typeof window !== "undefined";

let initialized = false;

/**
 * Initialize GSAP plugins (client-side only)
 * Call this once in your app or component
 */
export function initGSAP(): void {
  if (!isClient || initialized) return;

  // Register plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
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

/**
 * Refresh all ScrollTrigger instances
 * Useful after dynamic content changes or hydration
 */
export function refreshScrollTriggers(): void {
  if (!isClient || !initialized) return;
  ScrollTrigger.refresh();
}

/**
 * Kill all ScrollTrigger instances
 * Useful for cleanup before route changes
 */
export function killScrollTriggers(): void {
  if (!isClient || !initialized) return;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/**
 * Create a GSAP context for easy cleanup
 * Returns a context that can be reverted
 */
export function createGSAPContext(
  callback: (context: gsap.Context) => void
): gsap.Context | null {
  if (!isClient) return null;
  return gsap.context(callback);
}

// Export GSAP and plugins for direct use
export { gsap, ScrollTrigger, ScrollToPlugin };

// Default export for convenience
export default getGSAP;

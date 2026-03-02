"use client";

/**
 * ScrollJourney
 *
 * Main orchestrator component for the scroll-journey experience.
 * Combines all journey sections into a cohesive narrative.
 *
 * Sections:
 * 1. Hero - Full viewport with video background and parallax
 * 2. Horizontal Tiles - 6 solutions displayed horizontally
 * 3. Vertical Timeline - 5 stops with animated dot
 * 4. CTA - Final call-to-action
 */

import React from "react";
import { ScrollJourneyProvider } from "./scroll-journey-provider";
import { NavbarAutohide } from "./navbar-autohide";
import { JourneyHero } from "./journey-hero";
import { JourneyHorizontalTiles } from "./journey-horizontal-tiles";
import { JourneyVerticalTimeline } from "./journey-vertical-timeline";
import { JourneyCTA } from "./journey-cta";

interface ScrollJourneyProps {
  /**
   * Video source for hero background (optional)
   */
  videoSrc?: string;
  /**
   * Poster image for video (optional)
   */
  posterSrc?: string;
  /**
   * Custom navbar exit link
   */
  exitLink?: string;
}

function ScrollJourneyContent({
  videoSrc,
  posterSrc,
  exitLink = "/",
}: ScrollJourneyProps) {
  return (
    <div className="scroll-journey light">
      {/* Custom Auto-Hide Navbar */}
      <NavbarAutohide exitLink={exitLink} />

      {/* Hero Section */}
      <JourneyHero videoSrc={videoSrc} posterSrc={posterSrc} />

      {/* Horizontal Tiles Section */}
      <JourneyHorizontalTiles />

      {/* Vertical Timeline Section */}
      <JourneyVerticalTimeline />

      {/* CTA Section */}
      <JourneyCTA />

      {/* Spacer for scroll */}
      <div className="h-32" />
    </div>
  );
}

export function ScrollJourney(props: ScrollJourneyProps) {
  return (
    <ScrollJourneyProvider>
      <ScrollJourneyContent {...props} />
    </ScrollJourneyProvider>
  );
}


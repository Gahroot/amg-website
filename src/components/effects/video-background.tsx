"use client";

/**
 * VideoBackground
 *
 * Optimized video background component with:
 * - Muted autoplay with loop
 * - Poster image fallback
 * - Error handling with gradient overlay
 * - Loading state management
 * - Performance optimization
 */

import React, { useState, useRef, useEffect, CSSProperties } from "react";

interface VideoBackgroundProps {
  /**
   * Path to video file (relative to /public or full URL)
   */
  src: string;
  /**
   * Path to poster image (shown while video loads)
   */
  poster?: string;
  /**
   * CSS class name for styling
   */
  className?: string;
  /**
   * Overlay color (for text readability)
   */
  overlayColor?: string;
  /**
   * Overlay opacity
   */
  overlayOpacity?: number;
}

export function VideoBackground({
  src,
  poster,
  className = "",
  overlayColor = "#000000",
  overlayOpacity = 0.4,
}: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener("loadeddata", handleLoad);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoad);
      video.removeEventListener("error", handleError);
    };
  }, []);

  const containerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    zIndex: 0,
  };

  const videoStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    opacity: isLoaded ? 1 : 0,
    transition: "opacity 0.5s ease",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    zIndex: 1,
  };

  const fallbackStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%)`,
    zIndex: 0,
  };

  const posterStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: poster ? `url(${poster})` : undefined,
    opacity: isLoaded ? 0 : 1,
    transition: "opacity 0.5s ease",
    zIndex: 0,
  };

  return (
    <div className={`video-background ${className}`} style={containerStyle}>
      {/* Fallback gradient */}
      <div style={fallbackStyle} />

      {/* Poster image */}
      {poster && <div style={posterStyle} />}

      {/* Video element */}
      {!hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          style={videoStyle}
          className="will-change-transform"
        />
      )}

      {/* Overlay for text readability */}
      <div style={overlayStyle} />
    </div>
  );
}

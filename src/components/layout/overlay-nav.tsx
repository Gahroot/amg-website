"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, X } from "lucide-react";
import { gsap, useGSAP, initGSAP } from "@/lib/gsap";
import { navLinks } from "@/lib/nav-data";
import { siteConfig } from "@/lib/site-config";

interface OverlayNavProps {
  open: boolean;
  onClose: () => void;
}

export function OverlayNav({ open, onClose }: OverlayNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    initGSAP();
  }, []);

  useGSAP(
    () => {
      if (!overlayRef.current) return;

      const tl = gsap.timeline({ paused: true });

      tl.fromTo(
        overlayRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power3.inOut" }
      );

      tl.fromTo(
        ".overlay-nav-link",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.2"
      );

      tl.fromTo(
        ".overlay-nav-contact",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );

      tl.fromTo(
        ".overlay-nav-close",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        "-=0.4"
      );

      tlRef.current = tl;

      return () => {
        tl.kill();
      };
    },
    { scope: overlayRef }
  );

  // Always restore body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
      const timeout = setTimeout(() => {
        document.body.style.overflow = "";
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] bg-charcoal"
      style={{ clipPath: "inset(0 0 100% 0)" }}
      aria-hidden={!open}
      role="dialog"
      aria-label="Navigation"
    >
      <div className="h-full flex flex-col">
        {/* Close button */}
        <div className="flex justify-end p-6 md:p-10">
          <button
            onClick={onClose}
            className="overlay-nav-close text-[#e8e4dc] hover:text-white transition-colors"
            aria-label="Close navigation"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row items-start justify-center px-8 md:px-20 pb-16 gap-16">
          {/* Left: nav links */}
          <nav className="flex flex-col gap-4 md:gap-6 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="overlay-nav-link font-serif text-3xl md:text-5xl lg:text-6xl text-[#e8e4dc] hover:text-white transition-colors leading-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: contact + theme */}
          <div className="overlay-nav-contact flex flex-col gap-6 md:w-72">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#e8e4dc]/60 mb-3">
                Contact
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-[#e8e4dc] hover:text-white transition-colors text-sm"
              >
                {siteConfig.email}
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#e8e4dc]/60 mb-3">
                Portal
              </p>
              <Link
                href={siteConfig.portalUrl}
                onClick={onClose}
                className="text-[#e8e4dc] hover:text-white transition-colors text-sm"
              >
                Client Portal
              </Link>
            </div>
            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="flex items-center gap-2 text-[#e8e4dc]/60 hover:text-white transition-colors text-sm mt-4"
              aria-label="Toggle theme"
            >
              <Sun className="size-4 hidden dark:block" />
              <Moon className="size-4 block dark:hidden" />
              <span className="font-mono text-xs uppercase tracking-widest">
                {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

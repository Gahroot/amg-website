"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

const loading = () => <SectionSkeleton />;

const DomainsArchitect = dynamic(
  () =>
    import("./domains-architect").then((m) => m.DomainsArchitect),
  { ssr: false, loading }
);

const DomainsConstellation = dynamic(
  () =>
    import("./domains-constellation").then((m) => m.DomainsConstellation),
  { ssr: false, loading }
);

const DomainsDial = dynamic(
  () =>
    import("./domains-dial").then((m) => m.DomainsDial),
  { ssr: false, loading }
);

export function ShowcaseClient() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="pt-20">
        {/* Intro */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              DESIGN OPTIONS
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Domains Section Showcase
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Three approaches to visualizing AMG&apos;s five integrated
              capability domains. Each option offers a distinct character while
              sharing the same underlying data and mobile experience.
            </p>
          </div>
        </section>

        {/* Option 1: The Architect */}
        <div className="border-t border-border/50">
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                Option 1
              </p>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                The Architect
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Refined 2D hub-and-spoke with icon nodes and adjacent detail
                cards.
              </p>
            </div>
          </section>
          <DomainsArchitect />
        </div>

        {/* Option 2: The Constellation */}
        <div className="border-t border-border/50">
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                Option 2
              </p>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                The Constellation
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Interactive 3D orbital graph with luxury card tooltips.
              </p>
            </div>
          </section>
          <DomainsConstellation />
        </div>

        {/* Option 3: The Dial */}
        <div className="border-t border-border/50">
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                Option 3
              </p>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                The Dial
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Minimal auto-rotating dial with editorial content display.
              </p>
            </div>
          </section>
          <DomainsDial />
        </div>
      </main>
      <Footer />
    </>
  );
}

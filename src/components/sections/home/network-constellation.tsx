"use client";

import dynamic from "next/dynamic";
import { partnerNetworkData } from "@/lib/network-data";

const NetworkGraph = dynamic(
  () =>
    import("@/components/effects/network-graph").then((m) => m.NetworkGraph),
  { ssr: false },
);

export function NetworkConstellation() {
  return (
    <section id="network" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE NETWORK
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            ONE HUB. EVERY SPOKE.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AMG sits at the center of a curated ecosystem of world-class
            practitioners — each a recognized leader in their domain, all
            orchestrated through a single operating system.
          </p>
        </div>
      </div>
      <div className="relative w-full" style={{ background: "#0a0a0a" }}>
        <NetworkGraph
          nodes={partnerNetworkData.nodes}
          links={partnerNetworkData.links}
          centerNodeId={partnerNetworkData.centerNodeId}
          height={600}
        />
      </div>
    </section>
  );
}

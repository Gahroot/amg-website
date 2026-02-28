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
    <section id="network" className="dark relative overflow-hidden">
      {/* Gradient fade from page background into dark island */}
      <div className="h-24 lg:h-32 bg-gradient-to-b from-transparent to-[#0a0a0a]" />

      <div className="bg-[#0a0a0a] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-[#d4c9a8] mb-4">
              THE NETWORK
            </p>
            <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-[#f0ece4]">
              ONE HUB. EVERY SPOKE.
            </h2>
            <p className="text-[#8a8578] text-lg max-w-2xl mx-auto">
              AMG sits at the center of a curated ecosystem of world-class
              practitioners — each a recognized leader in their domain, all
              orchestrated through a single operating system.
            </p>
          </div>
        </div>
        <div className="relative w-full">
          <NetworkGraph
            nodes={partnerNetworkData.nodes}
            links={partnerNetworkData.links}
            centerNodeId={partnerNetworkData.centerNodeId}
            height={600}
          />
        </div>
      </div>

      {/* Gradient fade from dark island back to page background */}
      <div className="h-24 lg:h-32 bg-gradient-to-t from-transparent to-[#0a0a0a]" />
    </section>
  );
}

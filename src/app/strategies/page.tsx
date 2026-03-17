import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { StrategiesHero } from "@/components/sections/strategies/strategies-hero";
import { StrategiesDomains } from "@/components/sections/strategies/strategies-domains";
import { EngagementModel } from "@/components/sections/home/engagement-model";

export const metadata: Metadata = {
  title: "Strategies",
  description:
    "AMG's five-domain approach delivers comprehensive protection, optimized performance, and lasting resilience for UHNW families and global executives.",
};

export default function StrategiesPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <StrategiesHero />
        <StrategiesDomains />
        <EngagementModel />
      </main>
      <Footer />
    </>
  );
}

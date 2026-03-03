import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { AboutHero } from "@/components/sections/about/about-hero";

const loading = () => <SectionSkeleton />;

const WhatWeDo = dynamic(
  () =>
    import("@/components/sections/about/what-we-do").then((m) => m.WhatWeDo),
  { ssr: true, loading },
);
const Differentiators = dynamic(
  () =>
    import("@/components/sections/about/differentiators").then(
      (m) => m.Differentiators,
    ),
  { ssr: true, loading },
);
export const metadata = {
  title: "About",
  description:
    "Learn about Anchor Mill Group — who we are, what we do, and what sets us apart in integrated asset protection.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <AboutHero />
        <WhatWeDo />
        <Differentiators />
      </main>
      <Footer />
    </>
  );
}

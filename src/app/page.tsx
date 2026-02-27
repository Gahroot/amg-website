import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Hero } from "@/components/sections/home/hero";
import { TrustMarquee } from "@/components/sections/home/trust-marquee";

const WhoWeAre = dynamic(
  () =>
    import("@/components/sections/home/who-we-are").then((m) => m.WhoWeAre),
  { ssr: true },
);
const Problem = dynamic(
  () => import("@/components/sections/home/problem").then((m) => m.Problem),
  { ssr: true },
);
const BlindSpots = dynamic(
  () =>
    import("@/components/sections/home/blind-spots").then((m) => m.BlindSpots),
  { ssr: true },
);
const Solution = dynamic(
  () =>
    import("@/components/sections/home/solution").then((m) => m.Solution),
  { ssr: true },
);
const SixSolutions = dynamic(
  () =>
    import("@/components/sections/home/six-solutions").then(
      (m) => m.SixSolutions,
    ),
  { ssr: true },
);
const HowItWorks = dynamic(
  () =>
    import("@/components/sections/home/how-it-works").then(
      (m) => m.HowItWorks,
    ),
  { ssr: true },
);
const Domains = dynamic(
  () => import("@/components/sections/home/domains").then((m) => m.Domains),
  { ssr: true },
);
const AMGApproach = dynamic(
  () =>
    import("@/components/sections/home/amg-approach").then(
      (m) => m.AMGApproach,
    ),
  { ssr: true },
);
const EcosystemHub = dynamic(
  () =>
    import("@/components/sections/home/ecosystem-hub").then(
      (m) => m.EcosystemHub,
    ),
  { ssr: true },
);
const NetworkConstellation = dynamic(
  () =>
    import("@/components/sections/home/network-constellation").then(
      (m) => m.NetworkConstellation,
    ),
  { ssr: true },
);
const Metrics = dynamic(
  () => import("@/components/sections/home/metrics").then((m) => m.Metrics),
  { ssr: true },
);
const CaseStudy = dynamic(
  () =>
    import("@/components/sections/home/case-study").then((m) => m.CaseStudy),
  { ssr: true },
);
const Partners = dynamic(
  () =>
    import("@/components/sections/home/partners").then((m) => m.Partners),
  { ssr: true },
);
const CTA = dynamic(
  () => import("@/components/sections/home/cta").then((m) => m.CTA),
  { ssr: true },
);

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero />
        <TrustMarquee />
        <WhoWeAre />
        <Problem />
        <BlindSpots />
        <Solution />
        <SixSolutions />
        <HowItWorks />
        <Domains />
        <AMGApproach />
        <EcosystemHub />
        <NetworkConstellation />
        <Metrics />
        <CaseStudy />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

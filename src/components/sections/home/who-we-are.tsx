import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const pillars = [
  {
    symbol: "◇",
    title: "RESILIENCE",
    description: "Engineered continuity across all domains of risk.",
  },
  {
    symbol: "⬡",
    title: "PROTECTION",
    description: "Comprehensive shielding of assets, identity, and legacy.",
  },
  {
    symbol: "△",
    title: "PERFORMANCE",
    description: "Strategic advantage through intelligence-led execution.",
  },
];

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            WHO WE ARE
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            COMPREHENSIVE PROTECTION FOR A COMPLEX WORLD
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mb-16">
            Anchor Mill Group delivers total asset protection across financial,
            digital, and physical domains. We integrate world-class expertise
            into a single, cohesive operating system — so our clients never have
            to coordinate their own defense.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <AnimateOnScroll key={pillar.title} delay={index * 0.1}>
              <div className="border border-border rounded-lg p-8 bg-card">
                <span className="text-3xl text-primary mb-4 block">
                  {pillar.symbol}
                </span>
                <h3 className="font-mono text-lg font-semibold uppercase tracking-tight mb-3 text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

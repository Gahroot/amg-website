import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const differentiators = [
  {
    symbol: "\u2295",
    title: "INTEGRATION OVER ISOLATION",
    description:
      "Where others provide point solutions, we provide a unified operating system.",
  },
  {
    symbol: "\u25CE",
    title: "WORLD-CLASS PRACTITIONERS",
    description:
      "Every partner is a recognized leader in their field — former intelligence officers, Yale physicians, Fortune 100 coaches.",
  },
  {
    symbol: "\u2B22",
    title: "ABSOLUTE DISCRETION",
    description:
      "We serve clients who cannot afford public exposure. Confidentiality is foundational, not aspirational.",
  },
  {
    symbol: "\u25C8",
    title: "ADAPTIVE METHODOLOGY",
    description:
      "Our framework evolves with your threats, your family, and your enterprise.",
  },
];

export function Differentiators() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            WHY AMG
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            WHAT SETS AMG APART
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Four principles that define every engagement.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {differentiators.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={index * 0.1}>
              <div className="flex items-start gap-5 border border-border rounded-lg p-6 bg-card">
                <span className="text-2xl text-primary flex-shrink-0 mt-1">
                  {item.symbol}
                </span>
                <div>
                  <h3 className="font-mono text-lg font-semibold uppercase tracking-tight mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

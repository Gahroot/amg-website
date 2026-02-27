import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const differentiators = [
  {
    symbol: "⊕",
    title: "SINGLE TRUSTED RELATIONSHIP",
    description:
      "One dedicated partner who understands your full picture — coordinating every specialist, every domain, every timeline.",
  },
  {
    symbol: "◎",
    title: "COLLABORATION-FIRST MODEL",
    description:
      "We work alongside your existing advisors, attorneys, and family office teams — enhancing, not replacing.",
  },
  {
    symbol: "⬢",
    title: "INTELLIGENCE-LED ARCHITECTURE",
    description:
      "Every recommendation is grounded in real-time intelligence, not assumptions. Data-driven protection for a data-driven world.",
  },
  {
    symbol: "◈",
    title: "STRICT CONFIDENTIALITY",
    description:
      "We serve clients who cannot afford exposure. Discretion is engineered into every process, communication, and engagement.",
  },
];

export function AMGApproach() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE AMG APPROACH
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            WHAT SETS AMG APART
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-16">
            Special Operations Discipline. Advisory Excellence.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {differentiators.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={index * 0.1}>
              <div className="flex items-start gap-5 border border-border rounded-lg p-6 bg-card">
                <span className="text-2xl text-primary flex-shrink-0 mt-1">
                  {item.symbol}
                </span>
                <div>
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-tight mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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

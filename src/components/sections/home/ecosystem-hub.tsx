import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const spokes = [
  "Cybersecurity",
  "Due Diligence",
  "Secure Comms",
  "Business Intelligence",
  "Private Advisory",
  "Training",
  "Global Logistics",
  "Compliance",
];

export function EcosystemHub() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            THE SOVEREIGN GLOBAL ECOSYSTEM
          </p>
          <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
            HOW THE ECOSYSTEM WORKS
          </h2>
        </AnimateOnScroll>

        {/* Desktop: CSS-based hub visualization */}
        <AnimateOnScroll delay={0.2}>
          <div className="hidden md:flex items-center justify-center mt-16">
            <div className="relative w-[500px] h-[500px]">
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                <span className="font-mono text-sm font-bold text-primary">AMG</span>
              </div>

              {/* Spokes arranged in a ring */}
              {spokes.map((spoke, i) => {
                const angle = (i * 360) / spokes.length - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = 200;
                const x = 250 + radius * Math.cos(rad);
                const y = 250 + radius * Math.sin(rad);

                return (
                  <div key={spoke}>
                    {/* Connecting line */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      aria-hidden="true"
                    >
                      <line
                        x1="250"
                        y1="250"
                        x2={x}
                        y2={y}
                        stroke="var(--border)"
                        strokeWidth="1"
                      />
                    </svg>
                    {/* Spoke node */}
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-28 text-center"
                      style={{ left: x, top: y }}
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary text-xs">◇</span>
                      </div>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {spoke}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Mobile: 2x4 grid fallback */}
        <div className="md:hidden mt-12 grid grid-cols-2 gap-4">
          {spokes.map((spoke, index) => (
            <AnimateOnScroll key={spoke} delay={index * 0.05}>
              <div className="border border-border rounded-lg p-4 bg-background text-center">
                <span className="text-primary text-lg block mb-2">◇</span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {spoke}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

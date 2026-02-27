import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const partners = [
  {
    name: "Dr. Barry McManus",
    title: "Intelligence & Assessment",
    credential: "Former Senior Intelligence Officer",
  },
  {
    name: "Dr. Charles Morgan III",
    title: "Neurobiology & Performance",
    credential: "Yale School of Medicine \u2022 Former CIA",
  },
  {
    name: "Dr. James LaValle",
    title: "Integrative Medicine",
    credential: "Clinical Pharmacist \u2022 Metabolic Medicine",
  },
  {
    name: "Ryan Krupa",
    title: "Leadership Development",
    credential: "Fortune 100 Executive Coach",
  },
  {
    name: "AMG Labs",
    title: "Cyber & Digital Security",
    credential: "NSA/Government-Level Threat Operations",
  },
  {
    name: "Scot Holzschuh",
    title: "Protective Operations",
    credential: "USMC Veteran \u2022 Executive Protection",
  },
];

export function Partners() {
  return (
    <section id="partners" className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
          OUR NETWORK
        </p>
        <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
          THE PARTNER ECOSYSTEM
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          AMG&apos;s strength lies in its curated network of world-class
          practitioners — each a recognized leader in their domain.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {partners.map((partner, i) => (
            <AnimateOnScroll key={partner.name} delay={i * 0.1}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-mono text-base font-semibold text-foreground mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-primary mb-2">{partner.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {partner.credential}
                  </p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const partners = [
  {
    name: "Dr. Barry McManus",
    initials: "BM",
    title: "Intelligence & Assessment",
    credential: "Former Senior Intelligence Officer",
    bio: "Former Senior Intelligence Officer with decades of experience in human assessment and threat evaluation. Specializes in identifying behavioral indicators and psychological vulnerabilities in high-stakes environments.",
  },
  {
    name: "Dr. Charles Morgan III",
    initials: "CM",
    title: "Neurobiology & Performance",
    credential: "Yale School of Medicine \u2022 Former CIA",
    bio: "Yale School of Medicine faculty and former CIA forensic psychiatrist. Pioneer in the neurobiology of resilience, stress inoculation, and peak performance under extreme conditions.",
  },
  {
    name: "Dr. James LaValle",
    initials: "JL",
    title: "Integrative Medicine",
    credential: "Clinical Pharmacist \u2022 Metabolic Medicine",
    bio: "Board-certified clinical pharmacist and internationally recognized expert in metabolic medicine. Developed integrative protocols optimizing health, cognition, and longevity for high-performing individuals.",
  },
  {
    name: "Ryan Krupa",
    initials: "RK",
    title: "Leadership Development",
    credential: "Fortune 100 Executive Coach",
    bio: "Fortune 100 executive coach specializing in leadership development, succession planning, and organizational transformation. Trusted advisor to C-suite leaders across multiple industries.",
  },
  {
    name: "AMG Labs",
    initials: "AL",
    title: "Cyber & Digital Security",
    credential: "NSA/Government-Level Threat Operations",
    bio: "A dedicated cyber and digital security division staffed by former NSA and government threat hunters. Provides threat assessment, digital forensics, incident response, and secure communications architecture.",
  },
  {
    name: "Scot Holzschuh",
    initials: "SH",
    title: "Protective Operations",
    credential: "USMC Veteran \u2022 Executive Protection",
    bio: "USMC veteran with extensive experience in protective operations and executive security. Designs and implements comprehensive physical security programs for UHNW families and global executives.",
  },
];

export function PartnerBios() {
  return (
    <section className="py-24 lg:py-32 bg-card/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
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
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {partners.map((partner, i) => (
            <AnimateOnScroll key={partner.name} delay={i * 0.1}>
              <Card className="bg-background border-border hover:border-primary/30 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-lg font-bold text-primary">
                        {partner.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-mono text-base font-semibold text-foreground">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-primary">{partner.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {partner.credential}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.bio}
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

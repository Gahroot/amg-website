import type { ReactNode } from "react";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: string;
  children: ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  intro,
  children,
}: LegalPageProps) {
  return (
    <section className="relative pt-32 pb-24 lg:pb-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 lg:mb-16 pb-10 border-b border-rule">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            {eyebrow}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
            {title}
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Effective {effectiveDate}
          </p>
          <p className="text-lg text-muted-foreground">{intro}</p>
        </header>

        <div className="legal-prose space-y-10 text-foreground/85">
          {children}
        </div>
      </div>
    </section>
  );
}

interface LegalSectionProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({
  id,
  number,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">
        {number}
      </p>
      <h2 className="font-mono uppercase tracking-tight font-bold text-xl sm:text-2xl text-foreground mb-5">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}

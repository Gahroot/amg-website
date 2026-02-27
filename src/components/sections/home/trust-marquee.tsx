export function TrustMarquee() {
  const words = ["Trust", "Precision", "Resilience", "Protection", "Performance"];
  const content = words.map((w) => `${w} ◇`).join(" ") + " ";

  return (
    <section className="py-4 border-y border-border overflow-hidden" aria-hidden="true">
      <div className="marquee-track flex whitespace-nowrap">
        <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground px-2">
          {content}
        </span>
        <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground px-2">
          {content}
        </span>
      </div>
    </section>
  );
}

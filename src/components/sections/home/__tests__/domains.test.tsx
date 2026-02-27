import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { Domains } from "../domains";

vi.mock("@/components/ui/animate-on-scroll", () => ({
  AnimateOnScroll: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: ReactNode }) => (
    <div role="tablist">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => (
    <button role="tab" data-value={value}>
      {children}
    </button>
  ),
  TabsContent: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => (
    <div role="tabpanel" data-value={value}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => <div {...props}>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Domains", () => {
  it("renders section heading 'FIVE DOMAINS. ONE ECOSYSTEM.'", () => {
    render(<Domains />);

    expect(
      screen.getByText("FIVE DOMAINS. ONE ECOSYSTEM.")
    ).toBeInTheDocument();
  });

  it("renders label 'OUR DOMAINS'", () => {
    render(<Domains />);

    expect(screen.getByText("OUR DOMAINS")).toBeInTheDocument();
  });

  it("renders all 5 domain tabs", () => {
    render(<Domains />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);

    const tabLabels = ["Neurobiology", "Cyber & Security", "Leadership", "Medicine", "Intelligence"];
    for (const label of tabLabels) {
      expect(screen.getByRole("tab", { name: new RegExp(label) })).toBeInTheDocument();
    }
  });

  it("renders domain descriptions", () => {
    render(<Domains />);

    const descriptions = [
      /Optimizing cognitive performance/,
      /Comprehensive digital and physical security/,
      /Building next-generation leadership capacity/,
      /Personalized health optimization/,
      /Strategic intelligence gathering/,
    ];

    for (const desc of descriptions) {
      expect(screen.getByText(desc)).toBeInTheDocument();
    }
  });

  it("renders capabilities for each domain", () => {
    render(<Domains />);

    // Neurobiology capabilities
    expect(screen.getByText("Peak performance protocols")).toBeInTheDocument();
    expect(screen.getByText("Stress inoculation training")).toBeInTheDocument();
    expect(screen.getByText("Cognitive optimization")).toBeInTheDocument();
    expect(screen.getByText("Executive function enhancement")).toBeInTheDocument();

    // Cyber & Security capabilities
    expect(screen.getByText("Threat assessment & monitoring")).toBeInTheDocument();
    expect(screen.getByText("Digital forensics & incident response")).toBeInTheDocument();
    expect(screen.getByText("Executive protection")).toBeInTheDocument();
    expect(screen.getByText("Secure communications")).toBeInTheDocument();

    // Leadership capabilities
    expect(screen.getByText("Succession planning")).toBeInTheDocument();
    expect(screen.getByText("Next-gen development programs")).toBeInTheDocument();
    expect(screen.getByText("Governance frameworks")).toBeInTheDocument();
    expect(screen.getByText("Family council facilitation")).toBeInTheDocument();

    // Medicine capabilities
    expect(screen.getByText("Metabolic optimization")).toBeInTheDocument();
    expect(screen.getByText("Longevity protocols")).toBeInTheDocument();
    expect(screen.getByText("Personalized health plans")).toBeInTheDocument();
    expect(screen.getByText("Performance medicine")).toBeInTheDocument();

    // Intelligence capabilities
    expect(screen.getByText("Geopolitical risk assessment")).toBeInTheDocument();
    expect(screen.getByText("Due diligence investigations")).toBeInTheDocument();
    expect(screen.getByText("Competitive intelligence")).toBeInTheDocument();
    expect(screen.getByText("Crisis forecasting")).toBeInTheDocument();
  });
});

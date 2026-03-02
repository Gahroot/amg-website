import { render, screen } from "@testing-library/react";
import { Domains } from "../domains";

describe("Domains", () => {
  it("renders section heading", () => {
    render(<Domains />);

    expect(
      screen.getByText("Five Domains. One Operating System.")
    ).toBeInTheDocument();
  });

  it("renders label 'OUR DOMAINS'", () => {
    render(<Domains />);

    expect(screen.getByText("OUR DOMAINS")).toBeInTheDocument();
  });

  it("renders all 5 domain titles", () => {
    render(<Domains />);

    const domainTitles = [
      "Neurobiology & Performance",
      "Cyber & Protective Security",
      "Leadership Development",
      "Integrative Medicine",
      "Business Intelligence",
    ];
    for (const title of domainTitles) {
      expect(screen.getByText(title)).toBeInTheDocument();
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

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { domains } from "@/lib/domains-data";
import { Domains } from "../domains";

// A first-visit control must work before the WebGL graph supplies its API.
vi.mock("@/components/shared/constellation-graph", () => ({
  ConstellationGraph: () => null,
}));
vi.mock("@/lib/gsap", () => ({ useGSAP: vi.fn(), initGSAP: vi.fn() }));

describe("Domains", () => {
  it("opens cards with Enter and Space before the graph is ready, with a description and link payoff", async () => {
    const user = userEvent.setup();
    render(<Domains />);
    const reset = screen.getByRole("button", { name: "Reset domain selection" });
    await user.tab();
    expect(reset).toHaveFocus();
    await user.tab();
    const first = screen.getByRole("button", { name: domains[0].title });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{Enter}");
    expect(first).toHaveAttribute("aria-expanded", "true");
    const detail = document.getElementById(first.getAttribute("aria-controls") ?? "");
    expect(detail).toBeVisible();
    await waitFor(() => expect(within(detail as HTMLElement).getByText(domains[0].description)).toBeVisible());
    await user.tab();
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-expanded", "false");
    await user.keyboard(" ");
    expect(first).toHaveAttribute("aria-expanded", "true");
    await user.click(reset);
    expect(first).toHaveAttribute("aria-expanded", "false");
  });

  it("preserves pointer toggling and changes the expanded description", async () => {
    const user = userEvent.setup();
    render(<Domains />);
    for (const domain of domains) {
      const card = screen.getByRole("button", { name: domain.title });
      await user.click(card);
      expect(card).toHaveAttribute("aria-expanded", "true");
      const detail = document.getElementById(card.getAttribute("aria-controls") ?? "");
      await waitFor(() => expect(within(detail as HTMLElement).getByText(domain.description)).toBeVisible());
      expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute("href", "/strategies");
      await user.click(card);
      expect(card).toHaveAttribute("aria-expanded", "false");
    }
  });
  it("renders section heading", () => {
    render(<Domains />);

    expect(
      screen.getByText("Five disciplines, one integrated framework")
    ).toBeInTheDocument();
  });

  it("renders the strategic domains label", () => {
    render(<Domains />);

    expect(screen.getByText("Strategic Domains")).toBeInTheDocument();
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
      // Desktop cards and the mobile spine both include each title.
      expect(screen.getAllByText(title)).toHaveLength(2);
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

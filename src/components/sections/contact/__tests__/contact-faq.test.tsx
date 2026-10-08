import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ContactFAQ } from "../contact-faq";

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionItem: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AccordionTrigger: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
  AccordionContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ContactFAQ", () => {
  it("renders section heading 'Common Questions'", () => {
    render(<ContactFAQ />);

    expect(screen.getByText("Common Questions")).toBeInTheDocument();
  });

  it("renders label 'Frequently Asked Questions'", () => {
    render(<ContactFAQ />);

    expect(
      screen.getByText("Frequently Asked Questions")
    ).toBeInTheDocument();
  });

  it("renders all 6 FAQ questions", () => {
    render(<ContactFAQ />);

    const questions = [
      "Who is AMG designed for?",
      "How does the discovery process work?",
      "What makes AMG different from traditional security firms?",
      "How long does an engagement typically take?",
      "Is my information kept confidential?",
      "How many domains do we need to start?",
    ];

    for (const question of questions) {
      expect(screen.getByText(question)).toBeInTheDocument();
    }
  });

  it("renders all 6 FAQ answers", () => {
    render(<ContactFAQ />);

    const answers = [
      /AMG serves UHNW families/,
      /We begin with a confidential conversation/,
      /Traditional firms address one domain in isolation/,
      /Initial discovery and blueprint development takes 4-6 weeks/,
      /Absolute discretion is foundational/,
      /Engagements begin with at least two of our five domains/,
    ];

    for (const answer of answers) {
      expect(screen.getByText(answer)).toBeInTheDocument();
    }
  });

  it("explains the two-domain minimum without promising a single-domain engagement", () => {
    render(<ContactFAQ />);

    expect(
      screen.getByRole("button", { name: "How many domains do we need to start?" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Engagements begin with at least two of our five domains, not a single domain, to ensure cross-domain intelligence rather than siloed expertise. Choose the domains most critical to your needs and add domains as those needs evolve."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Yes\. While our integrated approach/)).not.toBeInTheDocument();
  });

  it("renders 'Who is AMG designed for?' question", () => {
    render(<ContactFAQ />);

    expect(
      screen.getByText("Who is AMG designed for?")
    ).toBeInTheDocument();
  });

  it("renders 'How does the discovery process work?' question", () => {
    render(<ContactFAQ />);

    expect(
      screen.getByText("How does the discovery process work?")
    ).toBeInTheDocument();
  });
});

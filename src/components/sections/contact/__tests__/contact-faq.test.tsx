import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ContactFAQ } from "../contact-faq";

vi.mock("@/components/ui/animate-on-scroll", () => ({
  AnimateOnScroll: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

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
  it("renders section heading 'COMMON QUESTIONS'", () => {
    render(<ContactFAQ />);

    expect(screen.getByText("COMMON QUESTIONS")).toBeInTheDocument();
  });

  it("renders label 'FREQUENTLY ASKED QUESTIONS'", () => {
    render(<ContactFAQ />);

    expect(
      screen.getByText("FREQUENTLY ASKED QUESTIONS")
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
      "Can we start with just one domain?",
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
      /While our integrated approach is most powerful/,
    ];

    for (const answer of answers) {
      expect(screen.getByText(answer)).toBeInTheDocument();
    }
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

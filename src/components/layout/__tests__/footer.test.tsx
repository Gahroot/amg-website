import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "../footer";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Footer", () => {
  it("renders company name 'ANCHOR MILL GROUP'", () => {
    render(<Footer />);

    expect(screen.getByText("ANCHOR MILL GROUP")).toBeInTheDocument();
  });

  it("renders company description", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        "Integrated resilience, protection, and performance for UHNW families and global executives."
      )
    ).toBeInTheDocument();
  });

  it("renders all nav links", () => {
    render(<Footer />);

    const expectedLinks = [
      "Home",
      "About",
      "Strategies",
      "How We Serve",
      "Contact",
    ];
    for (const label of expectedLinks) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders all 5 domain names", () => {
    render(<Footer />);

    const domains = [
      "Neurobiology & Performance",
      "Cyber & Protective Security",
      "Leadership Development",
      "Integrative Medicine",
      "Business Intelligence & Geopolitical Risk",
    ];

    for (const domain of domains) {
      expect(screen.getByText(domain)).toBeInTheDocument();
    }
  });

  it("renders contact email", () => {
    render(<Footer />);

    const emailLink = screen.getByRole("link", {
      name: /inquiries@anchormillgroup\.com/i,
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:inquiries@anchormillgroup.com"
    );
  });

  it("renders copyright text", () => {
    render(<Footer />);

    expect(
      screen.getByText(/© 2025 Anchor Mill Group\. All rights reserved\./)
    ).toBeInTheDocument();
  });

  it("renders 'Confidential' text", () => {
    render(<Footer />);

    expect(screen.getByText("Confidential")).toBeInTheDocument();
  });

  it("footer has contentinfo role", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

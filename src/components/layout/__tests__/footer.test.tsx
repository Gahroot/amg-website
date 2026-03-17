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
  it("renders company name 'Anchor Mill Group'", () => {
    render(<Footer />);

    expect(screen.getByText("Anchor Mill Group")).toBeInTheDocument();
  });

  it("renders company description", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /Comprehensive protection for a complex world/
      )
    ).toBeInTheDocument();
  });

  it("renders all nav links", () => {
    render(<Footer />);

    const expectedLinks = [
      "About",
      "Solutions",
      "Who We Serve",
      "Get in Touch",
    ];
    for (const label of expectedLinks) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders footer section headings", () => {
    render(<Footer />);

    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
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
      screen.getByText(/© 2026 Anchor Mill Group/)
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

import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../navbar";

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

vi.mock("../navbar-interactive", () => ({
  NavbarInteractive: () => <div data-testid="navbar-interactive" />,
}));

describe("Navbar", () => {
  it("renders the logo text 'ANCHOR MILL GROUP'", () => {
    render(<Navbar />);

    expect(screen.getByText("ANCHOR MILL GROUP")).toBeInTheDocument();
  });

  it("logo links to home page", () => {
    render(<Navbar />);

    const logo = screen.getByText("ANCHOR MILL GROUP");
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders all nav links", () => {
    render(<Navbar />);

    const expectedLinks = ["Home", "About", "Strategies", "How We Serve", "Contact"];
    for (const label of expectedLinks) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders 'Client Login' link", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("link", { name: /client login/i })
    ).toBeInTheDocument();
  });

  it("renders the NavbarInteractive component", () => {
    render(<Navbar />);

    expect(screen.getByTestId("navbar-interactive")).toBeInTheDocument();
  });

  it("nav links have correct href attributes", () => {
    render(<Navbar />);

    const linkMap: Record<string, string> = {
      Home: "/",
      About: "/about",
      Strategies: "/strategies",
      "How We Serve": "/how-we-serve",
      Contact: "/contact",
    };

    for (const [label, href] of Object.entries(linkMap)) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href
      );
    }
  });
});

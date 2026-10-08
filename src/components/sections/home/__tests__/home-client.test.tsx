import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { HomeClient } from "../home-client";

// Leave animation completion unavailable: content must not depend on it.
vi.mock("@/lib/gsap", () => ({
  initGSAP: vi.fn(),
  useGSAP: vi.fn(),
  ScrollTrigger: { refresh: vi.fn() },
  gsap: { quickTo: () => vi.fn(), to: vi.fn() },
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme: vi.fn(), resolvedTheme: "light" }),
}));

describe("HomeClient first visit", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([false, true])(
    "offers content and navigation immediately (reduced motion: %s)",
    (reducedMotion) => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion") && reducedMotion,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { container } = render(<HomeClient />);
      const main = screen.getByRole("main");
      expect(within(main).getByRole("heading", { level: 1 })).toHaveTextContent(
        /Anchor\s*Mill Group/
      );
      expect(within(main).getByRole("link", { name: /begin a conversation/i }))
        .toHaveAttribute("href", "/contact");
      expect(within(main).getByText("Five disciplines, one integrated framework"))
        .toBeInTheDocument();
      expect(main.children).toHaveLength(8);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(container.querySelector(".preloader-logo")).toBeNull();
      expect(document.body.style.overflow).not.toBe("hidden");

      fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
      const navigation = screen.getByRole("dialog", { name: "Navigation" });
      expect(within(navigation).getByRole("link", { name: "Solutions" }))
        .toHaveAttribute("href", "/strategies");
      expect(within(navigation).getByRole("link", { name: "Get in Touch" }))
        .toHaveAttribute("href", "/contact");
    }
  );

  it("server-renders useful content and contact paths before effects run", () => {
    const html = renderToString(<HomeClient />);
    expect(html).toContain('id="main-content"');
    expect(html).toContain("Integrated Resilience, Protection, and Performance");
    expect(html).toContain("Five disciplines, one integrated framework");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Open navigation menu");
    expect(html).not.toContain("preloader-logo");
  });
});

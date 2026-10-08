import { act, cleanup, render, screen } from "@testing-library/react";
import { timelineStops, ctaContent } from "@/lib/journey-data";
import { JourneyVerticalTimeline } from "../journey-vertical-timeline";
import { JourneyCTA } from "../journey-cta";

vi.mock("@/lib/gsap", () => ({
  loadGSAP: vi.fn(async () => ({
    gsap: { context: vi.fn(() => ({ revert: vi.fn() })) },
  })),
}));

function expectFullStack(container: HTMLElement, mobile: boolean): void {
  const stops = container.querySelectorAll(mobile ? ".timeline-stop-mobile" : ".timeline-stop");
  expect(stops).toHaveLength(5);
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(6);
  timelineStops.forEach((stop, index) => {
    expect(stops[index]).toContainElement(screen.getByRole("heading", { name: stop.title }));
    expect(screen.getByText(stop.description)).toBeVisible();
    if (stop.quote) expect(screen.getByText(stop.quote)).toBeVisible();
    stop.cards?.forEach((card) => {
      expect(screen.getByText(card.title)).toBeVisible();
      expect(screen.getByText(card.description)).toBeVisible();
    });
  });
  // Check the end of each custom panel, not just its heading.
  for (const text of [
    "Real-Time Intelligence",
    "Discretion engineered into every process.",
    "Training",
    "Identify and mitigate threats before they materialize.",
  ]) expect(screen.getByText(text)).toBeVisible();
  const cta = screen.getByRole("link", { name: ctaContent.buttonText });
  expect(cta).toHaveAttribute("href", ctaContent.buttonLink);
  expect(stops[4].compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

  if (!mobile) {
    // A happy-dom test cannot measure layout. Guard the structural cause:
    // no constrained/clipping ancestor or animation style around any content.
    for (const stop of stops) {
      let ancestor: Element | null = stop;
      while (ancestor && ancestor !== container) {
        expect(ancestor.className).not.toMatch(/(?:sticky|overflow-hidden|h-full|h-\[|min-h-\[)/);
        expect(ancestor).not.toHaveAttribute("style");
        ancestor = ancestor.parentElement;
      }
    }
    expect(container.querySelector(".timeline-viewport")).not.toBeInTheDocument();
  }
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("RF-006 readable journey timeline", () => {
  it.each([
    { width: 1440, height: 900, reduced: false },
    { width: 1280, height: 400, reduced: false },
    { width: 1024, height: 400, reduced: true },
    { width: 390, height: 844, reduced: false },
    { width: 390, height: 844, reduced: true },
  ])("keeps all five stages and the final CTA at $width x $height, reduced=$reduced", async ({ width, height, reduced }) => {
    window.innerWidth = width;
    window.innerHeight = height;
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: reduced })));
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    });
    const { container } = render(<><JourneyVerticalTimeline /><JourneyCTA /></>);
    await act(async () => {});
    expectFullStack(container, width < 768);
    if (width < 768) {
      expect(screen.getByText("01 / 05")).toBeVisible();
      expect(screen.getByText("05 / 05")).toBeVisible();
    }
  });

  it("preserves all content when resizing from mobile to desktop and back", () => {
    window.innerWidth = 390;
    vi.stubGlobal("IntersectionObserver", class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    });
    const { container } = render(<JourneyVerticalTimeline />);
    for (const width of [1280, 390]) {
      act(() => {
        window.innerWidth = width;
        window.dispatchEvent(new Event("resize"));
      });
      expect(container.querySelectorAll(width < 768 ? ".timeline-stop-mobile" : ".timeline-stop")).toHaveLength(5);
      for (const stop of timelineStops) expect(screen.getByRole("heading", { name: stop.title })).toBeVisible();
    }
  });
});

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { domains } from "@/lib/domains-data";
import { StrategiesDomains } from "../strategies-domains";

const motionPreference = vi.hoisted(() => vi.fn(() => true));

// Complete the entrance without a browser scroll trigger; keep real selection effects.
vi.mock("@/lib/gsap", async () => {
  const { useEffect, useRef } = await import("react");
  return {
    useGSAP: (callback: () => void) => {
      const entrance = useRef(callback);
      useEffect(() => { entrance.current(); }, []);
    },
    initGSAP: vi.fn(),
    gsap: {
      set: vi.fn(),
      timeline: () => {
        const timeline = {
          to: vi.fn(() => timeline),
          call: (callback: () => void) => callback(),
          kill: vi.fn(),
          progress: vi.fn(),
          scrollTrigger: { kill: vi.fn() },
        };
        return timeline;
      },
    },
  };
});
vi.mock("@/lib/use-can-pin", () => ({ useReducedMotion: motionPreference }));

function expectPayoff(index: number): void {
  const tab = screen.getByRole("tab", { name: domains[index].title });
  expect(tab).toHaveAttribute("aria-selected", "true");
  expect(tab).toHaveAttribute("tabindex", "0");
  const panel = screen.getByRole("tabpanel", { name: domains[index].title });
  expect(tab).toHaveAttribute("aria-controls", panel.id);
  expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  expect(within(panel).getByText(domains[index].description)).toBeVisible();
  for (const capability of domains[index].capabilities) {
    expect(within(panel).getByText(capability)).toBeVisible();
  }
  expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
}

describe("StrategiesDomains selector", () => {
  beforeEach(() => { motionPreference.mockReturnValue(true); });

  it("offers a tailored program starting with at least two domains, with room to expand", () => {
    render(<StrategiesDomains />);

    expect(
      screen.getByText(
        "Begin with at least two of our five domains, chosen for your family's precise needs, and add domains as those needs evolve. Together they provide cross-domain intelligence and coordinated protection and performance."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/one, several, or all/)).not.toBeInTheDocument();
  });

  it("auto-rotates until keyboard focus enters, then keeps focus and description stable", () => {
    motionPreference.mockReturnValue(false);
    vi.useFakeTimers();
    try {
      render(<StrategiesDomains />);
      const initial = screen.getByRole("tab", { selected: true });
      act(() => { vi.advanceTimersByTime(5000); });
      const selected = screen.getByRole("tab", { selected: true });
      expect(selected).not.toBe(initial);
      act(() => { selected.focus(); });
      act(() => { vi.advanceTimersByTime(15000); });
      expect(selected).toHaveFocus();
      expect(selected).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", selected.id);
    } finally {
      vi.useRealTimers();
    }
  });
  it("exposes named tabs outside hidden content with valid tab-panel associations", () => {
    render(<StrategiesDomains />);
    const selector = screen.getByRole("tablist", { name: "Domain selector" });
    const tabs = within(selector).getAllByRole("tab");
    expect(tabs).toHaveLength(domains.length);
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
    for (const [index, tab] of tabs.entries()) {
      expect(tab).toHaveAccessibleName(domains[index].title);
      expect(tab.closest('[aria-hidden="true"]')).toBeNull();
      const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }
  });

  it("moves selection and focus together, wraps, supports Home/End, and tabs into the matching description", async () => {
    const user = userEvent.setup();
    render(<StrategiesDomains />);
    await user.tab();
    expect(screen.getByRole("tab", { selected: true })).toHaveFocus();
    await user.keyboard("{Home}");
    expectPayoff(0);
    await user.keyboard("{ArrowLeft}");
    expectPayoff(4);
    expect(screen.getByRole("tab", { name: domains[4].title })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expectPayoff(0);
    await user.keyboard("{ArrowDown}");
    expectPayoff(1);
    await user.keyboard("{ArrowUp}");
    expectPayoff(0);
    await user.keyboard("{End}");
    expectPayoff(4);
    await user.keyboard("{Enter} ");
    expectPayoff(4);
    await user.tab();
    expect(screen.getByRole("tabpanel", { name: domains[4].title })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole("tab", { name: domains[4].title })).toHaveFocus();
  });

  it("preserves pointer selection and all mobile descriptions under reduced motion", async () => {
    const user = userEvent.setup();
    render(<StrategiesDomains />);
    for (const [index, domain] of domains.entries()) {
      await user.click(screen.getByRole("tab", { name: domain.title }));
      expectPayoff(index);
    }
    const mobile = screen.getAllByText(domains[0].description)
      .find((description) => description.closest(".md\\:hidden"))
      ?.closest(".md\\:hidden");
    expect(mobile).not.toBeNull();
    for (const domain of domains) {
      expect(within(mobile as HTMLElement).getByText(domain.description)).toBeInTheDocument();
    }
  });

  it("does not auto-rotate descriptions with reduced motion", () => {
    vi.useFakeTimers();
    try {
      render(<StrategiesDomains />);
      const selected = screen.getByRole("tab", { selected: true });
      act(() => { vi.advanceTimersByTime(15000); });
      expect(selected).toHaveAttribute("aria-selected", "true");
    } finally {
      vi.useRealTimers();
    }
  });
});

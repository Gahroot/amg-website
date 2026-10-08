import { useEffect, type ReactNode } from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { gsap } from "@/lib/gsap";
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

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme: vi.fn(), resolvedTheme: "light" }),
}));

vi.mock("@/lib/gsap", () => {
  const timeline = {
    fromTo: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    progress: vi.fn().mockReturnThis(),
    pause: vi.fn(),
    kill: vi.fn(),
  };
  return {
    gsap: { timeline: vi.fn(() => timeline) },
    initGSAP: vi.fn(),
    useGSAP: (callback: () => (() => void) | undefined) => {
      // Keep animation mocked, but exercise the real menu and focus primitive.
      useEffect(() => callback(), [callback]);
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Navbar", () => {
  it("renders the wordmark", () => {
    render(<Navbar />);

    expect(screen.getByText("Anchor Mill Group")).toBeInTheDocument();
  });

  it("wordmark links to home page", () => {
    render(<Navbar />);

    const wordmark = screen.getByText("Anchor Mill Group");
    expect(wordmark.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders the Menu button", () => {
    render(<Navbar />);

    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeInTheDocument();
  });

  it("keeps closed controls out of first-visit keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<><Navbar /><button>Page action</button></>);
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    const dialog = screen.getByRole("dialog", { hidden: true });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(dialog).toHaveAttribute("inert");
    for (const control of dialog.querySelectorAll("a, button")) {
      expect(control).toHaveAttribute("tabindex", "-1");
    }
    await user.tab();
    expect(screen.getByText("Anchor Mill Group")).toHaveFocus();
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Page action" })).toHaveFocus();
  });

  it("opens by keyboard, loops focus both ways, and restores it on Escape", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    const close = within(dialog).getByRole("button", { name: "Close navigation" });
    const theme = within(dialog).getByRole("button", { name: "Toggle theme" });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).not.toHaveAttribute("inert");
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(theme).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    for (const link of within(dialog).getAllByRole("link")) {
      await user.tab();
      expect(link).toHaveFocus();
    }
    await user.tab();
    expect(theme).toHaveFocus();
    trigger.focus();
    expect(theme).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(dialog).toHaveAttribute("inert");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
    expect(gsap.timeline().reverse).toHaveBeenCalled();
  });

  it("cancels pending scroll unlock when reopened during the closing animation", async () => {
    document.body.style.overflow = "scroll";
    const user = userEvent.setup();
    const { unmount } = render(<Navbar />);
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    trigger.focus();
    await user.keyboard("{Enter}{Escape}{Enter}");
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).toBe("scroll"));
    unmount();
    document.body.style.overflow = "";
  });

  it.each(["Close navigation", "About", "Client Portal"])(
    "restores Menu focus when dismissing with %s",
    async (name) => {
      const user = userEvent.setup();
      render(<Navbar />);
      const trigger = screen.getByRole("button", { name: /open navigation menu/i });
      trigger.focus();
      await user.keyboard(" ");
      await user.click(screen.getByRole(name === "Close navigation" ? "button" : "link", { name }));
      expect(trigger).toHaveFocus();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  );

  it("skips animation for reduced motion and restores prior overflow on unmount", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    document.body.style.overflow = "scroll";
    const user = userEvent.setup();
    const { unmount } = render(<Navbar />);
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(document.body.style.overflow).toBe("hidden");
    expect(gsap.timeline().progress).toHaveBeenCalledWith(1);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("scroll");
    expect(gsap.timeline().progress).toHaveBeenCalledWith(0);
    await user.keyboard("{Enter}");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
    expect(gsap.timeline().kill).toHaveBeenCalled();
    document.body.style.overflow = "";
  });
});

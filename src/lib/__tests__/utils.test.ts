import { cn } from "@/lib/utils";

describe("cn() utility", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes (undefined, null, false)", () => {
    expect(cn("base", undefined, null, false, "active")).toBe("base active");
  });

  it("resolves Tailwind conflicts by keeping the last value", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("mt-2", "mt-4")).toBe("mt-4");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(undefined)).toBe("");
  });

  it("handles arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn(["px-4"], ["px-6"])).toBe("px-6");
  });

  it("handles object syntax for conditional classes", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("handles complex combinations", () => {
    const result = cn(
      "base",
      undefined,
      ["array-class"],
      { conditional: true },
      "px-4",
      "px-6",
    );
    expect(result).toBe("base array-class conditional px-6");
  });
});

import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  heroSequence,
} from "@/lib/animations";

describe("fadeInUp", () => {
  it("has correct initial state (opacity 0, y 20)", () => {
    expect(fadeInUp.initial).toEqual({ opacity: 0, y: 20 });
  });

  it("has correct animate state (opacity 1, y 0)", () => {
    expect(fadeInUp.animate).toEqual({ opacity: 1, y: 0 });
  });

  it("has correct transition duration (0.5s)", () => {
    expect(fadeInUp.transition).toEqual({ duration: 0.5 });
  });
});

describe("staggerContainer", () => {
  it("has hidden state with opacity 0", () => {
    expect(staggerContainer.hidden).toEqual({ opacity: 0 });
  });

  it("has visible state with opacity 1", () => {
    expect(staggerContainer.visible.opacity).toBe(1);
  });

  it("has staggerChildren in visible transition", () => {
    expect(staggerContainer.visible.transition).toEqual({
      staggerChildren: 0.1,
    });
  });

  it("has both hidden and visible states", () => {
    expect(staggerContainer).toHaveProperty("hidden");
    expect(staggerContainer).toHaveProperty("visible");
  });
});

describe("staggerItem", () => {
  it("has hidden state with opacity 0 and y 20", () => {
    expect(staggerItem.hidden).toEqual({ opacity: 0, y: 20 });
  });

  it("has visible state with opacity 1 and y 0", () => {
    expect(staggerItem.visible.opacity).toBe(1);
    expect(staggerItem.visible.y).toBe(0);
  });

  it("has correct transition duration in visible state (0.5s)", () => {
    expect(staggerItem.visible.transition).toEqual({ duration: 0.5 });
  });

  it("has both hidden and visible states", () => {
    expect(staggerItem).toHaveProperty("hidden");
    expect(staggerItem).toHaveProperty("visible");
  });
});

describe("heroSequence", () => {
  it("is a function", () => {
    expect(typeof heroSequence).toBe("function");
  });

  it("returns correct initial state", () => {
    const result = heroSequence(0);
    expect(result.initial).toEqual({ opacity: 0, y: 20 });
  });

  it("returns correct animate state", () => {
    const result = heroSequence(0);
    expect(result.animate).toEqual({ opacity: 1, y: 0 });
  });

  it("returns correct transition with the given delay", () => {
    const result = heroSequence(0.3);
    expect(result.transition).toEqual({ duration: 0.5, delay: 0.3 });
  });

  it("preserves different delay values", () => {
    const delays = [0, 0.1, 0.2, 0.5, 1.0, 2.5];
    for (const delay of delays) {
      const result = heroSequence(delay);
      expect(result.transition.delay).toBe(delay);
    }
  });

  it("always has duration 0.5 regardless of delay", () => {
    const result1 = heroSequence(0);
    const result2 = heroSequence(1);
    const result3 = heroSequence(5);
    expect(result1.transition.duration).toBe(0.5);
    expect(result2.transition.duration).toBe(0.5);
    expect(result3.transition.duration).toBe(0.5);
  });

  it("returns a new object for each call", () => {
    const result1 = heroSequence(0.1);
    const result2 = heroSequence(0.1);
    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });
});

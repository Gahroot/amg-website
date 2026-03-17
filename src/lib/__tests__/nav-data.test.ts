import { navLinks } from "@/lib/nav-data";

describe("navLinks", () => {
  it("has the expected number of links (5)", () => {
    expect(navLinks).toHaveLength(5);
  });

  it("all links have href and label properties", () => {
    for (const link of navLinks) {
      expect(link).toHaveProperty("href");
      expect(link).toHaveProperty("label");
      expect(typeof link.href).toBe("string");
      expect(typeof link.label).toBe("string");
    }
  });

  it("all hrefs start with /", () => {
    for (const link of navLinks) {
      expect(link.href).toMatch(/^\//);
    }
  });

  it("has no duplicate hrefs", () => {
    const hrefs = navLinks.map((link) => link.href);
    const uniqueHrefs = new Set(hrefs);
    expect(uniqueHrefs.size).toBe(hrefs.length);
  });

  it("has no duplicate labels", () => {
    const labels = navLinks.map((link) => link.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it("has Home link as the first entry pointing to /", () => {
    expect(navLinks[0].label).toBe("Home");
    expect(navLinks[0].href).toBe("/");
  });

  it("contains all expected routes", () => {
    const expectedRoutes = ["/", "/about", "/strategies", "/how-we-serve", "/contact"];
    const actualRoutes = navLinks.map((link) => link.href);

    for (const route of expectedRoutes) {
      expect(actualRoutes).toContain(route);
    }
  });

  it("contains all expected labels", () => {
    const expectedLabels = ["Home", "About", "Who We Serve", "Solutions", "Get in Touch"];
    const actualLabels = navLinks.map((link) => link.label);

    for (const label of expectedLabels) {
      expect(actualLabels).toContain(label);
    }
  });

  it("all labels are non-empty", () => {
    for (const link of navLinks) {
      expect(link.label.trim().length).toBeGreaterThan(0);
    }
  });
});

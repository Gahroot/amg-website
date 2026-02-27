import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("has all required fields as non-empty strings", () => {
    const requiredFields = [
      "name",
      "description",
      "url",
      "email",
      "portalUrl",
    ] as const;

    for (const field of requiredFields) {
      expect(siteConfig[field]).toBeDefined();
      expect(typeof siteConfig[field]).toBe("string");
      expect(siteConfig[field].length).toBeGreaterThan(0);
    }
  });

  it("has url that starts with https://", () => {
    expect(siteConfig.url).toMatch(/^https:\/\//);
  });

  it("has portalUrl that starts with https://", () => {
    expect(siteConfig.portalUrl).toMatch(/^https:\/\//);
  });

  it("has a valid email format", () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("has the expected brand name", () => {
    expect(siteConfig.name).toBe("Anchor Mill Group");
  });

  it("has a description mentioning UHNW", () => {
    expect(siteConfig.description).toContain("UHNW");
  });

  it("has the correct production URL", () => {
    expect(siteConfig.url).toBe("https://anchormillgroup.com");
  });

  it("has the correct email address", () => {
    expect(siteConfig.email).toBe("inquiries@anchormillgroup.com");
  });
});

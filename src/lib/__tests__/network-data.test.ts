import { partnerNetworkData } from "@/lib/network-data";

describe("partnerNetworkData", () => {
  const { nodes, links, centerNodeId } = partnerNetworkData;

  it("has nodes, links, and centerNodeId properties", () => {
    expect(partnerNetworkData).toHaveProperty("nodes");
    expect(partnerNetworkData).toHaveProperty("links");
    expect(partnerNetworkData).toHaveProperty("centerNodeId");
    expect(Array.isArray(nodes)).toBe(true);
    expect(Array.isArray(links)).toBe(true);
    expect(typeof centerNodeId).toBe("string");
  });

  it("centerNodeId references an existing node", () => {
    const nodeIds = nodes.map((n) => n.id);
    expect(nodeIds).toContain(centerNodeId);
  });

  it("center node exists and has group 'hub'", () => {
    const centerNode = nodes.find((n) => n.id === centerNodeId);
    expect(centerNode).toBeDefined();
    expect(centerNode!.group).toBe("hub");
  });

  it("all nodes have required fields (id, name, group, val, color)", () => {
    for (const node of nodes) {
      expect(typeof node.id).toBe("string");
      expect(node.id.length).toBeGreaterThan(0);
      expect(typeof node.name).toBe("string");
      expect(node.name.length).toBeGreaterThan(0);
      expect(["hub", "domain", "partner"]).toContain(node.group);
      expect(typeof node.val).toBe("number");
      expect(node.val).toBeGreaterThan(0);
      expect(typeof node.color).toBe("string");
      expect(node.color.length).toBeGreaterThan(0);
    }
  });

  it("all node IDs are unique", () => {
    const ids = nodes.map((n) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all link sources reference existing node IDs", () => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const link of links) {
      expect(nodeIds.has(link.source)).toBe(true);
    }
  });

  it("all link targets reference existing node IDs", () => {
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const link of links) {
      expect(nodeIds.has(link.target)).toBe(true);
    }
  });

  it("has no self-referencing links", () => {
    for (const link of links) {
      expect(link.source).not.toBe(link.target);
    }
  });

  it("domain nodes have correct group", () => {
    const domainNodes = nodes.filter((n) => n.id.startsWith("d-"));
    expect(domainNodes.length).toBeGreaterThan(0);
    for (const node of domainNodes) {
      expect(node.group).toBe("domain");
    }
  });

  it("partner nodes have correct group", () => {
    const partnerNodes = nodes.filter((n) => n.id.startsWith("p-"));
    expect(partnerNodes.length).toBeGreaterThan(0);
    for (const node of partnerNodes) {
      expect(node.group).toBe("partner");
    }
  });

  it("hub node has fixed position (fx, fy, fz = 0)", () => {
    const hubNode = nodes.find((n) => n.group === "hub");
    expect(hubNode).toBeDefined();
    expect(hubNode!.fx).toBe(0);
    expect(hubNode!.fy).toBe(0);
    expect(hubNode!.fz).toBe(0);
  });

  it("has exactly one hub node", () => {
    const hubNodes = nodes.filter((n) => n.group === "hub");
    expect(hubNodes).toHaveLength(1);
  });

  it("has at least one domain node", () => {
    const domainNodes = nodes.filter((n) => n.group === "domain");
    expect(domainNodes.length).toBeGreaterThan(0);
  });

  it("has at least one partner node", () => {
    const partnerNodes = nodes.filter((n) => n.group === "partner");
    expect(partnerNodes.length).toBeGreaterThan(0);
  });

  it("has at least one link", () => {
    expect(links.length).toBeGreaterThan(0);
  });
});

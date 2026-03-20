"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, {
  type ForceGraphMethods,
  type NodeObject,
} from "react-force-graph-3d";
import type { NetworkNode, NetworkLink } from "@/lib/network-data";

export interface ConstellationGraphAPI {
  getNodeScreenPosition: (
    nodeId: string,
  ) => { x: number; y: number } | null;
  zoomToNode: (nodeId: string) => void;
  resetCamera: () => void;
  setAutoRotate: (enabled: boolean) => void;
}

interface ConstellationGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  centerNodeId?: string;
  height?: number;
  className?: string;
  highlightNodeId?: string | null;
  onReady?: (api: ConstellationGraphAPI) => void;
}

type GraphNode = NodeObject<NetworkNode>;

const CAMERA_Z = 340;

export function ConstellationGraph({
  nodes,
  links,
  centerNodeId = "amg",
  height = 640,
  className,
  highlightNodeId,
  onReady,
}: ConstellationGraphProps) {
  const fgRef = useRef<ForceGraphMethods<GraphNode>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height });

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ ...n })),
      links: links.map((l) => ({ ...l })),
    }),
    [nodes, links],
  );

  // Keep nodesRef in sync for screen coord lookups
  useEffect(() => {
    nodesRef.current = graphData.nodes;
  }, [graphData]);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  // Force tuning + initial camera
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    const charge = fg.d3Force("charge") as unknown as
      | { strength: (v: number) => void }
      | undefined;
    if (charge?.strength) charge.strength(-250);

    const link = fg.d3Force("link") as unknown as
      | { distance: (v: number) => void }
      | undefined;
    if (link?.distance) link.distance(110);

    fg.cameraPosition({ x: 0, y: 0, z: CAMERA_Z });
  }, [dimensions.width, dimensions.height]);

  // Drive auto-rotate via explicit RAF loop (OrbitControls needs update() each frame)
  // Pause our update() during user drag to avoid double-update jitter
  const orbitEnabledRef = useRef(true);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onDown = () => { isDraggingRef.current = true; };
    const onUp = () => { isDraggingRef.current = false; };

    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    let frameId: number;

    function tick() {
      if (!isDraggingRef.current) {
        const controls = fg?.controls() as {
          autoRotate?: boolean;
          autoRotateSpeed?: number;
          update?: () => void;
        } | undefined;
        if (controls) {
          controls.autoRotate = orbitEnabledRef.current;
          controls.autoRotateSpeed = 0.5;
          controls.update?.();
        }
      }
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Expose API to parent
  useEffect(() => {
    if (!onReady) return;

    const api: ConstellationGraphAPI = {
      getNodeScreenPosition: (nodeId) => {
        const fg = fgRef.current;
        if (!fg) return null;
        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (!node || node.x == null) return null;
        return fg.graph2ScreenCoords(
          node.x ?? 0,
          node.y ?? 0,
          node.z ?? 0,
        );
      },
      zoomToNode: (nodeId) => {
        const fg = fgRef.current;
        if (!fg) return;
        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (!node) return;

        const nx = node.x ?? 0;
        const ny = node.y ?? 0;
        const nz = node.z ?? 0;

        fg.cameraPosition(
          { x: nx * 0.5, y: ny * 0.5, z: 180 + nz * 0.2 },
          { x: nx * 0.3, y: ny * 0.3, z: nz * 0.3 },
          1000,
        );
      },
      resetCamera: () => {
        const fg = fgRef.current;
        if (!fg) return;
        fg.cameraPosition(
          { x: 0, y: 0, z: CAMERA_Z },
          { x: 0, y: 0, z: 0 },
          1000,
        );
      },
      setAutoRotate: (enabled) => {
        orbitEnabledRef.current = enabled;
      },
    };

    onReady(api);
  }, [onReady]);

  // Build adjacency for highlight
  const adjacencyMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const node of nodes) {
      map.set(node.id, new Set());
    }
    for (const l of links) {
      map.get(l.source)?.add(l.target);
      map.get(l.target)?.add(l.source);
    }
    return map;
  }, [nodes, links]);

  const highlightNodes = useMemo(() => {
    if (!highlightNodeId) return null;
    const set = new Set<string>();
    set.add(highlightNodeId);
    const neighbors = adjacencyMap.get(highlightNodeId);
    if (neighbors) {
      for (const n of neighbors) set.add(n);
    }
    return set;
  }, [highlightNodeId, adjacencyMap]);

  const highlightLinkKeys = useMemo(() => {
    if (!highlightNodeId) return null;
    const set = new Set<string>();
    for (const l of links) {
      if (l.source === highlightNodeId || l.target === highlightNodeId) {
        set.add(`${l.source}__${l.target}`);
      }
    }
    return set;
  }, [highlightNodeId, links]);

  const getNodeColor = useCallback(
    (node: GraphNode) => {
      if (node.id === centerNodeId) return "rgba(0,0,0,0)";
      if (!highlightNodes) return "rgba(168, 155, 126, 0.7)";
      if (highlightNodes.has(node.id as string))
        return "rgba(168, 155, 126, 0.9)";
      return "rgba(168, 155, 126, 0.2)";
    },
    [centerNodeId, highlightNodes],
  );

  const getLinkColor = useCallback(
    (link: { source: GraphNode | string; target: GraphNode | string }) => {
      if (!highlightLinkKeys) return "rgba(139, 125, 94, 0.15)";
      const sourceId =
        typeof link.source === "object"
          ? (link.source.id as string)
          : link.source;
      const targetId =
        typeof link.target === "object"
          ? (link.target.id as string)
          : link.target;
      const key = `${sourceId}__${targetId}`;
      if (highlightLinkKeys.has(key)) return "rgba(139, 125, 94, 0.5)";
      return "rgba(139, 125, 94, 0.06)";
    },
    [highlightLinkKeys],
  );

  const getLinkWidth = useCallback(
    (link: { source: GraphNode | string; target: GraphNode | string }) => {
      if (!highlightLinkKeys) return 0.5;
      const sourceId =
        typeof link.source === "object"
          ? (link.source.id as string)
          : link.source;
      const targetId =
        typeof link.target === "object"
          ? (link.target.id as string)
          : link.target;
      const key = `${sourceId}__${targetId}`;
      return highlightLinkKeys.has(key) ? 1.5 : 0.3;
    },
    [highlightLinkKeys],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height, position: "relative" }}
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeColor={getNodeColor}
        nodeVal={(node: GraphNode) =>
          node.id === centerNodeId ? 0.1 : 4
        }
        nodeLabel={() => ""}
        nodeOpacity={0.85}
        nodeResolution={16}
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkOpacity={1}
        enableNodeDrag={false}
        enableNavigationControls={true}
        enablePointerInteraction={false}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        warmupTicks={200}
        cooldownTime={5000}
      />
    </div>
  );
}

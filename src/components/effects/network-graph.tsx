"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, {
  type ForceGraphMethods,
  type NodeObject,
} from "react-force-graph-3d";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  Vector2,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  SRGBColorSpace,
} from "three";
import type { NetworkNode, NetworkLink } from "@/lib/network-data";
import { TerminalTooltip } from "./terminal-tooltip";

interface NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  centerNodeId?: string;
  height?: number;
  className?: string;
}

type GraphNode = NodeObject<NetworkNode>;

// Create a Three.js text sprite (canvas-rendered) to label the hub node
function createTextSprite(text: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1024;
  canvas.height = 128;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "800 64px monospace";
  ctx.letterSpacing = "8px";
  ctx.fillStyle = "#4af0ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new Sprite(material);
  sprite.scale.set(70, 9, 1);
  sprite.position.set(0, -18, 0);
  return sprite;
}

export function NetworkGraph({
  nodes,
  links,
  centerNodeId = "amg",
  height = 600,
  className,
}: NetworkGraphProps) {
  const fgRef = useRef<ForceGraphMethods<GraphNode>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height });
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(
    new Set(),
  );
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [tooltipScreenPos, setTooltipScreenPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  // Stable graph data reference — only recompute when inputs change
  const graphData = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ ...n })),
      links: links.map((l) => ({ ...l })),
    }),
    [nodes, links],
  );

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

  // Bloom post-processing + auto-rotate + force tuning
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    // Bloom glow
    const bloomPass = new UnrealBloomPass(
      new Vector2(dimensions.width, dimensions.height),
      1.5, // strength
      0.6, // radius
      0.1, // threshold
    );
    fg.postProcessingComposer().addPass(bloomPass);

    // Auto-rotate
    const controls = fg.controls() as {
      autoRotate?: boolean;
      autoRotateSpeed?: number;
    };
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
    }

    // Tune forces for a proper hub-spoke spread
    const charge = fg.d3Force("charge") as unknown as
      | { strength: (v: number) => void }
      | undefined;
    if (charge?.strength) {
      charge.strength(-120);
    }
    const link = fg.d3Force("link") as unknown as
      | { distance: (v: number) => void }
      | undefined;
    if (link?.distance) {
      link.distance(60);
    }

    // Set initial camera position
    fg.cameraPosition({ x: 0, y: 0, z: 300 });

    return () => {
      fg.postProcessingComposer().removePass(bloomPass);
    };
  }, [dimensions.width, dimensions.height]);

  // Pause auto-rotate when tooltip is visible
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const controls = fg.controls() as { autoRotate?: boolean };
    if (controls) {
      controls.autoRotate = !selectedNode;
    }
  }, [selectedNode]);

  // Build adjacency map for hover highlights
  const adjacencyMap = useRef<Map<string, Set<string>>>(new Map());
  useEffect(() => {
    const map = new Map<string, Set<string>>();
    for (const node of nodes) {
      map.set(node.id, new Set());
    }
    for (const link of links) {
      map.get(link.source)?.add(link.target);
      map.get(link.target)?.add(link.source);
    }
    adjacencyMap.current = map;
  }, [nodes, links]);

  const handleNodeHover = useCallback(
    (node: GraphNode | null) => {
      const newHighlightNodes = new Set<string>();
      const newHighlightLinks = new Set<string>();

      if (node) {
        const nodeId = node.id as string;
        newHighlightNodes.add(nodeId);
        const neighbors = adjacencyMap.current.get(nodeId);
        if (neighbors) {
          for (const neighbor of neighbors) {
            newHighlightNodes.add(neighbor);
          }
        }
        for (const link of links) {
          if (link.source === nodeId || link.target === nodeId) {
            newHighlightLinks.add(`${link.source}__${link.target}`);
          }
        }
        setHoverNode(nodeId);
      } else {
        setHoverNode(null);
      }

      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    },
    [links],
  );

  const dismissTooltip = useCallback(() => {
    setSelectedNode(null);
    setTooltipScreenPos(null);
  }, []);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      const fg = fgRef.current;
      if (!fg) return;

      // Hub node: reset camera, clear tooltip
      if (node.id === centerNodeId) {
        fg.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 1000);
        dismissTooltip();
        return;
      }

      // Non-hub: zoom toward the node but keep the constellation visible
      const nx = node.x || 0;
      const ny = node.y || 0;
      const nz = node.z || 0;

      fg.cameraPosition(
        {
          x: nx * 0.6,
          y: ny * 0.6,
          z: 220 + nz * 0.3,
        },
        { x: nx * 0.4, y: ny * 0.4, z: nz * 0.4 },
        1000,
      );

      // After zoom animation, compute screen position and show tooltip
      const clickedNode = node as NetworkNode;
      setTimeout(() => {
        const coords = fg.graph2ScreenCoords(
          node.x || 0,
          node.y || 0,
          node.z || 0,
        );
        setTooltipScreenPos({ x: coords.x, y: coords.y });
        setContainerRect(
          containerRef.current?.getBoundingClientRect() ?? null,
        );
        setSelectedNode(clickedNode);
      }, 1050);
    },
    [centerNodeId, dismissTooltip],
  );

  const handleNavigate = useCallback((href: string) => {
    if (href.startsWith("/#")) {
      const elementId = href.slice(2);
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.location.href = href;
  }, []);

  const getNodeColor = useCallback(
    (node: GraphNode) => {
      if (!hoverNode) return node.color || "#d4c9a8";
      if (highlightNodes.has(node.id as string))
        return node.color || "#d4c9a8";
      return "rgba(60, 55, 45, 0.4)";
    },
    [hoverNode, highlightNodes],
  );

  const getLinkColor = useCallback(
    (link: { source: GraphNode | string; target: GraphNode | string }) => {
      const sourceId =
        typeof link.source === "object"
          ? (link.source.id as string)
          : link.source;
      const targetId =
        typeof link.target === "object"
          ? (link.target.id as string)
          : link.target;
      const key = `${sourceId}__${targetId}`;

      if (!hoverNode) return "rgba(212, 201, 168, 0.15)";
      if (highlightLinks.has(key)) return "rgba(212, 201, 168, 0.6)";
      return "rgba(60, 55, 45, 0.08)";
    },
    [hoverNode, highlightLinks],
  );

  const getLinkWidth = useCallback(
    (link: { source: GraphNode | string; target: GraphNode | string }) => {
      const sourceId =
        typeof link.source === "object"
          ? (link.source.id as string)
          : link.source;
      const targetId =
        typeof link.target === "object"
          ? (link.target.id as string)
          : link.target;
      const key = `${sourceId}__${targetId}`;

      return highlightLinks.has(key) ? 1.5 : 0.4;
    },
    [highlightLinks],
  );

  // Custom Three.js object: extend hub node with a text label sprite
  const getNodeThreeObject = useCallback(
    (node: GraphNode) => {
      if (node.id === centerNodeId) {
        return createTextSprite(node.name || "");
      }
      return false as unknown as Sprite;
    },
    [centerNodeId],
  );

  const getNodeThreeObjectExtend = useCallback(
    (node: GraphNode) => node.id === centerNodeId,
    [centerNodeId],
  );

  const getNodeLabel = useCallback(
    (node: GraphNode) => {
      if (node.id === centerNodeId) return "";
      return `<span style="color: #d4c9a8; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">${node.name}</span>`;
    },
    [centerNodeId],
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
        nodeVal={(node: GraphNode) => node.val || 3}
        nodeLabel={getNodeLabel}
        nodeOpacity={0.9}
        nodeResolution={16}
        nodeThreeObject={getNodeThreeObject}
        nodeThreeObjectExtend={getNodeThreeObjectExtend}
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkOpacity={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={() => "rgba(212, 201, 168, 0.5)"}
        enableNodeDrag={false}
        enableNavigationControls={true}
        enablePointerInteraction={true}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.02}
        warmupTicks={200}
        cooldownTime={5000}
      />
      <TerminalTooltip
        node={selectedNode}
        screenPosition={tooltipScreenPos}
        containerRect={containerRect}
        onDismiss={dismissTooltip}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

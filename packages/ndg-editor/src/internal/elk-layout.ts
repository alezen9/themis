import type { XYPosition } from "@xyflow/react";
import type { MeasuredNodeSize } from "./graph";
import type { EditorNode } from "./node-factory";

type RunElkAutoLayoutParams = {
  measuredNodeSizesById: Record<string, MeasuredNodeSize>;
  nodesById: Map<string, EditorNode>;
};

const autoLayoutMargin = 48;
type ElkPoint = { x?: number; y?: number };
type ElkEdgeSection = {
  startPoint?: ElkPoint;
  endPoint?: ElkPoint;
  bendPoints?: ElkPoint[];
};
type ElkEdge = { id?: string; sections?: ElkEdgeSection[] };
type ElkLayoutResult = {
  children?: Array<{ id?: string; x?: number; y?: number }>;
  edges?: ElkEdge[];
};

type ElkLike = { layout: (graph: unknown) => Promise<ElkLayoutResult> };

let elkInstancePromise: Promise<ElkLike> | undefined;

const layoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.separateConnectedComponents": "true",
  "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.semiInteractive": "false",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.layered.thoroughness": "10",
  "elk.spacing.nodeNode": "96",
  "elk.layered.spacing.edgeNodeBetweenLayers": "40",
  "elk.layered.spacing.nodeNodeBetweenLayers": "176",
} as const;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toPoint = (value: ElkPoint | undefined) => {
  if (!value) return null;
  if (!isFiniteNumber(value.x) || !isFiniteNumber(value.y)) return null;

  return {
    x: value.x + autoLayoutMargin,
    y: value.y + autoLayoutMargin,
  } as const;
};

const toSectionPoints = (section: ElkEdgeSection) => {
  const startPoint = toPoint(section.startPoint);
  const endPoint = toPoint(section.endPoint);
  if (!startPoint || !endPoint) return [];

  const bendPoints = (section.bendPoints ?? [])
    .map(toPoint)
    .filter((point): point is { x: number; y: number } => point !== null);

  return [startPoint, ...bendPoints, endPoint];
};

const getElkInstance = async () => {
  if (!elkInstancePromise) {
    elkInstancePromise = import("elkjs/lib/elk.bundled.js").then(
      ({ default: ELK }) => new ELK() as unknown as ElkLike,
    );
  }

  return elkInstancePromise;
};

export const runElkAutoLayout = async ({
  measuredNodeSizesById,
  nodesById,
}: RunElkAutoLayoutParams) => {
  const orderedNodes = [...nodesById.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  const orderedEdges = orderedNodes.flatMap((node) =>
    node.children.map((child) => ({
      id: `${node.id}:${child.nodeId}`,
      sources: [node.id],
      targets: [child.nodeId],
    })),
  );

  try {
    const elk = await getElkInstance();
    const layout = await elk.layout({
      id: "root",
      layoutOptions,
      children: orderedNodes.map((node) => {
        const measuredNodeSize = measuredNodeSizesById[node.id];
        return {
          id: node.id,
          width: measuredNodeSize.width,
          height: measuredNodeSize.height,
        };
      }),
      edges: orderedEdges,
    });

    const layoutById: Record<string, XYPosition> = {};
    const edgeLayoutById: Record<string, XYPosition[]> = {};
    for (const child of layout.children ?? []) {
      if (!child.id || !isFiniteNumber(child.x) || !isFiniteNumber(child.y)) {
        continue;
      }

      layoutById[child.id] = {
        x: child.x + autoLayoutMargin,
        y: child.y + autoLayoutMargin,
      };
    }

    for (const edge of layout.edges ?? []) {
      if (!edge.id) continue;

      const edgePoints = (edge.sections ?? [])
        .flatMap(toSectionPoints)
        .filter((point, index, points) => {
          if (index === 0) return true;
          const previousPoint = points[index - 1];
          if (!previousPoint) return true;
          if (previousPoint.x !== point.x) return true;
          return previousPoint.y !== point.y;
        });
      if (edgePoints.length < 2) continue;

      edgeLayoutById[edge.id] = edgePoints;
    }

    if (Object.keys(layoutById).length !== orderedNodes.length) {
      return {
        error: "Auto layout returned incomplete positions",
        layoutById: null,
        edgeLayoutById: null,
      } as const;
    }

    return { error: null, layoutById, edgeLayoutById } as const;
  } catch {
    return {
      error: "Auto layout failed",
      layoutById: null,
      edgeLayoutById: null,
    } as const;
  }
};

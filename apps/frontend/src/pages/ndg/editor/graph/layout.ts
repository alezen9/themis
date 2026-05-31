import ELK from "elkjs/lib/elk.bundled.js";

import type { EditorEdge, EditorNode } from "../document/types";

const elk = new ELK();

export const computeLayout = async (
  nodes: EditorNode[],
  edges: EditorEdge[],
): Promise<Record<string, { x: number; y: number }>> => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.layered.spacing.nodeNodeBetweenLayers": "80",
      "elk.spacing.nodeNode": "60",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    },
    children: nodes.map(n => ({ id: n.id, width: 192, height: 80 })),
    edges: edges.map(e => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layout = await elk.layout(graph);

  return Object.fromEntries(
    (layout.children ?? [])
      .filter(c => c.x !== undefined && c.y !== undefined)
      .map(c => [c.id, { x: c.x!, y: c.y! }]),
  );
};

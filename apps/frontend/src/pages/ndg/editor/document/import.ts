import { createEdgeId, createNodeId } from "./ids";
import type { EditorDocument } from "./types";

const checkNodeCount = (doc: EditorDocument) =>
  doc.nodes.filter(n => n.type === "check").length;

export const isValidFullImport = (doc: EditorDocument) =>
  checkNodeCount(doc) === 1;

export const isValidPartialImport = (doc: EditorDocument) =>
  checkNodeCount(doc) === 0;

export const remapDocumentIds = (doc: EditorDocument): EditorDocument => {
  const idMap = new Map<string, string>();
  const nodes = doc.nodes.map(node => {
    const id = createNodeId();
    idMap.set(node.id, id);
    return { ...node, id };
  });
  const edges = doc.edges.flatMap(edge => {
    const source = idMap.get(edge.source);
    const target = idMap.get(edge.target);
    if (!source || !target) return [];
    return [{ ...edge, id: createEdgeId(source, target), source, target }];
  });
  return { ...doc, nodes, edges };
};

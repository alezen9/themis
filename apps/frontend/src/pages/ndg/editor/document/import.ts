import { createEdgeId, createNodeId } from "./ids";
import { editorDocumentSchema } from "./schema";
import type { EditorDocument } from "./types";

export const parseDocumentFile = async (
  file: File,
): Promise<EditorDocument | null> => {
  try {
    const result = editorDocumentSchema.safeParse(JSON.parse(await file.text()));
    return result.success ? (result.data as EditorDocument) : null;
  } catch {
    return null;
  }
};

export const remapDocumentIds = (document: EditorDocument): EditorDocument => {
  const idMap = new Map<string, string>();
  const nodes = document.nodes.map(node => {
    const id = createNodeId();
    idMap.set(node.id, id);
    return { ...node, id };
  });
  const edges = document.edges.flatMap(edge => {
    const source = idMap.get(edge.source);
    const target = idMap.get(edge.target);
    if (!source || !target) return [];
    return [{ ...edge, id: createEdgeId(source, target), source, target }];
  });
  return { ...document, nodes, edges };
};

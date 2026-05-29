import { describe, expect, it } from "vitest";

import { remapDocumentIds } from "./import";
import { createEdgeId } from "./ids";
import { EDITOR_DOCUMENT_VERSION, type EditorDocument } from "./types";

const createDocument = (
  nodes: EditorDocument["nodes"],
  edges: EditorDocument["edges"] = [],
): EditorDocument => ({
  version: EDITOR_DOCUMENT_VERSION,
  nodes,
  edges,
});

const userInput = (id: string): EditorDocument["nodes"][number] => ({
  id,
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: id, valueType: { type: "number" } },
});

describe("remapDocumentIds", () => {
  it("assigns fresh ids to every node", () => {
    const original = createDocument([userInput("a"), userInput("b")]);
    const remapped = remapDocumentIds(original);

    const newIds = remapped.nodes.map(n => n.id);
    expect(newIds).not.toContain("a");
    expect(newIds).not.toContain("b");
    expect(new Set(newIds).size).toBe(2);
  });

  it("remaps edge endpoints and ids consistently with the new node ids", () => {
    const original = createDocument(
      [userInput("a"), userInput("b")],
      [{ id: createEdgeId("a", "b"), source: "a", target: "b" }],
    );
    const remapped = remapDocumentIds(original);

    const [a, b] = remapped.nodes.map(n => n.id);
    expect(remapped.edges).toHaveLength(1);
    expect(remapped.edges[0]).toMatchObject({
      source: a,
      target: b,
      id: createEdgeId(a, b),
    });
  });

  it("preserves node data and position", () => {
    const remapped = remapDocumentIds(createDocument([userInput("a")]));
    expect(remapped.nodes[0]).toMatchObject({
      position: { x: 0, y: 0 },
      type: "user-input",
      data: { key: "a", valueType: { type: "number" } },
    });
  });
});

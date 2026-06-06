import { describe, expect, it } from "vitest";

import { remapDocumentIds } from "./import";
import { createEdgeId } from "./ids";
import { editorDocumentSchema } from "./importExportSchema";
import { EDITOR_DOCUMENT_VERSION, type EditorDocument } from "./types";

const createDocument = (
  nodes: EditorDocument["nodes"],
  edges: EditorDocument["edges"] = [],
): EditorDocument => ({ version: EDITOR_DOCUMENT_VERSION, nodes, edges });

const userInput = (id: string): EditorDocument["nodes"][number] => ({
  id,
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: id, valueType: { type: "number" } },
});

describe("editorDocumentSchema", () => {
  it("accepts draft node data and draft edge conditions", () => {
    const document = {
      version: EDITOR_DOCUMENT_VERSION,
      nodes: [
        {
          id: "a",
          position: { x: 0, y: 0 },
          type: "user-input",
          data: { symbol: "N_{Ed}" },
        },
      ],
      edges: [
        {
          id: "a__to__b",
          source: "a",
          target: "b",
          data: { condition: { invalid: true } },
        },
      ],
    };

    expect(editorDocumentSchema.safeParse(document).success).toBe(true);
  });

  it("defaults missing node data", () => {
    const result = editorDocumentSchema.safeParse({
      version: EDITOR_DOCUMENT_VERSION,
      nodes: [{ id: "a", position: { x: 1, y: 2 }, type: "user-input" }],
      edges: [],
    });

    expect(result.success).toBe(true);
    expect(result.data?.nodes[0]).toMatchObject({
      id: "a",
      type: "user-input",
      position: { x: 1, y: 2 },
      data: {},
    });
  });

  it("rejects nodes without id, position, or type", () => {
    expect(
      editorDocumentSchema.safeParse({
        version: EDITOR_DOCUMENT_VERSION,
        nodes: [{ id: "a", type: "user-input" }],
        edges: [],
      }).success,
    ).toBe(false);
    expect(
      editorDocumentSchema.safeParse({
        version: EDITOR_DOCUMENT_VERSION,
        nodes: [{ id: "a", position: { x: 0, y: 0 } }],
        edges: [],
      }).success,
    ).toBe(false);
    expect(
      editorDocumentSchema.safeParse({
        version: EDITOR_DOCUMENT_VERSION,
        nodes: [{ position: { x: 0, y: 0 }, type: "user-input" }],
        edges: [],
      }).success,
    ).toBe(false);
  });

  it("rejects unknown node types and invalid draft data fields", () => {
    expect(
      editorDocumentSchema.safeParse({
        version: EDITOR_DOCUMENT_VERSION,
        nodes: [
          { id: "a", position: { x: 0, y: 0 }, type: "unknown", data: {} },
        ],
        edges: [],
      }).success,
    ).toBe(false);
    expect(
      editorDocumentSchema.safeParse({
        version: EDITOR_DOCUMENT_VERSION,
        nodes: [
          {
            id: "a",
            position: { x: 0, y: 0 },
            type: "user-input",
            data: { key: "" },
          },
        ],
        edges: [],
      }).success,
    ).toBe(false);
  });

  it("strips leaked keys so imported node data stays clean", () => {
    const result = editorDocumentSchema.safeParse({
      version: EDITOR_DOCUMENT_VERSION,
      nodes: [
        {
          id: "a",
          position: { x: 0, y: 0 },
          type: "user-input",
          data: { key: "a", valueType: { type: "number" }, sourceNodeId: "x" },
        },
      ],
      edges: [],
    });
    expect(result.success).toBe(true);
    expect(result.data?.nodes[0].data).not.toHaveProperty("sourceNodeId");
  });
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

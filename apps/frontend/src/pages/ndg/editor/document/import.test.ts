import { describe, expect, it } from "vitest";

import {
  isValidFullImport,
  isValidPartialImport,
  remapDocumentIds,
} from "./import";
import { createEdgeId } from "./ids";
import { EDITOR_DOCUMENT_VERSION, type EditorDocument } from "./types";

const doc = (nodes: EditorDocument["nodes"], edges: EditorDocument["edges"] = []): EditorDocument => ({
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

const check = (id: string): EditorDocument["nodes"][number] => ({
  id,
  position: { x: 0, y: 0 },
  type: "check",
  data: { key: id, valueType: { type: "number" }, verificationExpression: "x \\leq 1" },
});

describe("isValidFullImport", () => {
  it("accepts exactly one check node", () => {
    expect(isValidFullImport(doc([check("c"), userInput("a")]))).toBe(true);
  });

  it("rejects when there is no check node", () => {
    expect(isValidFullImport(doc([userInput("a")]))).toBe(false);
  });

  it("rejects when there is more than one check node", () => {
    expect(isValidFullImport(doc([check("c1"), check("c2")]))).toBe(false);
  });
});

describe("isValidPartialImport", () => {
  it("accepts a document with no check node", () => {
    expect(isValidPartialImport(doc([userInput("a"), userInput("b")]))).toBe(true);
  });

  it("rejects a document carrying a check node", () => {
    expect(isValidPartialImport(doc([check("c"), userInput("a")]))).toBe(false);
  });
});

describe("remapDocumentIds", () => {
  it("assigns fresh ids to every node", () => {
    const original = doc([userInput("a"), userInput("b")]);
    const remapped = remapDocumentIds(original);

    const newIds = remapped.nodes.map(n => n.id);
    expect(newIds).not.toContain("a");
    expect(newIds).not.toContain("b");
    expect(new Set(newIds).size).toBe(2);
  });

  it("remaps edge endpoints and ids consistently with the new node ids", () => {
    const original = doc(
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
    const remapped = remapDocumentIds(doc([userInput("a")]));
    expect(remapped.nodes[0]).toMatchObject({
      position: { x: 0, y: 0 },
      type: "user-input",
      data: { key: "a", valueType: { type: "number" } },
    });
  });
});

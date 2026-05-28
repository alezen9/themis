import { describe, expect, it } from "vitest";

import type { EditorNode } from "../document/types";
import { canConnectNodes, wouldCreateCycle } from "./rules";

const nodeA: EditorNode = {
  id: "a",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: "a", valueType: { type: "number" } },
};

const nodeB: EditorNode = {
  id: "b",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: "b", valueType: { type: "number" } },
};

const nodeC: EditorNode = {
  id: "c",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: "c", valueType: { type: "number" } },
};

const nodeById = new Map([
  ["a", nodeA],
  ["b", nodeB],
  ["c", nodeC],
]);

describe("wouldCreateCycle", () => {
  it("detects a direct cycle: A→B, adding B→A", () => {
    const adjacency = new Map([["a", new Set(["b"])]]);
    expect(wouldCreateCycle(adjacency, "b", "a")).toBe(true);
  });

  it("detects an indirect cycle in a chain: A→B→C, adding C→A", () => {
    const adjacency = new Map([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
    ]);
    expect(wouldCreateCycle(adjacency, "c", "a")).toBe(true);
  });

  it("returns false when no path from target back to source: A→B→C, adding A→C", () => {
    const adjacency = new Map([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
    ]);
    expect(wouldCreateCycle(adjacency, "a", "c")).toBe(false);
  });

  it("returns false on an empty graph", () => {
    expect(wouldCreateCycle(new Map(), "a", "b")).toBe(false);
  });
});

describe("canConnectNodes", () => {
  it("rejects a self-connection", () => {
    expect(
      canConnectNodes(nodeById, new Map(), {
        source: "a",
        target: "a",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(false);
  });

  it("rejects when source node is not in the graph", () => {
    expect(
      canConnectNodes(nodeById, new Map(), {
        source: "unknown",
        target: "b",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(false);
  });

  it("rejects when target node is not in the graph", () => {
    expect(
      canConnectNodes(nodeById, new Map(), {
        source: "a",
        target: "unknown",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(false);
  });

  it("rejects a duplicate edge", () => {
    const adjacency = new Map([["a", new Set(["b"])]]);
    expect(
      canConnectNodes(nodeById, adjacency, {
        source: "a",
        target: "b",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(false);
  });

  it("rejects a connection that would close a cycle: A→B→C, adding C→A", () => {
    const adjacency = new Map([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
    ]);
    expect(
      canConnectNodes(nodeById, adjacency, {
        source: "c",
        target: "a",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(false);
  });

  it("accepts a valid new connection", () => {
    expect(
      canConnectNodes(nodeById, new Map(), {
        source: "a",
        target: "b",
        sourceHandle: null,
        targetHandle: null,
      }),
    ).toBe(true);
  });
});

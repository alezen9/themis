import { describe, expect, it } from "vitest";
import type { Connection } from "@xyflow/react";

import type { EditorEdge, EditorNode } from "../document/types";
import { canConnectNodes } from "./rules";

const nodeA: EditorNode = {
  id: "a",
  type: "user-input",
  position: { x: 0, y: 0 },
  data: { key: "a", valueType: { type: "number" } },
};

const nodeB: EditorNode = {
  id: "b",
  type: "user-input",
  position: { x: 0, y: 0 },
  data: { key: "b", valueType: { type: "number" } },
};

const nodeC: EditorNode = {
  id: "c",
  type: "user-input",
  position: { x: 0, y: 0 },
  data: { key: "c", valueType: { type: "number" } },
};

describe("canConnectNodes", () => {
  it("allows a valid connection", () => {
    const connection: Connection = { source: "a", target: "b", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA, nodeB], [], connection)).toBe(true);
  });

  it("rejects self-connection", () => {
    const connection: Connection = { source: "a", target: "a", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA], [], connection)).toBe(false);
  });

  it("rejects connection when source node does not exist", () => {
    const connection: Connection = { source: "a", target: "b", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeB], [], connection)).toBe(false);
  });

  it("rejects connection when target node does not exist", () => {
    const connection: Connection = { source: "a", target: "b", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA], [], connection)).toBe(false);
  });

  it("rejects duplicate source-target pair", () => {
    const edgeAtoB: EditorEdge = { id: "a__to__b", source: "a", target: "b" };
    const connection: Connection = { source: "a", target: "b", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA, nodeB], [edgeAtoB], connection)).toBe(false);
  });

  it("rejects connection that would create a direct cycle", () => {
    const edgeAtoB: EditorEdge = { id: "a__to__b", source: "a", target: "b" };
    const connection: Connection = { source: "b", target: "a", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA, nodeB], [edgeAtoB], connection)).toBe(false);
  });

  it("rejects connection that would create an indirect cycle", () => {
    const edgeAtoB: EditorEdge = { id: "a__to__b", source: "a", target: "b" };
    const edgeBtoC: EditorEdge = { id: "b__to__c", source: "b", target: "c" };
    const connection: Connection = { source: "c", target: "a", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA, nodeB, nodeC], [edgeAtoB, edgeBtoC], connection)).toBe(false);
  });

  it("allows connection between distinct subtrees", () => {
    const edgeAtoB: EditorEdge = { id: "a__to__b", source: "a", target: "b" };
    const connection: Connection = { source: "a", target: "c", sourceHandle: null, targetHandle: null };
    expect(canConnectNodes([nodeA, nodeB, nodeC], [edgeAtoB], connection)).toBe(true);
  });
});

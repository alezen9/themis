import { describe, expect, it, vi } from "vitest";
import type { Connection } from "@xyflow/react";

import type { EditorEdge, EditorNode } from "../document/types";
import { onConnectNodesFactory } from "./actions";

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

const edgeAtoB: EditorEdge = { id: "a__to__b", source: "a", target: "b" };
const connectAtoB: Connection = { source: "a", target: "b", sourceHandle: null, targetHandle: null };

const reactFlowMock = (nodes: EditorNode[], initialEdges: EditorEdge[]) => {
  let edges = [...initialEdges];
  return {
    getNodes: vi.fn(() => nodes),
    setEdges: vi.fn((updater: EditorEdge[] | ((edges: EditorEdge[]) => EditorEdge[])) => {
      edges = typeof updater === "function" ? updater(edges) : updater;
    }),
    currentEdges: () => edges,
  };
};

describe("onConnectNodesFactory", () => {
  it("adds a single custom id edge when no prior edges exist", () => {
    const flow = reactFlowMock([nodeA, nodeB], []);
    onConnectNodesFactory(flow)(connectAtoB);

    expect(flow.setEdges).toHaveBeenCalledOnce();
    expect(flow.currentEdges()).toHaveLength(1);
    expect(flow.currentEdges()[0].id).toBe("a__to__b");
  });

  it("replaces react flow auto-added edge with custom id edge", () => {
    const reactFlowEdge: EditorEdge = { id: "reactflow__edge-ab", source: "a", target: "b" };
    const flow = reactFlowMock([nodeA, nodeB], [reactFlowEdge]);
    onConnectNodesFactory(flow)(connectAtoB);

    expect(flow.currentEdges()).toHaveLength(1);
    expect(flow.currentEdges()[0].id).toBe("a__to__b");
  });

  it("removes react flow auto-edge and adds nothing when connection would create a cycle", () => {
    const reactFlowEdgeBtoA: EditorEdge = { id: "reactflow__edge-ba", source: "b", target: "a" };
    const connectionBtoA: Connection = { source: "b", target: "a", sourceHandle: null, targetHandle: null };
    const flow = reactFlowMock([nodeA, nodeB], [edgeAtoB, reactFlowEdgeBtoA]);
    onConnectNodesFactory(flow)(connectionBtoA);

    expect(flow.currentEdges()).toEqual([edgeAtoB]);
  });

  it("removes react flow auto-edge and adds nothing when custom edge already exists", () => {
    const reactFlowEdge: EditorEdge = { id: "reactflow__edge-ab", source: "a", target: "b" };
    const flow = reactFlowMock([nodeA, nodeB], [edgeAtoB, reactFlowEdge]);
    onConnectNodesFactory(flow)(connectAtoB);

    expect(flow.currentEdges()).toEqual([edgeAtoB]);
  });

  it("does nothing when source is empty", () => {
    const flow = reactFlowMock([nodeA, nodeB], []);
    onConnectNodesFactory(flow)({ source: "", target: "b", sourceHandle: null, targetHandle: null });

    expect(flow.setEdges).not.toHaveBeenCalled();
  });
});

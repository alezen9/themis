import { beforeEach, describe, expect, it } from "vitest";

import { createEdgeId } from "../document/ids";
import type { EditorEdge, EditorNode } from "../document/types";
import type { AddNodeInput } from "./actions";
import { useNdgEditorStore } from "./useNdgEditorStore";

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

const edgeAtoB: EditorEdge = {
  id: createEdgeId("a", "b"),
  source: "a",
  target: "b",
};

const baseAddNodeInput: Omit<AddNodeInput, "type" | "sourceNodeId"> = {
  key: "x",
  expression: "",
  formulaRef: "",
  paragraphRef: "",
  position: { x: 0, y: 0 },
  sectionRef: "",
  source: "",
  subParagraphRef: "",
  symbol: "",
  tableRef: "",
  unit: "",
  valueType: "number",
  verificationExpression: "",
  verificationRef: "",
};

beforeEach(() => {
  useNdgEditorStore.setState({
    nodes: [nodeA, nodeB, nodeC],
    edges: [],
    _nodeById: new Map([
      ["a", nodeA],
      ["b", nodeB],
      ["c", nodeC],
    ]),
    _edgeById: new Map(),
    _adjacency: new Map(),
    modal: undefined,
  });
});

describe("onConnectNodes", () => {
  it("adds an edge with the source__to__target id convention", () => {
    useNdgEditorStore.getState().onConnectNodes({
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    });

    const { edges, _edgeById, _adjacency } = useNdgEditorStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].id).toBe("a__to__b");
    expect(_edgeById.has("a__to__b")).toBe(true);
    expect(_adjacency.get("a")?.has("b")).toBe(true);
  });

  it("ignores a duplicate connection", () => {
    const conn = {
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    };
    useNdgEditorStore.getState().onConnectNodes(conn);
    useNdgEditorStore.getState().onConnectNodes(conn);

    expect(useNdgEditorStore.getState().edges).toHaveLength(1);
  });

  it("ignores a connection that would create a cycle: A→B→C then C→A", () => {
    const store = useNdgEditorStore.getState();
    store.onConnectNodes({ source: "a", target: "b", sourceHandle: null, targetHandle: null });
    store.onConnectNodes({ source: "b", target: "c", sourceHandle: null, targetHandle: null });
    store.onConnectNodes({ source: "c", target: "a", sourceHandle: null, targetHandle: null });

    expect(useNdgEditorStore.getState().edges).toHaveLength(2);
  });
});

describe("onEdgesChange — remove", () => {
  it("removes the edge from edges, _edgeById, and _adjacency", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
      _adjacency: new Map([["a", new Set(["b"])]]),
    });

    useNdgEditorStore.getState().onEdgesChange([{ type: "remove", id: edgeAtoB.id }]);

    const { edges, _edgeById, _adjacency } = useNdgEditorStore.getState();
    expect(edges).toHaveLength(0);
    expect(_edgeById.has(edgeAtoB.id)).toBe(false);
    expect(_adjacency.has("a")).toBe(false);
  });
});

describe("addNode", () => {
  it("adds the node and a connecting edge when sourceNodeId is provided", () => {
    useNdgEditorStore.getState().addNode({
      ...baseAddNodeInput,
      type: "user-input",
      sourceNodeId: "a",
    });

    const { nodes, edges, _adjacency } = useNdgEditorStore.getState();
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(1);
    const newNode = nodes[3];
    expect(edges[0].id).toBe(createEdgeId("a", newNode.id));
    expect(_adjacency.get("a")?.has(newNode.id)).toBe(true);
  });

  it("adds only the node when no sourceNodeId is provided", () => {
    useNdgEditorStore.getState().addNode({
      ...baseAddNodeInput,
      type: "user-input",
    });

    const { nodes, edges } = useNdgEditorStore.getState();
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(0);
  });
});

describe("duplicate edge regression", () => {
  it("produces exactly one edge after deleting and reconnecting the same pair", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
      _adjacency: new Map([["a", new Set(["b"])]]),
    });

    useNdgEditorStore.getState().onEdgesChange([{ type: "remove", id: edgeAtoB.id }]);
    useNdgEditorStore.getState().onConnectNodes({
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    });

    const { edges } = useNdgEditorStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].id).toBe("a__to__b");
  });
});

import { beforeEach, describe, expect, it } from "vitest";

import { createEdgeId } from "../document/ids";
import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
  type EditorEdge,
  type EditorNode,
} from "../document/types";
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
      type: "user-input",
      key: "x",
      valueType: { type: "number" },
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
      type: "user-input",
      key: "x",
      valueType: { type: "number" },
    });

    const { nodes, edges } = useNdgEditorStore.getState();
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(0);
  });
});

const checkNode: EditorNode = {
  id: "chk",
  position: { x: 0, y: 0 },
  type: "check",
  data: { key: "chk", valueType: { type: "number" }, verificationExpression: "x \\leq 1" },
};

const docOf = (
  nodes: EditorNode[],
  edges: EditorEdge[] = [],
): EditorDocument => ({ version: EDITOR_DOCUMENT_VERSION, nodes, edges });

describe("importFull", () => {
  it("replaces the graph and rebuilds the lookup maps when it has one check", () => {
    const ok = useNdgEditorStore
      .getState()
      .importFull(docOf([checkNode, nodeA], [edgeAtoB]));

    const { nodes, edges, _nodeById, _edgeById } = useNdgEditorStore.getState();
    expect(ok).toBe(true);
    expect(nodes.map(n => n.id).sort()).toEqual(["a", "chk"]);
    expect(_nodeById.has("chk")).toBe(true);
    expect(_nodeById.has("b")).toBe(false);
    expect(edges).toHaveLength(1);
    expect(_edgeById.has(edgeAtoB.id)).toBe(true);
  });

  it("rejects and leaves the graph untouched when there is no check", () => {
    const ok = useNdgEditorStore.getState().importFull(docOf([nodeA]));

    expect(ok).toBe(false);
    expect(useNdgEditorStore.getState().nodes).toHaveLength(3);
  });
});

describe("importPartial", () => {
  it("merges with fresh ids that do not collide with existing nodes", () => {
    const imported = docOf(
      [nodeA, nodeB],
      [{ id: createEdgeId("a", "b"), source: "a", target: "b" }],
    );
    const ok = useNdgEditorStore.getState().importPartial(imported);

    const { nodes, edges, _adjacency } = useNdgEditorStore.getState();
    expect(ok).toBe(true);
    expect(nodes).toHaveLength(5);
    expect(nodes.map(n => n.id).filter(id => id === "a")).toHaveLength(1);
    expect(new Set(nodes.map(n => n.id)).size).toBe(5);

    const newEdge = edges[edges.length - 1];
    expect(newEdge.source).not.toBe("a");
    expect(_adjacency.get(newEdge.source)?.has(newEdge.target)).toBe(true);
  });

  it("rejects and leaves the graph untouched when it carries a check", () => {
    const ok = useNdgEditorStore
      .getState()
      .importPartial(docOf([checkNode, nodeA]));

    expect(ok).toBe(false);
    expect(useNdgEditorStore.getState().nodes).toHaveLength(3);
  });
});

describe("export", () => {
  it("exportDocument returns every node and edge with the version", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
    });

    const exported = useNdgEditorStore.getState().exportDocument();
    expect(exported.version).toBe(EDITOR_DOCUMENT_VERSION);
    expect(exported.nodes).toHaveLength(3);
    expect(exported.edges).toEqual([edgeAtoB]);
  });

  it("exportSelected keeps only selected nodes and their internal edges", () => {
    useNdgEditorStore.setState({
      nodes: [
        { ...nodeA, selected: true },
        { ...nodeB, selected: true },
        { ...nodeC, selected: false },
      ],
      edges: [
        edgeAtoB,
        { id: createEdgeId("b", "c"), source: "b", target: "c" },
      ],
    });

    const exported = useNdgEditorStore.getState().exportSelected();
    expect(exported.nodes.map(n => n.id).sort()).toEqual(["a", "b"]);
    expect(exported.edges).toHaveLength(1);
    expect(exported.edges[0].id).toBe(edgeAtoB.id);
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

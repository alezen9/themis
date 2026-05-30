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

const checkNode: EditorNode = {
  id: "chk",
  position: { x: 0, y: 0 },
  type: "check",
  data: {
    key: "chk",
    valueType: { type: "number" },
    verificationExpression: "x \\leq 1",
  },
};

const createDocument = (
  nodes: EditorNode[],
  edges: EditorEdge[] = [],
): EditorDocument => ({ version: EDITOR_DOCUMENT_VERSION, nodes, edges });

beforeEach(() => {
  useNdgEditorStore.setState({
    nodes: [nodeA, nodeB, nodeC],
    edges: [],
    selectedNodes: [],
    selectedEdges: [],
    _nodeById: new Map([
      ["a", nodeA],
      ["b", nodeB],
      ["c", nodeC],
    ]),
    _edgeById: new Map(),
    _adjacencyList: new Map(),
    _keyCounts: new Map([
      ["a", 1],
      ["b", 1],
      ["c", 1],
    ]),
    _invalidNodeIds: new Set(),
    _unreachableNodeIds: new Set(),
    _invalidEdgeIds: new Set(),
  });
});

describe("onConnectNodes", () => {
  it("adds an edge with the source__to__target id convention", () => {
    useNdgEditorStore
      .getState()
      .onConnectNodes({
        source: "a",
        target: "b",
        sourceHandle: null,
        targetHandle: null,
      });

    const { edges, _edgeById, _adjacencyList } = useNdgEditorStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].id).toBe("a__to__b");
    expect(_edgeById.has("a__to__b")).toBe(true);
    expect(_adjacencyList.get("a")?.has("b")).toBe(true);
  });

  it("ignores a duplicate connection", () => {
    const connection = {
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    };
    useNdgEditorStore.getState().onConnectNodes(connection);
    useNdgEditorStore.getState().onConnectNodes(connection);

    expect(useNdgEditorStore.getState().edges).toHaveLength(1);
  });

  it("ignores a connection that would create a cycle: A→B→C then C→A", () => {
    const store = useNdgEditorStore.getState();
    store.onConnectNodes({
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    });
    store.onConnectNodes({
      source: "b",
      target: "c",
      sourceHandle: null,
      targetHandle: null,
    });
    store.onConnectNodes({
      source: "c",
      target: "a",
      sourceHandle: null,
      targetHandle: null,
    });

    expect(useNdgEditorStore.getState().edges).toHaveLength(2);
  });
});

describe("onEdgesChange — remove", () => {
  it("removes the edge from edges, _edgeById, and _adjacencyList", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
      _adjacencyList: new Map([["a", new Set(["b"])]]),
    });

    useNdgEditorStore
      .getState()
      .onEdgesChange([{ type: "remove", id: edgeAtoB.id }]);

    const { edges, _edgeById, _adjacencyList } = useNdgEditorStore.getState();
    expect(edges).toHaveLength(0);
    expect(_edgeById.has(edgeAtoB.id)).toBe(false);
    expect(_adjacencyList.has("a")).toBe(false);
  });
});

describe("onNodesChange — remove", () => {
  it("drops the node from _nodeById and decrements its key count", () => {
    useNdgEditorStore
      .getState()
      .addNode({ type: "user-input", key: "a", valueType: { type: "number" } });
    const addedId = useNdgEditorStore.getState().nodes.at(-1)!.id;
    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(true);

    useNdgEditorStore
      .getState()
      .onNodesChange([{ type: "remove", id: addedId }]);

    const { nodes, _nodeById } = useNdgEditorStore.getState();
    expect(nodes.map(n => n.id)).not.toContain(addedId);
    expect(_nodeById.has(addedId)).toBe(false);
    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(false);
  });
});

describe("addNode", () => {
  it("adds the node and a connecting edge when sourceNodeId is provided", () => {
    useNdgEditorStore
      .getState()
      .addNode({
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        sourceNodeId: "a",
      });

    const { nodes, edges, _adjacencyList } = useNdgEditorStore.getState();
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(1);
    const newNode = nodes[3];
    expect(edges[0].id).toBe(createEdgeId("a", newNode.id));
    expect(_adjacencyList.get("a")?.has(newNode.id)).toBe(true);
  });

  it("adds only the node when no sourceNodeId is provided", () => {
    useNdgEditorStore
      .getState()
      .addNode({ type: "user-input", key: "x", valueType: { type: "number" } });

    const { nodes, edges } = useNdgEditorStore.getState();
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(0);
  });
});

describe("importFull", () => {
  it("replaces the graph and rebuilds the lookup maps when it has one check", () => {
    const ok = useNdgEditorStore
      .getState()
      .importFull(createDocument([checkNode, nodeA], [edgeAtoB]));

    const { nodes, edges, _nodeById, _edgeById } = useNdgEditorStore.getState();
    expect(ok).toBe(true);
    expect(nodes.map(n => n.id).sort()).toEqual(["a", "chk"]);
    expect(_nodeById.has("chk")).toBe(true);
    expect(_nodeById.has("b")).toBe(false);
    expect(edges).toHaveLength(1);
    expect(_edgeById.has(edgeAtoB.id)).toBe(true);
  });

  it("rejects and leaves the graph untouched when there is no check", () => {
    const ok = useNdgEditorStore.getState().importFull(createDocument([nodeA]));

    expect(ok).toBe(false);
    expect(useNdgEditorStore.getState().nodes).toHaveLength(3);
  });
});

describe("importPartial", () => {
  it("merges with fresh ids that do not collide with existing nodes", () => {
    const imported = createDocument(
      [nodeA, nodeB],
      [{ id: createEdgeId("a", "b"), source: "a", target: "b" }],
    );
    const ok = useNdgEditorStore.getState().importPartial(imported);

    const { nodes, edges, _adjacencyList } = useNdgEditorStore.getState();
    expect(ok).toBe(true);
    expect(nodes).toHaveLength(5);
    expect(nodes.map(n => n.id).filter(id => id === "a")).toHaveLength(1);
    expect(new Set(nodes.map(n => n.id)).size).toBe(5);

    const newEdge = edges[edges.length - 1];
    expect(newEdge.source).not.toBe("a");
    expect(_adjacencyList.get(newEdge.source)?.has(newEdge.target)).toBe(true);
  });

  it("rejects and leaves the graph untouched when it carries a check", () => {
    const ok = useNdgEditorStore
      .getState()
      .importPartial(createDocument([checkNode, nodeA]));

    expect(ok).toBe(false);
    expect(useNdgEditorStore.getState().nodes).toHaveLength(3);
  });
});

describe("updateNode", () => {
  it("keeps the latest dragged position when editing", () => {
    useNdgEditorStore
      .getState()
      .onNodesChange([
        { type: "position", id: "a", position: { x: 120, y: 80 } },
      ]);

    useNdgEditorStore
      .getState()
      .updateNode({
        id: "a",
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
      });

    const node = useNdgEditorStore.getState().nodes.find(n => n.id === "a");
    expect(node?.position).toEqual({ x: 120, y: 80 });
  });
});

describe("setEdgeCondition", () => {
  it("sets and clears the condition on an edge", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
    });

    useNdgEditorStore
      .getState()
      .setEdgeCondition(edgeAtoB.id, { eq: ["section_class", { value: 1 }] });
    expect(
      useNdgEditorStore.getState().getEdgeById(edgeAtoB.id)?.data?.condition,
    ).toEqual({ eq: ["section_class", { value: 1 }] });

    useNdgEditorStore.getState().setEdgeCondition(edgeAtoB.id, undefined);
    expect(
      useNdgEditorStore.getState().getEdgeById(edgeAtoB.id)?.data?.condition,
    ).toBeUndefined();
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
      nodes: [nodeA, nodeB, nodeC],
      selectedNodes: [nodeA, nodeB],
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

describe("duplicate keys", () => {
  it("flags a key as duplicate once a second node shares it", () => {
    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(false);

    useNdgEditorStore
      .getState()
      .addNode({ type: "user-input", key: "a", valueType: { type: "number" } });

    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(true);
  });

  it("moves the count from the old key to the new one on update", () => {
    useNdgEditorStore
      .getState()
      .updateNode({
        id: "a",
        type: "user-input",
        key: "b",
        valueType: { type: "number" },
      });

    const store = useNdgEditorStore.getState();
    expect(store.isDuplicateKey("b")).toBe(true);
    expect(store.isDuplicateKey("a")).toBe(false);
  });

  it("clears the duplicate flag when one of the colliding nodes is deleted", () => {
    const duplicate: EditorNode = {
      id: "a2",
      position: { x: 0, y: 0 },
      type: "user-input",
      data: { key: "a", valueType: { type: "number" } },
    };
    useNdgEditorStore.setState({
      nodes: [nodeA, duplicate],
      selectedNodes: [duplicate],
      _nodeById: new Map([
        ["a", nodeA],
        ["a2", duplicate],
      ]),
      _keyCounts: new Map([["a", 2]]),
    });

    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(true);
    useNdgEditorStore.getState().deleteSelected();
    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(false);
  });

  it("rebuilds the counts on a full import", () => {
    const duplicate: EditorNode = { ...nodeA, id: "a2" };
    useNdgEditorStore
      .getState()
      .importFull(createDocument([checkNode, nodeA, duplicate]));

    const store = useNdgEditorStore.getState();
    expect(store.isDuplicateKey("a")).toBe(true);
    expect(store.isDuplicateKey("chk")).toBe(false);
  });

  it("counts a merged key against the existing graph on a partial import", () => {
    useNdgEditorStore.getState().importPartial(createDocument([nodeA]));

    expect(useNdgEditorStore.getState().isDuplicateKey("a")).toBe(true);
  });
});

describe("live validation", () => {
  const invalidNode: EditorNode = {
    id: "bad",
    position: { x: 0, y: 0 },
    type: "user-input",
    data: { key: "", valueType: { type: "number" } },
  };

  it("clears a node's invalid flag when it is edited", () => {
    useNdgEditorStore.setState({ _invalidNodeIds: new Set(["a"]) });
    expect(useNdgEditorStore.getState().isInvalidNode("a")).toBe(true);

    useNdgEditorStore
      .getState()
      .updateNode({
        id: "a",
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
      });

    expect(useNdgEditorStore.getState().isInvalidNode("a")).toBe(false);
  });

  it("auto-validates on a full import", () => {
    useNdgEditorStore
      .getState()
      .importFull(createDocument([checkNode, invalidNode]));

    expect(useNdgEditorStore.getState().isInvalidNode("bad")).toBe(true);
  });

  it("flags an edge live when its condition references an unknown key", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
    });

    useNdgEditorStore
      .getState()
      .setEdgeCondition(edgeAtoB.id, { eq: ["nope", { value: 1 }] });
    expect(useNdgEditorStore.getState().isInvalidEdge(edgeAtoB.id)).toBe(true);

    useNdgEditorStore.getState().setEdgeCondition(edgeAtoB.id, undefined);
    expect(useNdgEditorStore.getState().isInvalidEdge(edgeAtoB.id)).toBe(false);
  });

  it("flags nodes that are not reachable from the check", () => {
    const orphan: EditorNode = {
      id: "orphan",
      position: { x: 0, y: 0 },
      type: "user-input",
      data: { key: "orphan", valueType: { type: "number" } },
    };
    useNdgEditorStore
      .getState()
      .importFull(
        createDocument(
          [checkNode, nodeA, orphan],
          [{ id: createEdgeId("chk", "a"), source: "chk", target: "a" }],
        ),
      );

    const store = useNdgEditorStore.getState();
    expect(store.isUnreachableNode("orphan")).toBe(true);
    expect(store.isUnreachableNode("a")).toBe(false);
    expect(store.isUnreachableNode("chk")).toBe(false);
  });
});

describe("duplicate edge regression", () => {
  it("produces exactly one edge after deleting and reconnecting the same pair", () => {
    useNdgEditorStore.setState({
      edges: [edgeAtoB],
      _edgeById: new Map([[edgeAtoB.id, edgeAtoB]]),
      _adjacencyList: new Map([["a", new Set(["b"])]]),
    });

    useNdgEditorStore
      .getState()
      .onEdgesChange([{ type: "remove", id: edgeAtoB.id }]);
    useNdgEditorStore
      .getState()
      .onConnectNodes({
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

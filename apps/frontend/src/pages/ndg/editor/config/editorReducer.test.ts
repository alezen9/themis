import type { Node } from "@ndg/ndg-core";
import type { Connection } from "@xyflow/react";
import { describe, expect, it } from "vitest";
import { editorReducer } from "./editorReducer";
import type { EditorState } from "./graph";
import { createNodeDraft } from "./nodeFactory";

const checkNode = {
  id: "check",
  type: "check",
  key: "check_1",
  name: "Check",
  children: [],
  valueType: { type: "number" },
  verificationExpression: "\\eta \\leq 1.0",
} satisfies Node;

const inputNode = {
  id: "input",
  type: "user-input",
  key: "N_Ed_kN",
  name: "Axial force",
  children: [],
  valueType: { type: "number" },
} satisfies Node;

const secondInputNode = {
  id: "second-input",
  type: "user-input",
  key: "M_y_Ed_kNm",
  name: "Major-axis moment",
  children: [],
  valueType: { type: "number" },
} satisfies Node;

const createState = (nodes: readonly Node[]): EditorState => ({
  nodesById: new Map(nodes.map((node) => [node.id, node])),
  layoutById: Object.fromEntries(
    nodes.map((node, index) => [node.id, { x: index * 100, y: index * 80 }]),
  ),
  edgeLayoutById: {},
  measuredById: {},
  editingNodeId: null,
  dialogError: null,
  autoLayoutError: null,
  autoLayoutVersion: 0,
});

describe("[NDG] editorReducer", () => {
  it("adds a child node and opens it for editing", () => {
    const state = createState([checkNode]);
    const nextState = editorReducer(state, {
      type: "addChild",
      parentId: "check",
    });

    const nextCheckNode = nextState.nodesById.get("check");
    const [child] = nextCheckNode?.children ?? [];

    expect(nextState.nodesById.size).toBe(2);
    expect(child).toBeDefined();
    expect(child ? nextState.nodesById.get(child.nodeId)?.type : null).toBe(
      "user-input",
    );
    expect(nextState.editingNodeId).toBe(child?.nodeId);
  });

  it("connects and deletes nodes while pruning stale edges", () => {
    const state = createState([checkNode, inputNode]);
    const connectedState = editorReducer(state, {
      type: "applyConnection",
      connection: {
        source: "check",
        sourceHandle: null,
        target: "input",
        targetHandle: null,
      } satisfies Connection,
    });

    expect(connectedState.nodesById.get("check")?.children).toEqual([
      { nodeId: "input" },
    ]);

    const deletedState = editorReducer(connectedState, {
      type: "deleteNodes",
      nodeIds: ["input"],
    });

    expect(deletedState.nodesById.has("input")).toBe(false);
    expect(deletedState.nodesById.get("check")?.children).toEqual([]);
  });

  it("saves node edits and blocks duplicate keys", () => {
    const state = createState([checkNode, inputNode, secondInputNode]);
    const renamedDraft = {
      ...createNodeDraft(secondInputNode),
      key: "M_z_Ed_kNm",
      name: "Minor-axis moment",
    };

    const renamedState = editorReducer(state, {
      type: "saveNode",
      nodeId: "second-input",
      draft: renamedDraft,
    });

    expect(renamedState.dialogError).toBeNull();
    expect(renamedState.editingNodeId).toBeNull();
    expect(renamedState.nodesById.get("second-input")?.key).toBe("M_z_Ed_kNm");
    expect(renamedState.nodesById.get("second-input")?.name).toBe(
      "Minor-axis moment",
    );

    const duplicateKeyState = editorReducer(state, {
      type: "saveNode",
      nodeId: "second-input",
      draft: { ...createNodeDraft(secondInputNode), key: "N_Ed_kN" },
    });

    expect(duplicateKeyState.dialogError).toBe(
      'Another node already uses the key "N_Ed_kN".',
    );
    expect(duplicateKeyState.nodesById.get("second-input")?.key).toBe(
      "M_y_Ed_kNm",
    );
  });
});

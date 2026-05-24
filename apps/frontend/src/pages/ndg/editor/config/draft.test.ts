import type { Node } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";
import {
  draftToEditorState,
  editorStateToDraft,
  ndgEditorDraftFormat,
  ndgEditorDraftVersion,
} from "./draft";
import type { EditorState } from "./graph";

const checkNode = {
  id: "check",
  type: "check",
  key: "check_1",
  name: "Check",
  children: [{ nodeId: "input" }],
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
  unit: "\\mathrm{kN}",
} satisfies Node;

const createState = (nodes: readonly Node[]): EditorState => ({
  nodesById: new Map(nodes.map((node) => [node.id, node])),
  layoutById: { check: { x: 10, y: 20 }, input: { x: 30, y: 40 } },
  edgeLayoutById: {},
  measuredById: {},
  editingNodeId: null,
  dialogError: null,
  autoLayoutError: null,
  autoLayoutVersion: 0,
});

describe("[NDG] draft", () => {
  it("roundtrips editor state through the draft format", () => {
    const state = createState([checkNode, inputNode]);
    const draft = editorStateToDraft(state);
    const parsed = draftToEditorState(draft);

    expect(draft).toMatchObject({
      format: ndgEditorDraftFormat,
      version: ndgEditorDraftVersion,
      layoutById: state.layoutById,
    });
    expect(parsed.error).toBeNull();
    expect(parsed.state?.nodesById.get("check")).toEqual(checkNode);
    expect(parsed.state?.nodesById.get("input")).toEqual(inputNode);
    expect(parsed.state?.layoutById).toEqual(state.layoutById);
  });

  it("rejects invalid drafts before hydrating the editor", () => {
    expect(draftToEditorState(null).error).toBe("Draft must be a JSON object");

    expect(
      draftToEditorState({
        format: "wrong-format",
        version: ndgEditorDraftVersion,
        nodesById: {},
        layoutById: {},
      }).error,
    ).toBe(`Draft format must be "${ndgEditorDraftFormat}"`);

    expect(
      draftToEditorState({
        format: ndgEditorDraftFormat,
        version: ndgEditorDraftVersion,
        nodesById: { check: { ...checkNode, id: "other-id" } },
        layoutById: {},
      }).error,
    ).toBe('Draft node key "check" must match node.id');
  });
});

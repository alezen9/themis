import { describe, expect, it } from "vitest";

import type { EditorEdge, EditorNode } from "../document/types";
import { findInvalidEdgeIds, findInvalidNodeIds } from "./validate";

const valid: EditorNode = {
  id: "valid",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: "fy_MPa", valueType: { type: "number" } },
};

const missingKey: EditorNode = {
  id: "missing-key",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: "", valueType: { type: "number" } },
};

const missingExpression: EditorNode = {
  id: "missing-expression",
  position: { x: 0, y: 0 },
  type: "check",
  data: {
    key: "utilisation",
    name: "Check",
    valueType: { type: "number" },
    verificationExpression: "",
  },
};

describe("findInvalidNodeIds", () => {
  it("returns the ids of only the incomplete nodes", () => {
    const invalid = findInvalidNodeIds([valid, missingKey, missingExpression]);
    expect(invalid).toEqual(new Set(["missing-key", "missing-expression"]));
  });
});

const graphKeyNode: EditorNode = {
  id: "ratio",
  position: { x: 0, y: 0 },
  type: "coefficient",
  data: { key: "ratio", valueType: { type: "number" } },
};

const edge = (id: string, data?: EditorEdge["data"]): EditorEdge => ({
  id,
  source: "a",
  target: "b",
  data,
});

describe("findInvalidEdgeIds", () => {
  it("flags an edge whose condition references an unknown key", () => {
    const edges = [edge("bad", { condition: { eq: ["nope", { value: 1 }] } })];
    expect(findInvalidEdgeIds([graphKeyNode], edges)).toEqual(new Set(["bad"]));
  });

  it("accepts catalog keys and graph node keys", () => {
    const edges = [
      edge("input", { condition: { eq: ["section_class", { value: 1 }] } }),
      edge("graph", { condition: { gt: ["ratio", { value: 0 }] } }),
    ];
    expect(findInvalidEdgeIds([graphKeyNode], edges)).toEqual(new Set());
  });

  it("ignores edges without a condition", () => {
    expect(findInvalidEdgeIds([graphKeyNode], [edge("plain")])).toEqual(
      new Set(),
    );
  });
});

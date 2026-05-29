import { describe, expect, it } from "vitest";

import type { EditorNode } from "../document/types";
import { findInvalidNodeIds } from "./validate";

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
  data: { key: "ratio", valueType: { type: "number" }, verificationExpression: "" },
};

describe("findInvalidNodeIds", () => {
  it("returns the ids of only the incomplete nodes", () => {
    const invalid = findInvalidNodeIds([valid, missingKey, missingExpression]);
    expect(invalid).toEqual(new Set(["missing-key", "missing-expression"]));
  });
});

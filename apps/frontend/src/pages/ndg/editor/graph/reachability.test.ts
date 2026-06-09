import { describe, expect, it } from "vitest";

import type { EditorEdge, EditorNode } from "../document/types";
import { findUnreachableNodeIds } from "./reachability";

const checkNode: EditorNode = {
  id: "chk",
  position: { x: 0, y: 0 },
  type: "check",
  data: {
    variant: "compute",
    key: "utilisation",
    name: "Check",
    valueType: { type: "number" },
    template: "x \\leq 1",
  },
};

const userInput = (id: string): EditorNode => ({
  id,
  position: { x: 0, y: 0 },
  type: "user-input",
  data: { key: id, valueType: { type: "number" } },
});

const edge = (source: string, target: string): EditorEdge => ({
  id: `${source}__to__${target}`,
  source,
  target,
});

describe("findUnreachableNodeIds", () => {
  it("returns nothing when every node is reachable from the check", () => {
    const nodes = [checkNode, userInput("a"), userInput("b")];
    const edges = [edge("chk", "a"), edge("a", "b")];
    expect(findUnreachableNodeIds(nodes, edges)).toEqual(new Set());
  });

  it("flags an isolated orphan node", () => {
    const nodes = [checkNode, userInput("a"), userInput("orphan")];
    const edges = [edge("chk", "a")];
    expect(findUnreachableNodeIds(nodes, edges)).toEqual(new Set(["orphan"]));
  });

  it("flags every node of a disconnected subtree, not just its root", () => {
    const nodes = [checkNode, userInput("a"), userInput("x"), userInput("y")];
    const edges = [edge("chk", "a"), edge("x", "y")];
    expect(findUnreachableNodeIds(nodes, edges)).toEqual(new Set(["x", "y"]));
  });

  it("flags only the never-reached part of a subtree linked at a deep level", () => {
    const nodes = [
      checkNode,
      userInput("a"),
      userInput("b"),
      userInput("c"),
      userInput("d"),
    ];
    const edges = [
      edge("chk", "a"),
      edge("a", "b"),
      edge("c", "d"),
      edge("d", "b"),
    ];
    expect(findUnreachableNodeIds(nodes, edges)).toEqual(new Set(["c", "d"]));
  });

  it("returns nothing when there is no check node", () => {
    const nodes = [userInput("a"), userInput("b")];
    const edges = [edge("a", "b")];
    expect(findUnreachableNodeIds(nodes, edges)).toEqual(new Set());
  });
});

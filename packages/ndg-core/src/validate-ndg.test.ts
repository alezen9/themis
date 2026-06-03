import { describe, expect, it } from "vitest";
import type { NDGDefinition } from "./types";
import { validateNDG } from "./validate-ndg";

describe("validateNDG", () => {
  it("rejects graphs with no check node", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "no-check-x",
        name: "X",
        children: [],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = { nodes, evaluate: {} };

    expect(() => validateNDG(definition)).toThrow(/exactly one check node/);
  });

  it("rejects graphs with multiple check nodes (duplicate utilisation key)", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "multi-check-x",
        name: "X",
        children: [],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "multi-check-a",
        name: "Check A",
        verificationExpression: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "multi-check-b",
        name: "Check B",
        verificationExpression: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        utilisation: ({ x }) => Number(x),
      },
    };

    expect(() => validateNDG(definition)).toThrow(/Duplicate node key/);
  });

  it("rejects duplicate node ids", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "duplicate-id",
        name: "X",
        children: [],
      },
      {
        type: "user-input",
        key: "y",
        valueType: { type: "number" },
        id: "duplicate-id",
        name: "Y",
        children: [],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "duplicate-id-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "duplicate-id" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/Duplicate node ID/);
  });

  it("rejects duplicate node keys", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "duplicate-key-x",
        name: "X",
        children: [],
      },
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "duplicate-key-y",
        name: "Y",
        children: [],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "duplicate-key-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "duplicate-key-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/Duplicate node key/);
  });

  it("rejects unknown child references", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "unknown-child-x",
        name: "X",
        children: [],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "unknown-child-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "unknown-child-x" }, { nodeId: "missing-node" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/references unknown child/);
  });

  it("rejects evaluator keys that do not match any node", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "unknown-evaluator-x",
        name: "X",
        children: [],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "unknown-evaluator-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "unknown-evaluator-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error -- intentional evaluator typo for validation coverage
      evaluate: { utilisation: ({ x }) => Number(x), extra: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/Evaluator key/);
  });

  it("rejects missing evaluators for computed nodes", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "missing-evaluator-x",
        name: "X",
        children: [],
      },
      {
        type: "formula",
        key: "d",
        valueType: { type: "number" },
        id: "missing-evaluator-d",
        name: "D",
        expression: "x",
        children: [{ nodeId: "missing-evaluator-x" }],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "missing-evaluator-check",
        name: "Check",
        verificationExpression: "d",
        children: [{ nodeId: "missing-evaluator-d" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error -- intentional missing evaluator for formula node
      evaluate: { utilisation: ({ d }) => Number(d) },
    };

    expect(() => validateNDG(definition)).toThrow(/Missing evaluator/);
  });

  it("allows selector formula nodes without evaluators", () => {
    const nodes = [
      {
        type: "user-input",
        key: "low",
        valueType: { type: "number" },
        id: "selector-low",
        name: "Low",
        children: [],
      },
      {
        type: "user-input",
        key: "high",
        valueType: { type: "number" },
        id: "selector-high",
        name: "High",
        children: [],
      },
      {
        type: "formula",
        key: "selected",
        valueType: { type: "number" },
        id: "selector-selected",
        name: "Selected",
        children: [{ nodeId: "selector-low" }, { nodeId: "selector-high" }],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "selector-check",
        name: "Check",
        verificationExpression: "selected",
        children: [{ nodeId: "selector-selected" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ selected }) => Number(selected) },
    };

    expect(() => validateNDG(definition)).not.toThrow();
  });

  it("rejects cycles reachable from the root check", () => {
    const nodes = [
      {
        type: "formula",
        key: "a",
        valueType: { type: "number" },
        id: "cycle-a",
        name: "A",
        expression: "b",
        children: [{ nodeId: "cycle-b" }],
      },
      {
        type: "formula",
        key: "b",
        valueType: { type: "number" },
        id: "cycle-b",
        name: "B",
        expression: "a",
        children: [{ nodeId: "cycle-a" }],
      },
      {
        type: "check",
        key: "utilisation",
        valueType: { type: "number" },
        id: "cycle-check",
        name: "Check",
        verificationExpression: "a",
        children: [{ nodeId: "cycle-a" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        a: ({ b }) => Number(b),
        b: ({ a }) => Number(a),
        utilisation: ({ a }) => Number(a),
      },
    };

    expect(() => validateNDG(definition)).toThrow(/Circular dependency/);
  });
});

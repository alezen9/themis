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
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "multi-check-a",
        name: "Check A",
        template: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "multi-check-b",
        name: "Check B",
        template: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
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
        children: [],
      },
      {
        type: "user-input",
        key: "y",
        valueType: { type: "number" },
        id: "duplicate-id",
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "duplicate-id-check",
        name: "Check",
        template: "x",
        children: [{ nodeId: "duplicate-id" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/Duplicate node ID/);
  });

  it("rejects unknown child references", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "unknown-child-x",
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "unknown-child-check",
        name: "Check",
        template: "x",
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
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "unknown-evaluator-check",
        name: "Check",
        template: "x",
        children: [{ nodeId: "unknown-evaluator-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        utilisation: ({ x }) => Number(x),
        // @ts-expect-error - intentional evaluator typo for validation coverage
        extra: ({ x }) => Number(x),
      },
    };

    expect(() => validateNDG(definition)).toThrow(/Evaluator key/);
  });

  it("rejects missing evaluators for compute nodes", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "missing-evaluator-x",
        children: [],
      },
      {
        type: "formula",
        variant: "compute",
        key: "d",
        valueType: { type: "number" },
        id: "missing-evaluator-d",
        template: "x",
        children: [{ nodeId: "missing-evaluator-x" }],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "missing-evaluator-check",
        name: "Check",
        template: "d",
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

  it("allows select nodes without evaluators", () => {
    const nodes = [
      {
        type: "user-input",
        key: "low",
        valueType: { type: "number" },
        id: "select-low",
        children: [],
      },
      {
        type: "user-input",
        key: "high",
        valueType: { type: "number" },
        id: "select-high",
        children: [],
      },
      {
        type: "formula",
        variant: "select",
        key: "selected",
        valueType: { type: "number" },
        id: "select-selected",
        children: [{ nodeId: "select-low" }, { nodeId: "select-high" }],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "select-check",
        name: "Check",
        template: "selected",
        children: [{ nodeId: "select-selected" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ selected }) => Number(selected) },
    };

    expect(() => validateNDG(definition)).not.toThrow();
  });

  it("rejects an evaluator on a select node", () => {
    const nodes = [
      {
        type: "user-input",
        key: "low",
        valueType: { type: "number" },
        id: "sel-eval-low",
        children: [],
      },
      {
        type: "formula",
        variant: "select",
        key: "selected",
        valueType: { type: "number" },
        id: "sel-eval-selected",
        children: [{ nodeId: "sel-eval-low" }],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "sel-eval-check",
        name: "Check",
        template: "selected",
        children: [{ nodeId: "sel-eval-selected" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        utilisation: ({ selected }) => Number(selected),
        // @ts-expect-error -- select nodes must not have evaluators
        selected: ({ low }) => Number(low),
      },
    };

    expect(() => validateNDG(definition)).toThrow(/must not have an evaluator/);
  });

  it("rejects templates that reference unknown keys", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "tpl-x",
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "tpl-check",
        name: "Check",
        template: "\\frac{\\key{x}}{\\key{missing}}",
        children: [{ nodeId: "tpl-x" }],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/references unknown key/);
  });

  it("rejects unsatisfiable child conditions", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "unsat-x",
        children: [],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "unsat-check",
        name: "Check",
        template: "x",
        children: [
          {
            nodeId: "unsat-x",
            when: {
              and: [
                { eq: ["section_class", { value: 1 }] },
                { eq: ["section_class", { value: 2 }] },
              ],
            },
          },
        ],
      },
    ] as const;

    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x }) => Number(x) },
    };

    expect(() => validateNDG(definition)).toThrow(/unsatisfiable/);
  });

  it("rejects cycles reachable from the root check", () => {
    const nodes = [
      {
        type: "formula",
        variant: "compute",
        key: "a",
        valueType: { type: "number" },
        id: "cycle-a",
        template: "b",
        children: [{ nodeId: "cycle-b" }],
      },
      {
        type: "formula",
        variant: "compute",
        key: "b",
        valueType: { type: "number" },
        id: "cycle-b",
        template: "a",
        children: [{ nodeId: "cycle-a" }],
      },
      {
        type: "check",
        variant: "compute",
        key: "utilisation",
        valueType: { type: "number" },
        id: "cycle-check",
        name: "Check",
        template: "a",
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

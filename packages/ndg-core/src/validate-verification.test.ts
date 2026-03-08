import { describe, expect, it } from "vitest";
import type { VerificationDefinition } from "./engine";
import { validateVerification } from "./validate-verification";

describe("validateVerification", () => {
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

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {},
    };

    expect(() => validateVerification(definition)).toThrow(
      /exactly one check node/,
    );
  });

  it("rejects graphs with multiple check nodes", () => {
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
        key: "check_a",
        valueType: { type: "number" },
        id: "multi-check-a",
        name: "Check A",
        verificationExpression: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
      {
        type: "check",
        key: "check_b",
        valueType: { type: "number" },
        id: "multi-check-b",
        name: "Check B",
        verificationExpression: "x",
        children: [{ nodeId: "multi-check-x" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        check_a: ({ x }) => Number(x),
        check_b: ({ x }) => Number(x),
      },
    };

    expect(() => validateVerification(definition)).toThrow(
      /exactly one check node/,
    );
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
        key: "check",
        valueType: { type: "number" },
        id: "duplicate-id-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "duplicate-id" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { check: ({ x }) => Number(x) },
    };

    expect(() => validateVerification(definition)).toThrow(/Duplicate node ID/);
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
        key: "check",
        valueType: { type: "number" },
        id: "duplicate-key-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "duplicate-key-x" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { check: ({ x }) => Number(x) },
    };

    expect(() => validateVerification(definition)).toThrow(
      /Duplicate node key/,
    );
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
        key: "check",
        valueType: { type: "number" },
        id: "unknown-child-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "unknown-child-x" }, { nodeId: "missing-node" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { check: ({ x }) => Number(x) },
    };

    expect(() => validateVerification(definition)).toThrow(
      /references unknown child/,
    );
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
        key: "check",
        valueType: { type: "number" },
        id: "unknown-evaluator-check",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "unknown-evaluator-x" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error -- intentional evaluator typo for validation coverage
      evaluate: { check: ({ x }) => Number(x), extra: ({ x }) => Number(x) },
    };

    expect(() => validateVerification(definition)).toThrow(/Evaluator key/);
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
        type: "derived",
        key: "d",
        valueType: { type: "number" },
        id: "missing-evaluator-d",
        name: "D",
        expression: "x",
        children: [{ nodeId: "missing-evaluator-x" }],
      },
      {
        type: "check",
        key: "check",
        valueType: { type: "number" },
        id: "missing-evaluator-check",
        name: "Check",
        verificationExpression: "d",
        children: [{ nodeId: "missing-evaluator-d" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error -- intentional missing evaluator for derived node
      evaluate: { check: ({ d }) => Number(d) },
    };

    expect(() => validateVerification(definition)).toThrow(/Missing evaluator/);
  });

  it("allows selector-derived nodes without evaluators", () => {
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
        type: "derived",
        key: "selected",
        valueType: { type: "number" },
        id: "selector-selected",
        name: "Selected",
        children: [{ nodeId: "selector-low" }, { nodeId: "selector-high" }],
      },
      {
        type: "check",
        key: "check",
        valueType: { type: "number" },
        id: "selector-check",
        name: "Check",
        verificationExpression: "selected",
        children: [{ nodeId: "selector-selected" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { check: ({ selected }) => Number(selected) },
    };

    expect(() => validateVerification(definition)).not.toThrow();
  });

  it("rejects cycles reachable from the root check", () => {
    const nodes = [
      {
        type: "derived",
        key: "a",
        valueType: { type: "number" },
        id: "cycle-a",
        name: "A",
        expression: "b",
        children: [{ nodeId: "cycle-b" }],
      },
      {
        type: "derived",
        key: "b",
        valueType: { type: "number" },
        id: "cycle-b",
        name: "B",
        expression: "a",
        children: [{ nodeId: "cycle-a" }],
      },
      {
        type: "check",
        key: "check",
        valueType: { type: "number" },
        id: "cycle-check",
        name: "Check",
        verificationExpression: "a",
        children: [{ nodeId: "cycle-a" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        a: ({ b }) => Number(b),
        b: ({ a }) => Number(a),
        check: ({ a }) => Number(a),
      },
    };

    expect(() => validateVerification(definition)).toThrow(
      /Circular dependency/,
    );
  });
});

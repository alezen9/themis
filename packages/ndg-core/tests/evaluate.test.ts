import { describe, it, expect } from "vitest";
import type { EvaluationContext, VerificationDefinition } from "../src";
import { evaluate, evaluateCondition } from "../src";

// Simple compression check (matches uls-compression fixture)
const compressionNodes = [
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "node-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "node-gamma-M0",
    name: "Partial factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "node-A",
    name: "Area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "node-N-Ed",
    name: "Compression force",
    unit: "N",
    children: [],
  },
  {
    type: "formula",
    key: "N_c_Rd",
    valueType: "number",
    id: "node-N-c-Rd",
    name: "Compression resistance",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.11)" },
    children: [
      { nodeId: "node-A" },
      { nodeId: "node-fy" },
      { nodeId: "node-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "compression_check",
    valueType: "number",
    id: "node-check",
    name: "Compression check",
    verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
    children: [{ nodeId: "node-N-Ed" }, { nodeId: "node-N-c-Rd" }],
  },
] as const;

const compressionDef: VerificationDefinition<typeof compressionNodes> = {
  nodes: compressionNodes,
  evaluate: {
    N_c_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    compression_check: ({ N_Ed, N_c_Rd }) => Math.abs(N_Ed) / N_c_Rd,
  },
};

describe("evaluate", () => {
  it("evaluates compression check correctly (passing)", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    const expectedNcRd = (1032 * 355) / 1.0;
    const expectedRatio = 100000 / expectedNcRd;

    expect(result.ratio).toBeCloseTo(expectedRatio, 6);
    expect(result.passed).toBe(true);
    expect(result.cache.N_c_Rd).toBeCloseTo(expectedNcRd, 6);
  });

  it("evaluates compression check correctly (failing)", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 500000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    expect(result.ratio).toBeGreaterThan(1.0);
    expect(result.passed).toBe(false);
  });

  it("produces trace entries for all nodes", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    expect(result.trace).toHaveLength(6);
    expect(result.trace.map((t) => t.key)).toContain("N_c_Rd");
    expect(result.trace.map((t) => t.key)).toContain("compression_check");
  });

  it("throws for missing input", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032 }, // missing N_Ed
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    expect(() => evaluate(compressionDef, ctx)).toThrow('Missing input: "N_Ed"');
  });

  it("throws for missing coefficient", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: {} }, // missing gamma_M0
    };

    expect(() => evaluate(compressionDef, ctx)).toThrow(
      'Missing coefficient "gamma_M0"',
    );
  });
});

describe("evaluate with conditional children", () => {
  const conditionalNodes = [
    {
      type: "user-input",
      key: "shape",
      valueType: "string",
      id: "n-shape",
      name: "Shape",
      children: [],
    },
    {
      type: "user-input",
      key: "val_a",
      valueType: "number",
      id: "n-a",
      name: "Value A",
      children: [],
    },
    {
      type: "user-input",
      key: "val_b",
      valueType: "number",
      id: "n-b",
      name: "Value B",
      children: [],
    },
    {
      type: "derived",
      key: "result",
      valueType: "number",
      id: "n-result",
      name: "Result",
      children: [
        { nodeId: "n-a", when: { eq: ["shape", "I"] as [string, unknown] } },
        { nodeId: "n-b", when: { eq: ["shape", "CHS"] as [string, unknown] } },
      ],
    },
    {
      type: "check",
      key: "cond_check",
      valueType: "number",
      id: "n-check",
      name: "Check",
      verificationExpression: "result \\leq 1.0",
      children: [{ nodeId: "n-result" }],
    },
  ] as const;

  const condDef: VerificationDefinition<typeof conditionalNodes> = {
    nodes: conditionalNodes,
    evaluate: {
      result: ({ val_a, val_b, shape }) =>
        shape === "I" ? val_a : val_b,
      cond_check: ({ result }) => result,
    },
  };

  it("uses val_a when shape is I", () => {
    const result = evaluate(condDef, {
      inputs: { shape: "I", val_a: 0.5, val_b: 1.5 },
      annex: { id: "test", coefficients: {} },
    });
    expect(result.ratio).toBe(0.5);
    expect(result.passed).toBe(true);
  });
});

describe("evaluate edge cases", () => {
  it("throws on NaN ratio (division by zero)", () => {
    const nodes = [
      { type: "user-input", key: "a", valueType: "number", id: "n-a", name: "A", children: [] },
      { type: "user-input", key: "b", valueType: "number", id: "n-b", name: "B", children: [] },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "a/b", children: [{ nodeId: "n-a" }, { nodeId: "n-b" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ a, b }) => a / b },
    };

    expect(() => evaluate(def, {
      inputs: { a: 0, b: 0 },
      annex: { id: "t", coefficients: {} },
    })).toThrow("produced NaN");
  });

  it("throws on Infinity ratio", () => {
    const nodes = [
      { type: "user-input", key: "a", valueType: "number", id: "n-a", name: "A", children: [] },
      { type: "user-input", key: "b", valueType: "number", id: "n-b", name: "B", children: [] },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "a/b", children: [{ nodeId: "n-a" }, { nodeId: "n-b" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ a, b }) => a / b },
    };

    expect(() => evaluate(def, {
      inputs: { a: 1, b: 0 },
      annex: { id: "t", coefficients: {} },
    })).toThrow("produced Infinity");
  });

  it("includes expression and evaluatorInputs in trace", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    const formulaTrace = result.trace.find((t) => t.key === "N_c_Rd")!;
    expect(formulaTrace.expression).toBe("\\frac{A \\cdot f_y}{\\gamma_{M0}}");
    expect(formulaTrace.evaluatorInputs).toEqual({ A: 1032, fy: 355, gamma_M0: 1.0 });

    const checkTrace = result.trace.find((t) => t.key === "compression_check")!;
    expect(checkTrace.evaluatorInputs).toHaveProperty("N_Ed");
    expect(checkTrace.evaluatorInputs).toHaveProperty("N_c_Rd");
  });

  it("input nodes have no evaluatorInputs in trace", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    const inputTrace = result.trace.find((t) => t.key === "fy")!;
    expect(inputTrace.evaluatorInputs).toBeUndefined();
  });
});

describe("evaluateCondition", () => {
  const cache = { x: 5, y: "hello" };

  it("eq", () => {
    expect(evaluateCondition({ eq: ["x", 5] }, cache)).toBe(true);
    expect(evaluateCondition({ eq: ["x", 6] }, cache)).toBe(false);
    expect(evaluateCondition({ eq: ["y", "hello"] }, cache)).toBe(true);
  });

  it("lt/lte/gt/gte", () => {
    expect(evaluateCondition({ lt: ["x", 6] }, cache)).toBe(true);
    expect(evaluateCondition({ lt: ["x", 5] }, cache)).toBe(false);
    expect(evaluateCondition({ lte: ["x", 5] }, cache)).toBe(true);
    expect(evaluateCondition({ gt: ["x", 4] }, cache)).toBe(true);
    expect(evaluateCondition({ gte: ["x", 5] }, cache)).toBe(true);
  });

  it("and/or", () => {
    expect(
      evaluateCondition({ and: [{ gt: ["x", 3] }, { lt: ["x", 10] }] }, cache),
    ).toBe(true);
    expect(
      evaluateCondition({ or: [{ eq: ["x", 1] }, { eq: ["x", 5] }] }, cache),
    ).toBe(true);
    expect(
      evaluateCondition({ and: [{ eq: ["x", 1] }, { eq: ["x", 5] }] }, cache),
    ).toBe(false);
  });

  it("throws for undefined cache key", () => {
    expect(() => evaluateCondition({ lt: ["missing_key", 5] }, cache)).toThrow(
      'Condition references undefined cache key: "missing_key"',
    );
    expect(() => evaluateCondition({ eq: ["missing_key", 5] }, cache)).toThrow(
      'Condition references undefined cache key: "missing_key"',
    );
  });
});

describe("evaluate graph validation", () => {
  it("throws on circular dependency", () => {
    const nodes = [
      {
        type: "derived", key: "a", valueType: "number", id: "n-a", name: "A",
        children: [{ nodeId: "n-b" }],
      },
      {
        type: "derived", key: "b", valueType: "number", id: "n-b", name: "B",
        children: [{ nodeId: "n-a" }],
      },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "a", children: [{ nodeId: "n-a" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        a: ({ b }) => b as number,
        b: ({ a }) => a as number,
        chk: ({ a }) => a as number,
      },
    };

    expect(() => evaluate(def, {
      inputs: {},
      annex: { id: "t", coefficients: {} },
    })).toThrow("Circular dependency");
  });

  it("throws on duplicate node IDs", () => {
    const nodes = [
      { type: "user-input", key: "x", valueType: "number", id: "n-x", name: "X", children: [] },
      { type: "user-input", key: "y", valueType: "number", id: "n-x", name: "Y", children: [] },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "x", children: [{ nodeId: "n-x" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ x }) => x as number },
    };

    expect(() => evaluate(def, {
      inputs: { x: 1, y: 2 },
      annex: { id: "t", coefficients: {} },
    })).toThrow('Duplicate node ID: "n-x"');
  });

  it("throws when evaluator key doesn't match any node (typo detection)", () => {
    const nodes = [
      { type: "user-input", key: "x", valueType: "number", id: "n-x", name: "X", children: [] },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "x", children: [{ nodeId: "n-x" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error — intentional typo for testing
      evaluate: { chk: ({ x }) => x as number, ck: ({ x }) => x as number },
    };

    expect(() => evaluate(def, {
      inputs: { x: 0.5 },
      annex: { id: "t", coefficients: {} },
    })).toThrow('Evaluator key "ck" does not match any node');
  });

  it("throws when computed node is missing its evaluator (early detection)", () => {
    const nodes = [
      { type: "user-input", key: "x", valueType: "number", id: "n-x", name: "X", children: [] },
      {
        type: "derived", key: "d", valueType: "number", id: "n-d", name: "D",
        children: [{ nodeId: "n-x" }],
      },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "d", children: [{ nodeId: "n-d" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error — intentionally missing evaluator for "d"
      evaluate: { chk: ({ d }) => d as number },
    };

    expect(() => evaluate(def, {
      inputs: { x: 1 },
      annex: { id: "t", coefficients: {} },
    })).toThrow('Missing evaluator for derived node: "d"');
  });

  it("throws on intermediate NaN (not just check node)", () => {
    const nodes = [
      { type: "user-input", key: "a", valueType: "number", id: "n-a", name: "A", children: [] },
      {
        type: "derived", key: "d", valueType: "number", id: "n-d", name: "D",
        children: [{ nodeId: "n-a" }],
      },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "d", children: [{ nodeId: "n-d" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        d: ({ a }) => (a as number) / 0, // produces Infinity
        chk: ({ d }) => d as number,
      },
    };

    expect(() => evaluate(def, {
      inputs: { a: 1 },
      annex: { id: "t", coefficients: {} },
    })).toThrow('Node "d" (derived) produced Infinity');
  });

  it("throws on dangling child reference", () => {
    const nodes = [
      { type: "user-input", key: "x", valueType: "number", id: "n-x", name: "X", children: [] },
      {
        type: "check", key: "chk", valueType: "number", id: "n-chk", name: "Check",
        verificationExpression: "x", children: [{ nodeId: "n-x" }, { nodeId: "n-ghost" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ x }) => x as number },
    };

    expect(() => evaluate(def, {
      inputs: { x: 1 },
      annex: { id: "t", coefficients: {} },
    })).toThrow('references unknown child "n-ghost"');
  });
});

import { describe, it, expect } from "vitest";
import type { EvaluationContext, VerificationDefinition } from "../src";
import { evaluate, evaluateCondition } from "../src";

// Simple compression check (matches uls-compression fixture)
const compressionNodes = [
  {
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    id: "node-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    id: "node-gamma-M0",
    name: "Partial factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: { type: "number" },
    id: "node-A",
    name: "Area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "node-N-Ed",
    name: "Compression force",
    unit: "N",
    children: [],
  },
  {
    type: "formula",
    key: "N_c_Rd",
    valueType: { type: "number" },
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
    valueType: { type: "number" },
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

    expect(() => evaluate(compressionDef, ctx)).toThrow(
      'Missing input: "N_Ed"',
    );
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
      valueType: { type: "string" },
      id: "n-shape",
      name: "Shape",
      children: [],
    },
    {
      type: "user-input",
      key: "val_a",
      valueType: { type: "number" },
      id: "n-a",
      name: "Value A",
      children: [],
    },
    {
      type: "user-input",
      key: "val_b",
      valueType: { type: "number" },
      id: "n-b",
      name: "Value B",
      children: [],
    },
    {
      type: "derived",
      key: "result",
      valueType: { type: "number" },
      id: "n-result",
      name: "Result",
      children: [
        { nodeId: "n-a", when: { eq: ["shape", { value: "I" }] } },
        { nodeId: "n-b", when: { eq: ["shape", { value: "CHS" }] } },
      ],
    },
    {
      type: "check",
      key: "cond_check",
      valueType: { type: "number" },
      id: "n-check",
      name: "Check",
      verificationExpression: "result \\leq 1.0",
      children: [{ nodeId: "n-result" }],
    },
  ] as const;

  const condDef: VerificationDefinition<typeof conditionalNodes> = {
    nodes: conditionalNodes,
    evaluate: {
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

  it("does not require inactive branch inputs", () => {
    const result = evaluate(condDef, {
      inputs: { shape: "I", val_a: 0.5 },
      annex: { id: "test", coefficients: {} },
    });
    expect(result.ratio).toBe(0.5);
    const resultTrace = result.trace.find((entry) => entry.key === "result");
    expect(resultTrace?.children).toEqual(["n-a"]);
  });

  it("is deterministic across repeated active-branch runs", () => {
    const first = evaluate(condDef, {
      inputs: { shape: "CHS", val_b: 0.8 },
      annex: { id: "test", coefficients: {} },
    });
    const second = evaluate(condDef, {
      inputs: { shape: "CHS", val_b: 0.8 },
      annex: { id: "test", coefficients: {} },
    });

    expect(first.ratio).toBe(second.ratio);
    expect(first.trace.map((entry) => entry.key)).toEqual(
      second.trace.map((entry) => entry.key),
    );
  });

  it("throws when selector derived node has no active child", () => {
    expect(() =>
      evaluate(condDef, {
        inputs: { shape: "RHS", val_a: 0.5, val_b: 0.8 },
        annex: { id: "test", coefficients: {} },
      }),
    ).toThrow("must have exactly one active child, got 0");
  });

  it("throws when selector derived node has multiple active children", () => {
    const nodes = [
      {
        type: "user-input",
        key: "shape",
        valueType: { type: "string" },
        id: "m-shape",
        name: "Shape",
        children: [],
      },
      {
        type: "user-input",
        key: "val_a",
        valueType: { type: "number" },
        id: "m-a",
        name: "A",
        children: [],
      },
      {
        type: "user-input",
        key: "val_b",
        valueType: { type: "number" },
        id: "m-b",
        name: "B",
        children: [],
      },
      {
        type: "derived",
        key: "result",
        valueType: { type: "number" },
        id: "m-result",
        name: "Result",
        children: [
          { nodeId: "m-a", when: { eq: ["shape", { value: "I" }] } },
          { nodeId: "m-b", when: { eq: ["shape", { value: "I" }] } },
        ],
      },
      {
        type: "check",
        key: "m-check",
        valueType: { type: "number" },
        id: "m-check-id",
        name: "Check",
        verificationExpression: "result <= 1.0",
        children: [{ nodeId: "m-result" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        "m-check": ({ result }) => result,
      },
    };

    expect(() =>
      evaluate(def, {
        inputs: { shape: "I", val_a: 0.5, val_b: 0.8 },
        annex: { id: "test", coefficients: {} },
      }),
    ).toThrow("must have exactly one active child, got 2");
  });

  it("supports key thresholds in when conditions", () => {
    const nodes = [
      {
        type: "user-input",
        key: "n",
        valueType: { type: "number" },
        id: "s-n",
        name: "n",
        children: [],
      },
      {
        type: "user-input",
        key: "a_w",
        valueType: { type: "number" },
        id: "s-aw",
        name: "a_w",
        children: [],
      },
      {
        type: "derived",
        key: "a_w_half",
        valueType: { type: "number" },
        id: "s-aw-half",
        name: "0.5 a_w",
        expression: "0.5 a_w",
        children: [{ nodeId: "s-aw" }],
      },
      {
        type: "derived",
        key: "k",
        valueType: { type: "number" },
        id: "s-k",
        name: "k",
        children: [
          { nodeId: "s-one", when: { lte: ["n", { key: "a_w_half" }] } },
          { nodeId: "s-two", when: { gt: ["n", { key: "a_w_half" }] } },
        ],
      },
      {
        type: "derived",
        key: "k_one",
        valueType: { type: "number" },
        id: "s-one",
        name: "k1",
        expression: "1",
        children: [],
      },
      {
        type: "derived",
        key: "k_two",
        valueType: { type: "number" },
        id: "s-two",
        name: "k2",
        expression: "2",
        children: [],
      },
      {
        type: "check",
        key: "s-check",
        valueType: { type: "number" },
        id: "s-check-id",
        name: "Check",
        verificationExpression: "k",
        children: [{ nodeId: "s-k" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        a_w_half: ({ a_w }) => 0.5 * a_w,
        k_one: () => 1,
        k_two: () => 2,
        "s-check": ({ k }) => k,
      },
    };

    const low = evaluate(def, {
      inputs: { n: 0.2, a_w: 0.6 },
      annex: { id: "test", coefficients: {} },
    });
    const high = evaluate(def, {
      inputs: { n: 0.4, a_w: 0.6 },
      annex: { id: "test", coefficients: {} },
    });

    expect(low.ratio).toBe(1);
    expect(high.ratio).toBe(2);
  });
});

describe("evaluate with raw-input condition keys and merged evaluator args", () => {
  it("supports when condition keys from raw inputs without node", () => {
    const nodes = [
      {
        type: "user-input",
        key: "val_i",
        valueType: { type: "number" },
        id: "raw-i",
        name: "Value I",
        children: [],
      },
      {
        type: "user-input",
        key: "val_h",
        valueType: { type: "number" },
        id: "raw-h",
        name: "Value H",
        children: [],
      },
      {
        type: "derived",
        key: "selected",
        valueType: { type: "number" },
        id: "raw-selected",
        name: "Selected",
        children: [
          {
            nodeId: "raw-i",
            when: { eq: ["shape_input", { value: "I" }] },
          },
          {
            nodeId: "raw-h",
            when: { eq: ["shape_input", { value: "H" }] },
          },
        ],
      },
      {
        type: "check",
        key: "raw-check",
        valueType: { type: "number" },
        id: "raw-check-id",
        name: "Check",
        verificationExpression: "selected <= 1.0",
        children: [{ nodeId: "raw-selected" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        "raw-check": ({ selected }) => selected,
      },
    };

    const result = evaluate(def, {
      inputs: { shape_input: "I", val_i: 0.25, val_h: 0.75 },
      annex: { id: "test", coefficients: {} },
    });

    expect(result.ratio).toBe(0.25);
  });

  it("throws for unknown condition key not in nodes or raw inputs", () => {
    const nodes = [
      {
        type: "user-input",
        key: "val",
        valueType: { type: "number" },
        id: "unk-val",
        name: "Value",
        children: [],
      },
      {
        type: "derived",
        key: "selected",
        valueType: { type: "number" },
        id: "unk-selected",
        name: "Selected",
        children: [
          {
            nodeId: "unk-val",
            when: { eq: ["missing_key", { value: "x" }] },
          },
        ],
      },
      {
        type: "check",
        key: "unk-check",
        valueType: { type: "number" },
        id: "unk-check-id",
        name: "Check",
        verificationExpression: "selected <= 1.0",
        children: [{ nodeId: "unk-selected" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { "unk-check": ({ selected }) => selected },
    };

    expect(() =>
      evaluate(def, {
        inputs: { val: 0.5 },
        annex: { id: "test", coefficients: {} },
      }),
    ).toThrow('Condition references unknown key: "missing_key"');
  });

  it("passes raw non-node inputs into evaluator args", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "ext-a",
        name: "A",
        children: [],
      },
      {
        type: "derived",
        key: "sum_ext",
        valueType: { type: "number" },
        id: "ext-sum",
        name: "Sum",
        expression: "a + external_addend",
        children: [{ nodeId: "ext-a" }],
      },
      {
        type: "check",
        key: "ext-check",
        valueType: { type: "number" },
        id: "ext-check-id",
        name: "Check",
        verificationExpression: "sum_ext <= 1.0",
        children: [{ nodeId: "ext-sum" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        sum_ext: ({ a, external_addend }) => a + Number(external_addend),
        "ext-check": ({ sum_ext }) => sum_ext,
      },
    };

    const result = evaluate(def, {
      inputs: { a: 0.3, external_addend: 0.2 },
      annex: { id: "test", coefficients: {} },
    });

    expect(result.ratio).toBe(0.5);
  });

  it("uses cache value over raw input for overlapping keys", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "ovr-a",
        name: "A",
        children: [],
      },
      {
        type: "formula",
        key: "sum_ext",
        valueType: { type: "number" },
        id: "ovr-sum",
        name: "Sum",
        expression: "a + b",
        meta: { formulaRef: "(x)", sectionRef: "x" },
        children: [{ nodeId: "ovr-a" }],
      },
      {
        type: "check",
        key: "ovr-check",
        valueType: { type: "number" },
        id: "ovr-check-id",
        name: "Check",
        verificationExpression: "sum_ext <= 1.0",
        children: [{ nodeId: "ovr-sum" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        sum_ext: ({ a, b }) => a + Number(b),
        "ovr-check": ({ sum_ext }) => sum_ext,
      },
    };

    const result = evaluate(def, {
      inputs: { a: 0.4, b: 0.1, sum_ext: 999 },
      annex: { id: "test", coefficients: {} },
    });

    expect(result.ratio).toBe(0.5);
  });
});

describe("evaluate edge cases", () => {
  it("throws on NaN ratio (division by zero)", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "n-a",
        name: "A",
        children: [],
      },
      {
        type: "user-input",
        key: "b",
        valueType: { type: "number" },
        id: "n-b",
        name: "B",
        children: [],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "a/b",
        children: [{ nodeId: "n-a" }, { nodeId: "n-b" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ a, b }) => a / b },
    };

    expect(() =>
      evaluate(def, {
        inputs: { a: 0, b: 0 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow("produced NaN");
  });

  it("throws on Infinity ratio", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "n-a",
        name: "A",
        children: [],
      },
      {
        type: "user-input",
        key: "b",
        valueType: { type: "number" },
        id: "n-b",
        name: "B",
        children: [],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "a/b",
        children: [{ nodeId: "n-a" }, { nodeId: "n-b" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ a, b }) => a / b },
    };

    expect(() =>
      evaluate(def, {
        inputs: { a: 1, b: 0 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow("produced Infinity");
  });

  it("includes expression and evaluatorInputs in trace", () => {
    const ctx: EvaluationContext = {
      inputs: { fy: 355, A: 1032, N_Ed: 100000 },
      annex: { id: "eurocode", coefficients: { gamma_M0: 1.0 } },
    };

    const result = evaluate(compressionDef, ctx);
    const formulaTrace = result.trace.find((t) => t.key === "N_c_Rd")!;
    expect(formulaTrace.expression).toBe("\\frac{A \\cdot f_y}{\\gamma_{M0}}");
    expect(formulaTrace.evaluatorInputs).toEqual({
      A: 1032,
      fy: 355,
      gamma_M0: 1.0,
    });

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
    expect(evaluateCondition({ eq: ["x", { value: 5 }] }, cache)).toBe(true);
    expect(evaluateCondition({ eq: ["x", { value: 6 }] }, cache)).toBe(false);
    expect(evaluateCondition({ eq: ["y", { value: "hello" }] }, cache)).toBe(
      true,
    );
    expect(evaluateCondition({ eq: ["x", { key: "x" }] }, cache)).toBe(true);
    expect(evaluateCondition({ eq: ["x", { key: "y" }] }, cache)).toBe(false);
  });

  it("lt/lte/gt/gte", () => {
    expect(evaluateCondition({ lt: ["x", { value: 6 }] }, cache)).toBe(true);
    expect(evaluateCondition({ lt: ["x", { value: 5 }] }, cache)).toBe(false);
    expect(evaluateCondition({ lte: ["x", { value: 5 }] }, cache)).toBe(true);
    expect(evaluateCondition({ gt: ["x", { value: 4 }] }, cache)).toBe(true);
    expect(evaluateCondition({ gte: ["x", { value: 5 }] }, cache)).toBe(true);
  });

  it("supports key-to-key numeric thresholds", () => {
    expect(evaluateCondition({ lte: ["x", { key: "x" }] }, cache)).toBe(true);
    expect(evaluateCondition({ gt: ["x", { key: "x" }] }, cache)).toBe(false);
  });

  it("and/or", () => {
    expect(
      evaluateCondition(
        { and: [{ gt: ["x", { value: 3 }] }, { lt: ["x", { value: 10 }] }] },
        cache,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          or: [
            { eq: ["x", { value: 1 }] },
            { eq: ["x", { value: 5 }] },
          ],
        },
        cache,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          and: [
            { eq: ["x", { value: 1 }] },
            { eq: ["x", { value: 5 }] },
          ],
        },
        cache,
      ),
    ).toBe(false);
  });

  it("throws for undefined cache key", () => {
    expect(() =>
      evaluateCondition({ lt: ["missing_key", { value: 5 }] }, cache),
    ).toThrow('Condition references undefined cache key: "missing_key"');
    expect(() =>
      evaluateCondition({ eq: ["missing_key", { value: 5 }] }, cache),
    ).toThrow('Condition references undefined cache key: "missing_key"');
  });
});

describe("evaluate graph validation", () => {
  it("throws on circular dependency", () => {
    const nodes = [
      {
        type: "derived",
        key: "a",
        valueType: { type: "number" },
        id: "n-a",
        name: "A",
        children: [{ nodeId: "n-b" }],
      },
      {
        type: "derived",
        key: "b",
        valueType: { type: "number" },
        id: "n-b",
        name: "B",
        children: [{ nodeId: "n-a" }],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "a",
        children: [{ nodeId: "n-a" }],
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

    expect(() =>
      evaluate(def, {
        inputs: {},
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow("Circular dependency");
  });

  it("throws on duplicate node IDs", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "n-x",
        name: "X",
        children: [],
      },
      {
        type: "user-input",
        key: "y",
        valueType: { type: "number" },
        id: "n-x",
        name: "Y",
        children: [],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "n-x" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ x }) => x as number },
    };

    expect(() =>
      evaluate(def, {
        inputs: { x: 1, y: 2 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow('Duplicate node ID: "n-x"');
  });

  it("throws when evaluator key doesn't match any node (typo detection)", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "n-x",
        name: "X",
        children: [],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "n-x" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error — intentional typo for testing
      evaluate: { chk: ({ x }) => x as number, ck: ({ x }) => x as number },
    };

    expect(() =>
      evaluate(def, {
        inputs: { x: 0.5 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow('Evaluator key "ck" does not match any node');
  });

  it("throws when computed node is missing its evaluator (early detection)", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "n-x",
        name: "X",
        children: [],
      },
      {
        type: "derived",
        key: "d",
        valueType: { type: "number" },
        id: "n-d",
        name: "D",
        expression: "x",
        children: [{ nodeId: "n-x" }],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "d",
        children: [{ nodeId: "n-d" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      // @ts-expect-error — intentionally missing evaluator for "d"
      evaluate: { chk: ({ d }) => d as number },
    };

    expect(() =>
      evaluate(def, {
        inputs: { x: 1 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow('Missing evaluator for derived node: "d"');
  });

  it("throws on intermediate NaN (not just check node)", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "n-a",
        name: "A",
        children: [],
      },
      {
        type: "derived",
        key: "d",
        valueType: { type: "number" },
        id: "n-d",
        name: "D",
        children: [{ nodeId: "n-a" }],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "d",
        children: [{ nodeId: "n-d" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        d: ({ a }) => (a as number) / 0, // produces Infinity
        chk: ({ d }) => d as number,
      },
    };

    expect(() =>
      evaluate(def, {
        inputs: { a: 1 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow('Node "d" (derived) produced Infinity');
  });

  it("throws on dangling child reference", () => {
    const nodes = [
      {
        type: "user-input",
        key: "x",
        valueType: { type: "number" },
        id: "n-x",
        name: "X",
        children: [],
      },
      {
        type: "check",
        key: "chk",
        valueType: { type: "number" },
        id: "n-chk",
        name: "Check",
        verificationExpression: "x",
        children: [{ nodeId: "n-x" }, { nodeId: "n-ghost" }],
      },
    ] as const;

    const def: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { chk: ({ x }) => x as number },
    };

    expect(() =>
      evaluate(def, {
        inputs: { x: 1 },
        annex: { id: "t", coefficients: {} },
      }),
    ).toThrow('references unknown child "n-ghost"');
  });
});

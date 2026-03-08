import { describe, expect, it } from "vitest";
import type { VerificationDefinition } from "./engine";
import { evaluate } from "./evaluate";

const compressionAnnex = {
  id: "eurocode",
  coefficients: { gamma_M0: 1 },
} as const;

const compressionInputs = { fy: 355, A: 1_032, N_Ed: 100_000 } as const;

const compressionNodes = [
  {
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    id: "compression-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    id: "compression-gamma-m0",
    name: "Partial factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: { type: "number" },
    id: "compression-area",
    name: "Area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: { type: "number" },
    id: "compression-force",
    name: "Compression force",
    unit: "N",
    children: [],
  },
  {
    type: "formula",
    key: "N_c_Rd",
    valueType: { type: "number" },
    id: "compression-resistance",
    name: "Compression resistance",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.11)" },
    children: [
      { nodeId: "compression-area" },
      { nodeId: "compression-fy" },
      { nodeId: "compression-gamma-m0" },
    ],
  },
  {
    type: "check",
    key: "compression_check",
    valueType: { type: "number" },
    id: "compression-check",
    name: "Compression check",
    verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
    children: [
      { nodeId: "compression-force" },
      { nodeId: "compression-resistance" },
    ],
  },
] as const;

const compressionDefinition: VerificationDefinition<typeof compressionNodes> = {
  nodes: compressionNodes,
  evaluate: {
    N_c_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    compression_check: ({ N_Ed, N_c_Rd }) => Math.abs(N_Ed) / N_c_Rd,
  },
};

const selectorNodes = [
  {
    type: "user-input",
    key: "val_i",
    valueType: { type: "number" },
    id: "selector-i",
    name: "I value",
    children: [],
  },
  {
    type: "user-input",
    key: "val_h",
    valueType: { type: "number" },
    id: "selector-h",
    name: "H value",
    children: [],
  },
  {
    type: "derived",
    key: "selected",
    valueType: { type: "number" },
    id: "selector-selected",
    name: "Selected value",
    children: [
      { nodeId: "selector-i", when: { eq: ["shape_input", { value: "I" }] } },
      { nodeId: "selector-h", when: { eq: ["shape_input", { value: "H" }] } },
    ],
  },
  {
    type: "check",
    key: "selector_check",
    valueType: { type: "number" },
    id: "selector-check",
    name: "Selector check",
    verificationExpression: "selected \\leq 1.0",
    children: [{ nodeId: "selector-selected" }],
  },
] as const;

const selectorDefinition: VerificationDefinition<typeof selectorNodes> = {
  nodes: selectorNodes,
  evaluate: { selector_check: ({ selected }) => selected },
};

const thresholdNodes = [
  {
    type: "user-input",
    key: "n",
    valueType: { type: "number" },
    id: "threshold-n",
    name: "n",
    children: [],
  },
  {
    type: "user-input",
    key: "a_w",
    valueType: { type: "number" },
    id: "threshold-a-w",
    name: "a_w",
    children: [],
  },
  {
    type: "derived",
    key: "a_w_half",
    valueType: { type: "number" },
    id: "threshold-a-w-half",
    name: "0.5 a_w",
    expression: "0.5 a_w",
    children: [{ nodeId: "threshold-a-w" }],
  },
  {
    type: "derived",
    key: "k",
    valueType: { type: "number" },
    id: "threshold-k",
    name: "k",
    children: [
      { nodeId: "threshold-k-one", when: { lte: ["n", { key: "a_w_half" }] } },
      { nodeId: "threshold-k-two", when: { gt: ["n", { key: "a_w_half" }] } },
    ],
  },
  {
    type: "derived",
    key: "k_one",
    valueType: { type: "number" },
    id: "threshold-k-one",
    name: "k = 1",
    expression: "1",
    children: [],
  },
  {
    type: "derived",
    key: "k_two",
    valueType: { type: "number" },
    id: "threshold-k-two",
    name: "k = 2",
    expression: "2",
    children: [],
  },
  {
    type: "check",
    key: "threshold_check",
    valueType: { type: "number" },
    id: "threshold-check",
    name: "Threshold check",
    verificationExpression: "k",
    children: [{ nodeId: "threshold-k" }],
  },
] as const;

const thresholdDefinition: VerificationDefinition<typeof thresholdNodes> = {
  nodes: thresholdNodes,
  evaluate: {
    a_w_half: ({ a_w }) => 0.5 * a_w,
    k_one: () => 1,
    k_two: () => 2,
    threshold_check: ({ k }) => k,
  },
};

const lookupNodes = [
  {
    type: "user-input",
    key: "a",
    valueType: { type: "number" },
    id: "lookup-a",
    name: "A",
    children: [],
  },
  {
    type: "formula",
    key: "sum_ext",
    valueType: { type: "number" },
    id: "lookup-sum",
    name: "Sum",
    expression: "a + bonus",
    meta: { sectionRef: "x", formulaRef: "(x)" },
    children: [{ nodeId: "lookup-a" }],
  },
  {
    type: "check",
    key: "lookup_check",
    valueType: { type: "number" },
    id: "lookup-check",
    name: "Lookup check",
    verificationExpression: "sum_ext \\leq 1.0",
    children: [{ nodeId: "lookup-sum" }],
  },
] as const;

const lookupDefinition: VerificationDefinition<typeof lookupNodes> = {
  nodes: lookupNodes,
  evaluate: {
    sum_ext: ({ a, bonus }) => a + Number(bonus),
    lookup_check: ({ sum_ext }) => sum_ext,
  },
};

const conflictingSelectorNodes = [
  {
    type: "user-input",
    key: "val_a",
    valueType: { type: "number" },
    id: "conflict-a",
    name: "A",
    children: [],
  },
  {
    type: "user-input",
    key: "val_b",
    valueType: { type: "number" },
    id: "conflict-b",
    name: "B",
    children: [],
  },
  {
    type: "derived",
    key: "selected",
    valueType: { type: "number" },
    id: "conflict-selected",
    name: "Selected",
    children: [
      { nodeId: "conflict-a", when: { eq: ["shape_input", { value: "I" }] } },
      { nodeId: "conflict-b", when: { eq: ["shape_input", { value: "I" }] } },
    ],
  },
  {
    type: "check",
    key: "conflict_check",
    valueType: { type: "number" },
    id: "conflict-check",
    name: "Conflict check",
    verificationExpression: "selected \\leq 1.0",
    children: [{ nodeId: "conflict-selected" }],
  },
] as const;

const conflictingSelectorDefinition: VerificationDefinition<
  typeof conflictingSelectorNodes
> = {
  nodes: conflictingSelectorNodes,
  evaluate: { conflict_check: ({ selected }) => selected },
};

const nonFiniteNodeNodes = [
  {
    type: "user-input",
    key: "a",
    valueType: { type: "number" },
    id: "non-finite-a",
    name: "A",
    children: [],
  },
  {
    type: "derived",
    key: "d",
    valueType: { type: "number" },
    id: "non-finite-d",
    name: "D",
    expression: "1 / 0",
    children: [{ nodeId: "non-finite-a" }],
  },
  {
    type: "check",
    key: "non_finite_check",
    valueType: { type: "number" },
    id: "non-finite-check",
    name: "Non-finite check",
    verificationExpression: "d",
    children: [{ nodeId: "non-finite-d" }],
  },
] as const;

const nonFiniteNodeDefinition: VerificationDefinition<
  typeof nonFiniteNodeNodes
> = {
  nodes: nonFiniteNodeNodes,
  evaluate: { d: ({ a }) => Number(a) / 0, non_finite_check: ({ d }) => d },
};

const nonFiniteRatioNodes = [
  {
    type: "user-input",
    key: "a",
    valueType: { type: "number" },
    id: "ratio-a",
    name: "A",
    children: [],
  },
  {
    type: "user-input",
    key: "b",
    valueType: { type: "number" },
    id: "ratio-b",
    name: "B",
    children: [],
  },
  {
    type: "check",
    key: "ratio_check",
    valueType: { type: "number" },
    id: "ratio-check",
    name: "Ratio check",
    verificationExpression: "a / b",
    children: [{ nodeId: "ratio-a" }, { nodeId: "ratio-b" }],
  },
] as const;

const nonFiniteRatioDefinition: VerificationDefinition<
  typeof nonFiniteRatioNodes
> = {
  nodes: nonFiniteRatioNodes,
  evaluate: { ratio_check: ({ a, b }) => Number(a) / Number(b) },
};

describe("evaluate", () => {
  it("evaluates a formula-based check and returns the expected result contract", () => {
    const result = evaluate(compressionDefinition, {
      inputs: compressionInputs,
      annex: compressionAnnex,
    });
    const expectedResistance =
      (compressionInputs.A * compressionInputs.fy) /
      compressionAnnex.coefficients.gamma_M0;
    const expectedRatio = compressionInputs.N_Ed / expectedResistance;

    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
    expect(result.cache.N_c_Rd).toBeCloseTo(expectedResistance, 12);
    expect(result.check).toEqual({
      id: "compression-check",
      key: "compression_check",
      name: "Compression check",
      verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
      meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
    });
  });

  it("records trace metadata and evaluator inputs for computed nodes", () => {
    const result = evaluate(compressionDefinition, {
      inputs: compressionInputs,
      annex: compressionAnnex,
    });

    const resistanceTrace = result.trace.find(
      (entry) => entry.key === "N_c_Rd",
    );
    const inputTrace = result.trace.find((entry) => entry.key === "fy");

    expect(resistanceTrace?.expression).toBe(
      "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    );
    expect(resistanceTrace?.evaluatorInputs).toEqual({
      A: 1_032,
      fy: 355,
      gamma_M0: 1,
    });
    expect(inputTrace?.evaluatorInputs).toBeUndefined();
  });

  it("throws when a required user input is missing", () => {
    expect(() =>
      evaluate(compressionDefinition, {
        inputs: { fy: 355, A: 1_032 },
        annex: compressionAnnex,
      }),
    ).toThrow(/Missing input/);
  });

  it("throws when a required coefficient is missing", () => {
    expect(() =>
      evaluate(compressionDefinition, {
        inputs: compressionInputs,
        annex: { id: "eurocode", coefficients: {} },
      }),
    ).toThrow(/Missing coefficient/);
  });

  it("activates only the matching selector branch and does not require inactive inputs", () => {
    const result = evaluate(selectorDefinition, {
      inputs: { shape_input: "I", val_i: 0.25 },
      annex: { id: "selector", coefficients: {} },
    });

    const selectedTrace = result.trace.find(
      (entry) => entry.key === "selected",
    );

    expect(result.ratio).toBe(0.25);
    expect(result.cache.selected).toBe(0.25);
    expect(selectedTrace?.children).toEqual(["selector-i"]);
  });

  it("supports computed keys inside when conditions", () => {
    const lowResult = evaluate(thresholdDefinition, {
      inputs: { n: 0.2, a_w: 0.6 },
      annex: { id: "threshold", coefficients: {} },
    });
    const highResult = evaluate(thresholdDefinition, {
      inputs: { n: 0.4, a_w: 0.6 },
      annex: { id: "threshold", coefficients: {} },
    });

    expect(lowResult.ratio).toBe(1);
    expect(highResult.ratio).toBe(2);
  });

  it("uses computed values over overlapping raw inputs in evaluator lookup", () => {
    const result = evaluate(lookupDefinition, {
      inputs: { a: 0.4, bonus: 0.1, sum_ext: 999 },
      annex: { id: "lookup", coefficients: {} },
    });

    expect(result.ratio).toBe(0.5);
  });

  it("throws when an auto-selector has multiple active children", () => {
    expect(() =>
      evaluate(conflictingSelectorDefinition, {
        inputs: { shape_input: "I", val_a: 0.3, val_b: 0.7 },
        annex: { id: "selector", coefficients: {} },
      }),
    ).toThrow(/must have exactly one active child/);
  });

  it("throws when a computed node produces a non-finite number", () => {
    expect(() =>
      evaluate(nonFiniteNodeDefinition, {
        inputs: { a: 1 },
        annex: { id: "non-finite", coefficients: {} },
      }),
    ).toThrow(/produced Infinity/);
  });

  it("throws when the root check produces a non-finite ratio", () => {
    expect(() =>
      evaluate(nonFiniteRatioDefinition, {
        inputs: { a: 0, b: 0 },
        annex: { id: "ratio", coefficients: {} },
      }),
    ).toThrow(/ratio_check".*produced NaN/);
  });

  it("throws when a when-condition references an unknown key", () => {
    const nodes = [
      {
        type: "user-input",
        key: "a",
        valueType: { type: "number" },
        id: "unknown-cond-a",
        name: "A",
        children: [],
      },
      {
        type: "user-input",
        key: "b",
        valueType: { type: "number" },
        id: "unknown-cond-b",
        name: "B",
        children: [],
      },
      {
        type: "derived",
        key: "picked",
        valueType: { type: "number" },
        id: "unknown-cond-picked",
        name: "Picked",
        children: [
          {
            nodeId: "unknown-cond-a",
            when: { eq: ["ghost_key", { value: "x" }] },
          },
          { nodeId: "unknown-cond-b" },
        ],
      },
      {
        type: "check",
        key: "unknown_cond_check",
        valueType: { type: "number" },
        id: "unknown-cond-check",
        name: "Check",
        verificationExpression: "picked",
        children: [{ nodeId: "unknown-cond-picked" }],
      },
    ] as const;

    const definition: VerificationDefinition<typeof nodes> = {
      nodes,
      evaluate: { unknown_cond_check: ({ picked }) => picked },
    };

    expect(() =>
      evaluate(definition, {
        inputs: { a: 1, b: 2 },
        annex: { id: "test", coefficients: {} },
      }),
    ).toThrow(/unknown key.*ghost_key/);
  });
});

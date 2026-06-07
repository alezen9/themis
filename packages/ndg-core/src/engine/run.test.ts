import { describe, expect, it } from "vitest";

import type { Condition } from "../schema";
import type { NDGDefinition } from "../types";
import { runNDG, runNDGSuite } from "./run";

type Child = { nodeId: string; when?: Condition };

const userInput = <K extends string>(key: K) => ({
  type: "user-input" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  children: [] as Child[],
});

const coefficient = <K extends string>(key: K) => ({
  type: "coefficient" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  children: [] as Child[],
});

const constant = <K extends string>(key: K, value?: number) => ({
  type: "constant" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  children: [] as Child[],
  ...(value === undefined ? {} : { value }),
});

const formula = <K extends string>(
  key: K,
  children: Child[],
  expression?: string,
) => ({
  type: "formula" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  ...(expression === undefined ? {} : { expressions: [{ expression }] }),
  children,
});

const check = (verificationExpression: string, children: Child[]) => ({
  type: "check" as const,
  key: "utilisation" as const,
  id: "check",
  name: "Check",
  valueType: { type: "number" as const },
  verificationExpression,
  children,
});

describe("runNDG — input resolution", () => {
  it("resolves user-input and coefficient nodes from the run inputs", () => {
    const nodes = [
      userInput("x"),
      coefficient("gamma"),
      check("x", [{ nodeId: "x" }, { nodeId: "gamma" }]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ x, gamma }) => x / gamma },
    };

    const result = runNDG(definition, { values: { x: 6, gamma: 2 } });

    expect(result.cache.x).toBe(6);
    expect(result.cache.gamma).toBe(2);
    expect(result.utilisation).toBe(3);
  });

  it("resolves nested input values by dot-path key", () => {
    const nodes = [
      userInput("geometry.height"),
      check("h", [{ nodeId: "geometry.height" }]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: deps => deps["geometry.height"] },
    };

    const result = runNDG(definition, { values: { geometry: { height: 5 } } });

    expect(result.cache["geometry.height"]).toBe(5);
  });

  it("exposes formula expressions in trace entries", () => {
    const nodes = [
      userInput("x"),
      formula("double", [{ nodeId: "x" }], "2x"),
      check("double", [{ nodeId: "double" }]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        double: ({ x }) => x * 2,
        utilisation: ({ double }) => double,
      },
    };

    const result = runNDG(definition, { values: { x: 2 } });

    expect(
      result.trace.find(entry => entry.key === "double")?.expressions,
    ).toEqual([{ expression: "2x" }]);
  });

  it("resolves named constant nodes from the registry", () => {
    const nodes = [constant("pi"), check("pi", [{ nodeId: "pi" }])];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ pi }) => pi },
    };

    expect(runNDG(definition, { values: {} }).cache.pi).toBe(Math.PI);
  });

  it("uses a custom constant's inline value, overriding the registry", () => {
    const nodes = [constant("pi", 42), check("pi", [{ nodeId: "pi" }])];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ pi }) => pi },
    };

    expect(runNDG(definition, { values: {} }).cache.pi).toBe(42);
  });
});

describe("runNDG — conditions and branching", () => {
  const nodes = [
    userInput("plastic"),
    userInput("elastic"),
    formula(
      "resistance",
      [
        { nodeId: "plastic", when: { eq: ["section_class", { value: 2 }] } },
        { nodeId: "elastic", when: { eq: ["section_class", { value: 3 }] } },
      ],
      "branch",
    ),
    check("resistance", [{ nodeId: "resistance" }]),
  ];
  const definition: NDGDefinition<typeof nodes> = {
    nodes,
    evaluate: {
      resistance: ({ plastic, elastic }) => plastic ?? elastic,
      utilisation: ({ resistance }) => resistance,
    },
  };

  it("resolves a condition key from the run inputs without a matching node", () => {
    const classTwo = runNDG(definition, {
      values: { section_class: 2, plastic: 10, elastic: 20 },
    });
    const classThree = runNDG(definition, {
      values: { section_class: 3, plastic: 10, elastic: 20 },
    });

    expect(classTwo.utilisation).toBe(10);
    expect(classThree.utilisation).toBe(20);
  });

  it("evaluates only the branch whose condition matches", () => {
    const classTwo = runNDG(definition, {
      values: { section_class: 2, plastic: 10, elastic: 20 },
    });

    expect(classTwo.cache.plastic).toBe(10);
    expect(classTwo.cache.elastic).toBeUndefined();
  });

  it("evaluates a node referenced only by a condition before testing it", () => {
    const nodes = [
      formula("threshold", [], "5"),
      userInput("bonus"),
      check("bonus", [
        { nodeId: "bonus", when: { gt: ["threshold", { value: 0 }] } },
      ]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { threshold: () => 5, utilisation: ({ bonus }) => bonus },
    };

    const result = runNDG(definition, { values: { bonus: 7 } });

    expect(result.cache.threshold).toBe(5);
    expect(result.cache.bonus).toBe(7);
  });

  it("scopes evaluator deps to active children when another path cached the inactive branch", () => {
    const nodes = [
      userInput("a_in"),
      userInput("b_in"),
      formula("a", [{ nodeId: "a_in" }], "a_in"),
      formula("b", [{ nodeId: "b_in" }], "b_in"),
      formula(
        "selected",
        [
          { nodeId: "a", when: { eq: ["section_class", { value: 1 }] } },
          { nodeId: "b", when: { eq: ["section_class", { value: 3 }] } },
        ],
        "branch",
      ),
      check("selected", [{ nodeId: "a" }, { nodeId: "selected" }]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        a: ({ a_in }) => a_in,
        b: ({ b_in }) => b_in,
        selected: ({ a, b }) => a ?? b,
        utilisation: ({ selected }) => selected,
      },
    };

    const result = runNDG(definition, {
      values: { section_class: 3, a_in: 1, b_in: 2 },
    });

    expect(result.cache.a).toBe(1);
    expect(result.cache.selected).toBe(2);
    expect(result.utilisation).toBe(2);
  });
});

describe("runNDG — condition-only branching formula", () => {
  const nodes = [
    userInput("raw"),
    userInput("mode"),
    userInput("low_path"),
    userInput("high_path"),
    formula("shared", [{ nodeId: "raw" }], "raw"),
    formula("ratio_a", [{ nodeId: "shared" }], "shared"),
    formula("ratio_b", [{ nodeId: "shared" }], "shared * 2"),
    formula(
      "ratio",
      [
        { nodeId: "ratio_a", when: { eq: ["mode", { value: 1 }] } },
        { nodeId: "ratio_b", when: { eq: ["mode", { value: 2 }] } },
      ],
      "branch",
    ),
    formula(
      "main_low",
      [{ nodeId: "low_path" }, { nodeId: "shared" }],
      "low_path",
    ),
    formula(
      "main_high",
      [{ nodeId: "high_path" }, { nodeId: "shared" }],
      "high_path",
    ),
    check("branch", [
      { nodeId: "ratio" },
      { nodeId: "main_low", when: { lt: ["ratio", { value: 0.5 }] } },
      { nodeId: "main_high", when: { gte: ["ratio", { value: 0.5 }] } },
    ]),
  ];
  const definition: NDGDefinition<typeof nodes> = {
    nodes,
    evaluate: {
      shared: ({ raw }) => raw,
      ratio_a: ({ shared }) => shared,
      ratio_b: ({ shared }) => shared * 2,
      ratio: ({ ratio_a, ratio_b }) => ratio_a ?? ratio_b,
      main_low: ({ low_path }) => low_path,
      main_high: ({ high_path }) => high_path,
      utilisation: ({ main_low, main_high }) => main_low ?? main_high,
    },
  };

  it("evaluates a connected-but-unconsumed formula referenced by the check's conditions", () => {
    const result = runNDG(definition, {
      values: { raw: 0.3, mode: 1, low_path: 0.8, high_path: 2 },
    });

    expect(result.cache.ratio).toBe(0.3);
    expect(result.cache.main_low).toBe(0.8);
    expect(result.cache.main_high).toBeUndefined();
    expect(result.utilisation).toBe(0.8);
  });

  it("resolves the referenced formula's own active branch and shared subtree once", () => {
    let sharedEvaluations = 0;
    const counted: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        ...definition.evaluate,
        shared: ({ raw }) => {
          sharedEvaluations += 1;
          return raw;
        },
      },
    };

    const result = runNDG(counted, {
      values: { raw: 0.3, mode: 1, low_path: 0.8, high_path: 2 },
    });

    expect(result.cache.ratio_a).toBe(0.3);
    expect(result.cache.ratio_b).toBeUndefined();
    expect(sharedEvaluations).toBe(1);
  });

  it("switches the outer branch when the referenced formula's own branch changes", () => {
    const result = runNDG(definition, {
      values: { raw: 0.3, mode: 2, low_path: 0.8, high_path: 2 },
    });

    expect(result.cache.ratio).toBe(0.6);
    expect(result.cache.ratio_b).toBe(0.6);
    expect(result.cache.ratio_a).toBeUndefined();
    expect(result.cache.main_high).toBe(2);
    expect(result.cache.main_low).toBeUndefined();
    expect(result.utilisation).toBe(2);
  });

  it("exposes the referenced formula in the check's evaluator inputs trace", () => {
    const result = runNDG(definition, {
      values: { raw: 0.3, mode: 1, low_path: 0.8, high_path: 2 },
    });

    const checkEntry = result.trace.find(entry => entry.key === "utilisation");
    expect(checkEntry?.evaluatorInputs?.ratio).toBe(0.3);
    expect(checkEntry?.evaluatorInputs?.main_low).toBe(0.8);
  });
});

// A selector formula (no evaluator) is only recognised by the typed evaluate
// map when its children are a non-empty tuple, so these graphs are spelled out
// with `as const` rather than via the builders.
describe("runNDG — auto-selector formula", () => {
  const nodes = [
    userInput("low"),
    userInput("high"),
    {
      type: "formula",
      key: "selected",
      id: "selected",
      valueType: { type: "number" },
      children: [
        { nodeId: "low", when: { gt: ["level", { value: 0 }] } },
        { nodeId: "high", when: { gt: ["level", { value: -10 }] } },
      ],
    },
    check("selected", [{ nodeId: "selected" }]),
  ] as const;
  const definition: NDGDefinition<typeof nodes> = {
    nodes,
    evaluate: { utilisation: ({ selected }) => selected },
  };

  it("returns the value of the single active child", () => {
    const result = runNDG(definition, {
      values: { level: -5, low: 1, high: 2 },
    });

    expect(result.cache.selected).toBe(2);
  });

  it("throws when no child is active", () => {
    expect(() =>
      runNDG(definition, { values: { level: -20, low: 1, high: 2 } }),
    ).toThrow(/exactly one active child/);
  });

  it("throws when more than one child is active", () => {
    expect(() =>
      runNDG(definition, { values: { level: 5, low: 1, high: 2 } }),
    ).toThrow(/exactly one active child/);
  });
});

describe("runNDG — memoisation", () => {
  it("evaluates a shared dependency only once", () => {
    let sharedEvaluations = 0;

    const nodes = [
      formula("shared", [], "1"),
      formula("left", [{ nodeId: "shared" }], "shared"),
      formula("right", [{ nodeId: "shared" }], "shared"),
      check("left + right", [{ nodeId: "left" }, { nodeId: "right" }]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        shared: () => {
          sharedEvaluations += 1;
          return 1;
        },
        left: ({ shared }) => shared,
        right: ({ shared }) => shared,
        utilisation: ({ left, right }) => left + right,
      },
    };

    const result = runNDG(definition, { values: {} });

    expect(sharedEvaluations).toBe(1);
    expect(result.utilisation).toBe(2);
  });
});

describe("runNDG — result and guards", () => {
  it("passes when utilisation is at most 1 and fails above it", () => {
    const nodes = [userInput("ratio"), check("ratio", [{ nodeId: "ratio" }])];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: { utilisation: ({ ratio }) => ratio },
    };

    expect(runNDG(definition, { values: { ratio: 1 } }).passed).toBe(true);
    expect(runNDG(definition, { values: { ratio: 1.0001 } }).passed).toBe(
      false,
    );
  });

  it("throws when a computed value is not finite", () => {
    const nodes = [
      userInput("numerator"),
      userInput("denominator"),
      check("numerator / denominator", [
        { nodeId: "numerator" },
        { nodeId: "denominator" },
      ]),
    ];
    const definition: NDGDefinition<typeof nodes> = {
      nodes,
      evaluate: {
        utilisation: ({ numerator, denominator }) => numerator / denominator,
      },
    };

    expect(() =>
      runNDG(definition, { values: { numerator: 1, denominator: 0 } }),
    ).toThrow(/division by zero/);
  });
});

describe("runNDGSuite", () => {
  it("isolates a failing verification without affecting the others", () => {
    const passingNodes = [userInput("x"), check("x", [{ nodeId: "x" }])];
    const passing: NDGDefinition<typeof passingNodes> = {
      nodes: passingNodes,
      evaluate: { utilisation: ({ x }) => x },
    };

    const failingNodes = [
      userInput("missing"),
      check("missing", [{ nodeId: "missing" }]),
    ];
    const failing: NDGDefinition<typeof failingNodes> = {
      nodes: failingNodes,
      evaluate: { utilisation: ({ missing }) => missing },
    };

    const rows = runNDGSuite(
      [
        { id: 1, ndg: passing },
        { id: 2, ndg: failing },
      ],
      { values: { x: 0.5 } },
    );

    expect(rows[0].payload.data?.utilisation).toBe(0.5);
    expect(rows[1].payload.error).toBeInstanceOf(Error);
  });
});

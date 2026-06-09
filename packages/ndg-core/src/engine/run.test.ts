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
  template: string,
  symbol?: string,
) => ({
  type: "formula" as const,
  variant: "compute" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  template,
  ...(symbol === undefined ? {} : { symbol }),
  children,
});

const selector = <K extends string>(key: K, children: Child[]) => ({
  type: "formula" as const,
  variant: "select" as const,
  key,
  id: key,
  valueType: { type: "number" as const },
  children,
});

const check = (template: string, children: Child[]) => ({
  type: "check" as const,
  variant: "compute" as const,
  key: "utilisation" as const,
  id: "check",
  name: "Check",
  valueType: { type: "number" as const },
  template,
  children,
});

const selectCheck = (children: Child[]) => ({
  type: "check" as const,
  variant: "select" as const,
  key: "utilisation" as const,
  id: "check",
  name: "Check",
  valueType: { type: "number" as const },
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

  it("exposes the formula template in trace entries", () => {
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

    expect(result.trace.find(entry => entry.key === "double")?.template).toBe(
      "2x",
    );
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

describe("runNDG — select node", () => {
  const nodes = [
    formula("plastic", [], "P", "M_{pl}"),
    formula("elastic", [], "E", "M_{el}"),
    selector("resistance", [
      { nodeId: "plastic", when: { eq: ["section_class", { value: 2 }] } },
      { nodeId: "elastic", when: { eq: ["section_class", { value: 3 }] } },
    ]),
    check("resistance", [{ nodeId: "resistance" }]),
  ];
  const definition: NDGDefinition<typeof nodes> = {
    nodes,
    evaluate: {
      plastic: () => 10,
      elastic: () => 20,
      utilisation: ({ resistance }) => resistance,
    },
  };

  it("forwards the value of the single active child", () => {
    expect(
      runNDG(definition, { values: { section_class: 2 } }).cache.resistance,
    ).toBe(10);
    expect(
      runNDG(definition, { values: { section_class: 3 } }).cache.resistance,
    ).toBe(20);
  });

  it("evaluates only the active branch", () => {
    const result = runNDG(definition, { values: { section_class: 2 } });
    expect(result.cache.plastic).toBe(10);
    expect(result.cache.elastic).toBeUndefined();
  });

  it("inherits the winning child in the trace under its own key", () => {
    const result = runNDG(definition, { values: { section_class: 3 } });

    const entry = result.trace.find(e => e.key === "resistance");
    expect(entry?.template).toBe("E");
    expect(entry?.symbol).toBe("M_{el}");
    expect(entry?.resolvedFrom).toBe("elastic");
    expect(result.trace.find(e => e.key === "elastic")).toBeDefined();
  });

  it("throws when no child is active", () => {
    expect(() => runNDG(definition, { values: { section_class: 1 } })).toThrow(
      /exactly one active child/,
    );
  });

  it("throws when more than one child is active", () => {
    const ambiguous = [
      formula("a", [], "A"),
      formula("b", [], "B"),
      selector("picked", [{ nodeId: "a" }, { nodeId: "b" }]),
      check("picked", [{ nodeId: "picked" }]),
    ];
    const def: NDGDefinition<typeof ambiguous> = {
      nodes: ambiguous,
      evaluate: { a: () => 1, b: () => 2, utilisation: ({ picked }) => picked },
    };
    expect(() => runNDG(def, { values: {} })).toThrow(
      /exactly one active child/,
    );
  });

  it("lets two select nodes resolve to the same shared child", () => {
    const shared = [
      formula("shared", [], "S", "W"),
      selector("left", [
        { nodeId: "shared", when: { eq: ["mode", { value: 1 }] } },
      ]),
      selector("right", [
        { nodeId: "shared", when: { eq: ["mode", { value: 1 }] } },
      ]),
      check("left + right", [{ nodeId: "left" }, { nodeId: "right" }]),
    ];
    const def: NDGDefinition<typeof shared> = {
      nodes: shared,
      evaluate: {
        shared: () => 5,
        utilisation: ({ left, right }) => left + right,
      },
    };

    const result = runNDG(def, { values: { mode: 1 } });

    expect(result.cache.left).toBe(5);
    expect(result.cache.right).toBe(5);
    expect(result.utilisation).toBe(10);
    expect(result.trace.find(e => e.key === "shared")).toBeDefined();
  });
});

describe("runNDG — select check", () => {
  const nodes = [
    userInput("raw"),
    formula("ratio", [{ nodeId: "raw" }], "\\key{raw}"),
    formula("u_low", [{ nodeId: "raw" }], "\\key{raw}", "u_{low}"),
    formula("u_high", [{ nodeId: "raw" }], "2\\key{raw}", "u_{high}"),
    selectCheck([
      { nodeId: "u_low", when: { lt: ["ratio", { value: 0.5 }] } },
      { nodeId: "u_high", when: { gte: ["ratio", { value: 0.5 }] } },
    ]),
  ];
  const definition: NDGDefinition<typeof nodes> = {
    nodes,
    evaluate: {
      ratio: ({ raw }) => raw,
      u_low: ({ raw }) => raw,
      u_high: ({ raw }) => raw * 2,
    },
  };

  it("forwards the winning verification branch as utilisation", () => {
    const low = runNDG(definition, { values: { raw: 0.3 } });
    expect(low.utilisation).toBe(0.3);
    expect(low.cache.u_high).toBeUndefined();

    const high = runNDG(definition, { values: { raw: 0.6 } });
    expect(high.utilisation).toBe(1.2);
    expect(high.cache.u_low).toBeUndefined();
  });

  it("inherits the winning branch in the check trace entry", () => {
    const result = runNDG(definition, { values: { raw: 0.3 } });
    const entry = result.trace.find(e => e.key === "utilisation");
    expect(entry?.symbol).toBe("u_{low}");
    expect(entry?.resolvedFrom).toBe("u_low");
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

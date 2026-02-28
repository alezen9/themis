import { describe, expect, it } from "vitest";
import { check, constant, derived, evaluate, input } from "../src";

describe("node builders", () => {
  it("builds a constant node and evaluates it through the engine constants map", () => {
    const p = "const-check";
    const nodes = [
      constant(p, "pi", "Pi", { symbol: "\\pi" }),
      input(p, "r", "Radius"),
      derived(p, "area_unit", "Unitless area term", ["pi", "r"], {
        expression: "\\pi r^2",
      }),
      check(p, "area_check", "Area check", ["area_unit"], {
        verificationExpression: "area\\_unit \\le 100",
      }),
    ] as const;

    const def = {
      nodes,
      evaluate: {
        area_unit: ({ pi, r }: { pi: number; r: number }) => pi * r * r,
        area_check: ({ area_unit }: { area_unit: number }) => area_unit / 100,
      },
    };

    const result = evaluate(def, {
      inputs: { r: 2 },
      annex: { id: "test", coefficients: {} },
    });

    expect(result.cache.pi).toBeCloseTo(Math.PI, 12);
    expect(result.cache.area_unit).toBeCloseTo(Math.PI * 4, 12);
    expect(result.ratio).toBeCloseTo((Math.PI * 4) / 100, 12);
  });
});


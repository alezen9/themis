import type { NDGTraceEntry } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { stepEquation } from "./traceEquation";

const entry = (
  key: string,
  value: NDGTraceEntry["value"],
  unit?: string,
  symbol?: string,
): NDGTraceEntry => ({
  nodeId: key,
  type: "user-input",
  key,
  value,
  unit,
  symbol,
  children: [],
});

const entryByKey = (...entries: NDGTraceEntry[]) =>
  new Map(entries.map(item => [item.key, item]));

describe("stepEquation", () => {
  it("renders the symbolic form, the substituted form and the result", () => {
    const tex = stepEquation(
      {
        symbol: "N_{pl,Rd}",
        template: "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
        value: 355000,
        unit: "N",
      },
      entryByKey(
        entry("A_mm2", 1000, "mm^2", "A"),
        entry("fy_MPa", 355, "\\mathrm{MPa}", "f_y"),
        entry("gamma_M0", 1, undefined, "\\gamma_{M0}"),
      ),
    );

    expect(tex).toContain("N_{pl,Rd} = \\frac{A \\cdot f_y}{\\gamma_{M0}}");
    expect(tex).toContain("\\text{1'000.00}\\,mm^2");
    expect(tex).toContain("\\text{355.00}\\,\\mathrm{MPa}");
    expect(tex).toContain("= \\text{355'000.00}\\,N");
  });

  it("renders an inequality template referencing a resolved resistance", () => {
    const tex = stepEquation(
      {
        symbol: "u_r",
        template: "\\frac{|\\key{M_Ed_Nmm}|}{\\key{M_c_Rd_Nmm}} \\leq 1.0",
        value: 0.5,
        unit: undefined,
      },
      entryByKey(
        entry("M_Ed_Nmm", 4000, "Nmm", "M_{Ed}"),
        entry("M_c_Rd_Nmm", 8000, "Nmm", "M_{el,Rd}"),
      ),
    );

    expect(tex).toContain("u_r = \\frac{|M_{Ed}|}{M_{el,Rd}} \\leq 1.0");
    expect(tex).toContain(
      "\\frac{|\\text{4'000.00}\\,Nmm|}{\\text{8'000.00}\\,Nmm} \\leq 1.0",
    );
    expect(tex).toContain("= \\text{0.50}");
  });
});

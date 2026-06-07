import type { NDGTraceEntry } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { stepEquation } from "./traceEquation";

const entry = (
  key: string,
  value: NDGTraceEntry["value"],
  unit?: string,
  type: NDGTraceEntry["type"] = "user-input",
): NDGTraceEntry => ({
  nodeId: key,
  type,
  key,
  value,
  unit,
  children: [],
});

const entryByKey = (...entries: NDGTraceEntry[]) =>
  new Map(entries.map(item => [item.key, item]));

describe("stepEquation", () => {
  it("renders a single expression with calculation and result", () => {
    const tex = stepEquation(
      {
        symbol: "N_{pl,Rd}",
        expressions: [
          {
            expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
            calculation: "\\frac{$A_mm2 \\cdot $fy_MPa}{$gamma_M0}",
          },
        ],
        value: 355000,
        unit: "N",
        evaluatorInputs: { A_mm2: 1000, fy_MPa: 355, gamma_M0: 1 },
      },
      entryByKey(
        entry("A_mm2", 1000, "mm^2"),
        entry("fy_MPa", 355, "\\mathrm{MPa}"),
        entry("gamma_M0", 1),
      ),
    );

    expect(tex).toContain("N_{pl,Rd} = \\frac{A \\cdot f_y}{\\gamma_{M0}}");
    expect(tex).toContain("\\text{1'000.00}\\,mm^2");
    expect(tex).toContain("\\text{355.00}\\,\\mathrm{MPa}");
    expect(tex).toContain("= \\text{355'000.00}\\,N");
  });

  it("appends the result only to the resolved row in a multi-expression block", () => {
    const tex = stepEquation(
      {
        symbol: "M_{c,Rd}",
        expressions: [
          {
            expression: "\\frac{|M_{Ed}|}{M_{pl,Rd}} \\leq 1.0",
            calculation: "\\frac{|$M_Ed_Nmm|}{$M_pl_Rd_Nmm} \\leq 1.0",
          },
          {
            expression: "\\frac{|M_{Ed}|}{M_{el,Rd}} \\leq 1.0",
            calculation: "\\frac{|$M_Ed_Nmm|}{$M_el_Rd_Nmm} \\leq 1.0",
          },
        ],
        value: 8000,
        unit: "Nmm",
        evaluatorInputs: { M_el_Rd_Nmm: 8000 },
      },
      entryByKey(
        entry("M_Ed_Nmm", 4000, "Nmm"),
        entry("M_pl_Rd_Nmm", 10000, "Nmm", "formula"),
        entry("M_el_Rd_Nmm", 8000, "Nmm", "formula"),
      ),
    );

    expect(tex).toContain("\\left\\{ \\begin{array}{l}");
    expect(tex).toContain("\\frac{|M_{Ed}|}{M_{pl,Rd}} \\leq 1.0 \\\\[10pt]");
    expect(tex).toContain(
      "\\frac{|M_{Ed}|}{M_{el,Rd}} \\leq 1.0 = \\frac{|\\text{4'000.00}\\,Nmm|}{\\text{8'000.00}\\,Nmm} \\leq 1.0 = \\text{8'000.00}\\,Nmm",
    );
  });
});

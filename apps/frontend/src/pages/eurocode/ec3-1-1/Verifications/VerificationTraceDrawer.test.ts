import type { NDGTraceEntry } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { stepEquation } from "./traceEquation";

const entry = (
  key: string,
  value: NDGTraceEntry["value"],
  symbol?: string,
): NDGTraceEntry => ({
  nodeId: key,
  type: "user-input",
  key,
  value,
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
        key: "N_pl_Rd_N",
        displayUnit: undefined,
      },
      entryByKey(
        entry("A_mm2", 1000, "A"),
        entry("fy_MPa", 355, "f_y"),
        entry("gamma_M0", 1, "\\gamma_{M0}"),
      ),
    );

    expect(tex).toContain("N_{pl,Rd} = \\frac{A \\cdot f_y}{\\gamma_{M0}}");
    expect(tex).toContain("\\text{1'000.00}\\,mm^2");
    expect(tex).toContain("\\text{355.00}\\,MPa");
    expect(tex).toContain("= \\text{355'000.00}\\,N");
  });

  it("renders an inequality template referencing a resolved resistance", () => {
    const tex = stepEquation(
      {
        symbol: "u_r",
        template: "\\frac{|\\key{M_y_Ed_Nmm}|}{\\key{M_c_Rd_Nmm}} \\leq 1.0",
        value: 0.5,
        key: "utilisation",
        displayUnit: undefined,
      },
      entryByKey(
        entry("M_y_Ed_Nmm", 4000, "M_{Ed}"),
        entry("M_c_Rd_Nmm", 8000, "M_{el,Rd}"),
      ),
    );

    expect(tex).toContain("u_r = \\frac{|M_{Ed}|}{M_{el,Rd}} \\leq 1.0");
    expect(tex).toContain(
      "\\frac{|\\text{4'000.00}\\,N{\\cdot}mm|}{\\text{8'000.00}\\,N{\\cdot}mm} \\leq 1.0",
    );
    expect(tex).toContain("= \\text{0.50}");
  });

  it("converts the result to the authored display unit", () => {
    const tex = stepEquation(
      {
        symbol: "M_{c,Rd}",
        template: "\\key{M_pl_Rd_Nmm}",
        value: 8_000_000,
        key: "M_c_Rd_Nmm",
        displayUnit: "kNm",
      },
      entryByKey(entry("M_pl_Rd_Nmm", 8_000_000, "M_{pl,Rd}")),
    );

    expect(tex).toContain("= \\text{8.00}\\,kN{\\cdot}m");
  });
});

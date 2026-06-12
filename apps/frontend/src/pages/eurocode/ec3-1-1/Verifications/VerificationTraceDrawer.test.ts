import type { NDGTraceEntry } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { buildStepParts, varClass } from "./traceEquation";

const entry = (
  key: string,
  value: NDGTraceEntry["value"],
  extra: Partial<NDGTraceEntry> = {},
): NDGTraceEntry => ({
  nodeId: key,
  type: "user-input",
  key,
  value,
  children: [],
  ...extra,
});

const entryByKey = (...entries: NDGTraceEntry[]) =>
  new Map(entries.map(item => [item.key, item]));

describe("varClass", () => {
  it("sanitises keys into css-safe class names", () => {
    expect(varClass("A_mm2")).toBe("var-A_mm2");
    expect(varClass("i_geometry.tw_mm")).toBe("var-i_geometry-tw_mm");
  });
});

describe("buildStepParts", () => {
  it("returns symbolic, substituted and result forms with tagged variables", () => {
    const parts = buildStepParts(
      entry("N_pl_Rd_N", 355000, {
        symbol: "N_{pl,Rd}",
        template: "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
      }),
      entryByKey(
        entry("A_mm2", 1000, { symbol: "A" }),
        entry("fy_MPa", 355, { symbol: "f_y" }),
        entry("gamma_M0", 1, { symbol: "\\gamma_{M0}" }),
      ),
    );

    expect(parts.symbolTex).toBe(
      "\\class{var-N_pl_Rd_N}{\\bbox[4px,transparent]{N_{pl,Rd}}}",
    );
    expect(parts.symbolicTex).toContain(
      "\\class{var-A_mm2}{\\bbox[4px,transparent]{A}}",
    );
    expect(parts.symbolicTex).toContain(
      "\\class{var-fy_MPa}{\\bbox[4px,transparent]{f_y}}",
    );
    expect(parts.numericTex).toContain(
      "\\class{var-A_mm2}{\\bbox[4px,transparent]{\\text{1'000.00}\\,mm^2}}",
    );
    expect(parts.numericTex).toContain(
      "\\class{var-fy_MPa}{\\bbox[4px,transparent]{\\text{355.00}\\,MPa}}",
    );
    expect(parts.resultTex).toBe(
      "\\class{var-N_pl_Rd_N}{\\bbox[4px,transparent]{\\text{355'000.00}\\,N}}",
    );
  });

  it("converts the result to the authored display unit", () => {
    const parts = buildStepParts(
      entry("M_c_Rd_Nmm", 8_000_000, {
        symbol: "M_{c,Rd}",
        template: "\\key{M_pl_Rd_Nmm}",
        displayUnit: "kNm",
      }),
      entryByKey(entry("M_pl_Rd_Nmm", 8_000_000, { symbol: "M_{pl,Rd}" })),
    );

    expect(parts.resultTex).toContain("\\text{8.00}\\,kN{\\cdot}m");
  });
});

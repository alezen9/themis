import { describe, expect, it } from "vitest";

import { latexPreview } from "./latexPreview";

describe("latexPreview", () => {
  it("renders a keyed template with placeholders escaped as text", () => {
    expect(
      latexPreview({
        symbol: "N_{pl,Rd}",
        template: "\\frac{\\key{A_mm2}}{\\key{gamma_M0}}",
        key: "N_pl_Rd_N",
      }),
    ).toBe(
      "N_{pl,Rd} = \\frac{\\class{key-ndg-editor-unresolved}{\\text{A_mm2}}}{\\class{key-ndg-editor-unresolved}{\\text{gamma_M0}}} \\quad (N)",
    );
  });

  it("swaps keys for symbols when a symbol map is provided", () => {
    expect(
      latexPreview({
        symbol: "N_{pl,Rd}",
        template: "\\frac{\\key{A_mm2}}{\\key{gamma_M0}}",
        symbolByKey: { A_mm2: "A", gamma_M0: "\\gamma_{M0}" },
      }),
    ).toBe("N_{pl,Rd} = \\frac{A}{\\gamma_{M0}}");
  });
});

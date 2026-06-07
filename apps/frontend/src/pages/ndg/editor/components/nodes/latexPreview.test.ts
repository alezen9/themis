import { describe, expect, it } from "vitest";

import { latexPreview } from "./latexPreview";

describe("latexPreview", () => {
  it("renders multiple formula expressions as one left brace block", () => {
    expect(
      latexPreview({
        symbol: "M_{c,Rd}",
        expressions: [
          {
            expression:
              "\\frac{M_{y,Ed}}{M_{pl,y,Rd}} \\leq 1.0 \\quad \\text{Class 1-2}",
          },
          {
            expression:
              "\\frac{M_{y,Ed}}{M_{el,y,Rd}} \\leq 1.0 \\quad \\text{Class 3}",
          },
        ],
        unit: "Nmm",
      }),
    ).toBe(
      "M_{c,Rd} = \\left\\{ \\begin{array}{l} \\frac{M_{y,Ed}}{M_{pl,y,Rd}} \\leq 1.0 \\quad \\text{Class 1-2} \\\\[10pt] \\frac{M_{y,Ed}}{M_{el,y,Rd}} \\leq 1.0 \\quad \\text{Class 3} \\end{array} \\right. \\quad (Nmm)",
    );
  });
});

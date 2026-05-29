import { describe, expect, it } from "vitest";

import { formatCondition } from "./format";

describe("formatCondition", () => {
  it("renders each comparison operator with its symbol", () => {
    expect(formatCondition({ eq: ["section_class", { value: 1 }] })).toBe(
      "section_class = 1",
    );
    expect(formatCondition({ lt: ["x", { value: 2 }] })).toBe("x < 2");
    expect(formatCondition({ lte: ["x", { value: 2 }] })).toBe("x ≤ 2");
    expect(formatCondition({ gt: ["x", { value: 2 }] })).toBe("x > 2");
    expect(formatCondition({ gte: ["x", { value: 2 }] })).toBe("x ≥ 2");
  });

  it("quotes string values and leaves key operands bare", () => {
    expect(formatCondition({ eq: ["shape", { value: "I" }] })).toBe(
      'shape = "I"',
    );
    expect(formatCondition({ eq: ["a", { key: "b" }] })).toBe("a = b");
  });

  it("joins and/or and parenthesizes nested groups", () => {
    const condition = {
      and: [
        { eq: ["section_class", { value: 1 }] },
        { or: [{ eq: ["shape", { value: "I" }] }, { eq: ["shape", { value: "H" }] }] },
      ],
    } as const;
    expect(formatCondition(condition)).toBe(
      'section_class = 1 AND (shape = "I" OR shape = "H")',
    );
  });
});

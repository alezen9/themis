import type { Condition } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { formatCondition } from "./format";
import { parseCondition } from "./parse";

describe("parseCondition", () => {
  it("treats empty input as no condition", () => {
    expect(parseCondition("   ")).toEqual({ ok: true, condition: undefined });
  });

  it("parses a single comparison with each operand kind", () => {
    expect(parseCondition("section_class = 1")).toEqual({
      ok: true,
      condition: { eq: ["section_class", { value: 1 }] },
    });
    expect(parseCondition('shape = "I"')).toEqual({
      ok: true,
      condition: { eq: ["shape", { value: "I" }] },
    });
    expect(parseCondition("a <= b")).toEqual({
      ok: true,
      condition: { lte: ["a", { key: "b" }] },
    });
  });

  it("binds AND tighter than OR", () => {
    expect(parseCondition("a = 1 AND b = 2 OR c = 3")).toEqual({
      ok: true,
      condition: {
        or: [
          { and: [{ eq: ["a", { value: 1 }] }, { eq: ["b", { value: 2 }] }] },
          { eq: ["c", { value: 3 }] },
        ],
      },
    });
  });

  it("lets parentheses override precedence", () => {
    expect(parseCondition("a = 1 AND (b = 2 OR c = 3)")).toEqual({
      ok: true,
      condition: {
        and: [
          { eq: ["a", { value: 1 }] },
          { or: [{ eq: ["b", { value: 2 }] }, { eq: ["c", { value: 3 }] }] },
        ],
      },
    });
  });

  it("reports an error for malformed input", () => {
    expect(parseCondition("a =").ok).toBe(false);
    expect(parseCondition("a = 1 AND").ok).toBe(false);
    expect(parseCondition("(a = 1").ok).toBe(false);
    expect(parseCondition('shape = "I').ok).toBe(false);
    expect(parseCondition("a = 1 b = 2").ok).toBe(false);
  });

  it("round-trips every formatted condition back to the same tree", () => {
    const conditions: Condition[] = [
      { eq: ["section_class", { value: 1 }] },
      { gte: ["lambda", { value: 0.5 }] },
      { eq: ["a", { key: "b" }] },
      {
        and: [
          { eq: ["section_class", { value: 1 }] },
          { or: [{ eq: ["shape", { value: "I" }] }, { eq: ["shape", { value: "H" }] }] },
        ],
      },
      {
        or: [
          { and: [{ gt: ["x", { value: 1 }] }, { lt: ["x", { value: 9 }] }] },
          { eq: ["bypass", { value: "yes" }] },
        ],
      },
    ];

    for (const condition of conditions)
      expect(parseCondition(formatCondition(condition))).toEqual({
        ok: true,
        condition,
      });
  });
});

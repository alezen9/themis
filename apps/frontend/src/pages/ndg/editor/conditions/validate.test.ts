import type { Condition } from "@ndg/ndg-core";
import { describe, expect, it } from "vitest";

import { findUnknownConditionKeys } from "./validate";

describe("findUnknownConditionKeys", () => {
  it("returns referenced keys that are absent from the graph", () => {
    const condition: Condition = {
      and: [
        { eq: ["section_class", { value: 1 }] },
        { gt: ["A_mm2", { key: "min_area" }] },
      ],
    };
    const available = new Set(["A_mm2", "section_class"]);

    expect(findUnknownConditionKeys(condition, available)).toEqual(["min_area"]);
  });

  it("returns nothing when every referenced key exists", () => {
    const condition: Condition = { eq: ["shape", { value: "I" }] };
    expect(findUnknownConditionKeys(condition, new Set(["shape"]))).toEqual([]);
  });
});

import { assert, describe, expect, it } from "vitest";

import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./geometrySchema";

describe("geometry schema refinements", () => {
  it("rejects I geometry with overlapping flange, web, or fillets", () => {
    const result = iGeometrySchema.safeParse({
      h_mm: 100,
      b_mm: 20,
      tw_mm: 10,
      tf_mm: 40,
      r_mm: 12,
    });

    expect(result.success).toBe(false);
    assert(!result.success);

    expect(result.error.issues[0]?.path).toEqual(["h_mm"]);
    expect(result.error.issues[1]?.path).toEqual(["b_mm"]);
    expect(result.error.issues[2]?.path).toEqual(["r_mm"]);
  });

  it("rejects RHS geometry with impossible radii or wall thickness", () => {
    const result = rhsGeometrySchema.safeParse({
      h_mm: 100,
      b_mm: 20,
      tw_mm: 12,
      ro_mm: 18,
      ri_mm: 20,
    });

    expect(result.success).toBe(false);
    assert(!result.success);

    expect(result.error.issues[0]?.path).toEqual(["ro_mm"]);
    expect(result.error.issues[2]?.path).toEqual(["b_mm"]);
    expect(result.error.issues[3]?.path).toEqual(["ri_mm"]);
  });

  it("rejects CHS geometry with wall thickness closing the section", () => {
    const result = chsGeometrySchema.safeParse({ d_mm: 20, t_mm: 10 });

    expect(result.success).toBe(false);
    assert(!result.success);

    expect(result.error.issues[0]?.path).toEqual(["d_mm"]);
  });
});

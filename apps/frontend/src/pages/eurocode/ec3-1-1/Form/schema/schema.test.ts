import { assert, describe, expect, it } from "vitest";

import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./geometrySchema";
import { nationalAnnexSchema } from "./nationalAnnexSchema";

describe("[EC3-1-1] schema", () => {
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
    expect(result.error.issues.map(issue => issue.path)).toEqual(
      expect.arrayContaining([
        ["h_mm"],
        ["b_mm"],
        ["tw_mm"],
        ["tf_mm"],
        ["r_mm"],
      ]),
    );
  });

  it("rejects RHS geometry with impossible radii or wall thickness", () => {
    const result = rhsGeometrySchema.safeParse({
      h_mm: 20,
      b_mm: 20,
      tw_mm: 12,
      ro_mm: 18,
      ri_mm: 20,
    });

    expect(result.success).toBe(false);
    assert(!result.success);

    expect(result.error.issues[0]?.path).toEqual(["ro_mm"]);
    expect(result.error.issues.map(issue => issue.path)).toEqual(
      expect.arrayContaining([
        ["h_mm"],
        ["b_mm"],
        ["tw_mm"],
        ["ri_mm"],
        ["ro_mm"],
      ]),
    );
  });

  it("rejects CHS geometry with wall thickness closing the section", () => {
    const result = chsGeometrySchema.safeParse({ d_mm: 20, t_mm: 10 });

    expect(result.success).toBe(false);
    assert(!result.success);

    expect(result.error.issues[0]?.path).toEqual(["d_mm"]);
    expect(result.error.issues[1]?.path).toEqual(["t_mm"]);
  });

  it("inactive f_method passes through its value and does not produce errors", () => {
    const base = {
      annex_id: "italian",
      gamma_M0: 1.05,
      gamma_M1: 1.05,
      eta: 1.0,
      lambda_LT_0: 0.4,
      beta_LT: 0.75,
      interaction_factor_method: "any",
    };

    const generalResult = nationalAnnexSchema.safeParse({
      ...base,
      buckling_curves_LT_policy: "general",
      f_method: "1",
    });
    expect(generalResult.success).toBe(true);
    assert(generalResult.success);
    expect(generalResult.data.f_method).toBe("1");

    const switchBackResult = nationalAnnexSchema.safeParse({
      ...base,
      buckling_curves_LT_policy: "default-rolled-welded",
      f_method: "1",
    });
    expect(switchBackResult.success).toBe(true);
    assert(switchBackResult.success);
    expect(switchBackResult.data.f_method).toBe("1");
  });
});

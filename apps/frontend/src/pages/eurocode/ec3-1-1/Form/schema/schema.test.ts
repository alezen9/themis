import { assert, describe, expect, it } from "vitest";

import { defaultValues } from "../defaultValues";
import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./geometrySchema";
import { Ec311FormValues, schema, validateFields } from "./schema";

const withValues = (
  overrides: Partial<Record<keyof Ec311FormValues, unknown>>,
) => ({ ...defaultValues, ...overrides }) as Ec311FormValues;

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

  it("validates f_method only for I shape with default-rolled-welded policy", () => {
    const isFMethodValid = (
      overrides: Partial<Record<keyof Ec311FormValues, unknown>>,
    ) => validateFields(withValues(overrides), ["f_method"]);

    // relevant: I + default-rolled-welded
    expect(
      isFMethodValid({
        shape: "I",
        buckling_curves_LT_policy: "default-rolled-welded",
        f_method: "1",
      }),
    ).toBe(true);
    expect(
      isFMethodValid({
        shape: "I",
        buckling_curves_LT_policy: "default-rolled-welded",
        f_method: "bogus",
      }),
    ).toBe(false);

    // irrelevant: general policy ignores a bad value
    expect(
      isFMethodValid({
        shape: "I",
        buckling_curves_LT_policy: "general",
        f_method: "bogus",
      }),
    ).toBe(true);

    // irrelevant: non-I shape ignores a bad value regardless of policy
    expect(
      isFMethodValid({
        shape: "RHS",
        buckling_curves_LT_policy: "default-rolled-welded",
        f_method: "bogus",
      }),
    ).toBe(true);
  });

  it("validates the lateral-torsional block only for active I sections", () => {
    const isKtValid = (
      overrides: Partial<Record<keyof Ec311FormValues, unknown>>,
    ) => validateFields(withValues(overrides), ["k_T"]);

    // relevant: I section with torsional modes on
    expect(
      isKtValid({ shape: "I", include_torsional_modes: true, k_T: 1 }),
    ).toBe(true);
    expect(
      isKtValid({ shape: "I", include_torsional_modes: true, k_T: -1 }),
    ).toBe(false);

    // irrelevant: torsional modes off
    expect(
      isKtValid({ shape: "I", include_torsional_modes: false, k_T: -1 }),
    ).toBe(true);

    // irrelevant: non-I shape, even with torsional modes on
    expect(
      isKtValid({ shape: "RHS", include_torsional_modes: true, k_T: -1 }),
    ).toBe(true);

    // LT moment-shape sub-fields follow the LT shape, still gated by section
    const isPsiLtValid = (
      overrides: Partial<Record<keyof Ec311FormValues, unknown>>,
    ) =>
      validateFields(
        withValues({ shape: "I", include_torsional_modes: true, ...overrides }),
        ["psi_y_LT"],
      );
    expect(isPsiLtValid({ M_y_Ed_shape_LT: "linear", psi_y_LT: 0 })).toBe(true);
    expect(isPsiLtValid({ M_y_Ed_shape_LT: "linear", psi_y_LT: 5 })).toBe(
      false,
    );
    expect(isPsiLtValid({ M_y_Ed_shape_LT: "uniform", psi_y_LT: 5 })).toBe(
      true,
    );
  });

  it("validates fabrication_type against the shape's allowed set", () => {
    const isFabValid = (
      overrides: Partial<Record<keyof Ec311FormValues, unknown>>,
    ) => validateFields(withValues(overrides), ["fabrication_type"]);

    expect(isFabValid({ shape: "I", fabrication_type: "rolled" })).toBe(true);
    expect(isFabValid({ shape: "I", fabrication_type: "cold-formed" })).toBe(
      false,
    );
    expect(isFabValid({ shape: "RHS", fabrication_type: "cold-formed" })).toBe(
      true,
    );
    expect(isFabValid({ shape: "RHS", fabrication_type: "rolled" })).toBe(
      false,
    );
    expect(isFabValid({ shape: "CHS", fabrication_type: "hot-formed" })).toBe(
      true,
    );
  });

  it("validates only the active shape's geometry", () => {
    const brokenIGeometry = {
      h_mm: 100,
      b_mm: 20,
      tw_mm: 10,
      tf_mm: 40,
      r_mm: 12,
    };
    const geometryKeys = [
      "i_geometry",
      "rhs_geometry",
      "chs_geometry",
    ] as const;

    expect(
      validateFields(withValues({ shape: "I", i_geometry: brokenIGeometry }), [
        ...geometryKeys,
      ]),
    ).toBe(false);

    expect(
      validateFields(
        withValues({ shape: "RHS", i_geometry: brokenIGeometry }),
        [...geometryKeys],
      ),
    ).toBe(true);
  });

  it("accepts the default form values", () => {
    expect(schema.safeParse(defaultValues).success).toBe(true);
  });
});

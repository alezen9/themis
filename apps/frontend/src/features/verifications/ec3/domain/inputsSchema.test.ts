import { describe, expect, it } from "vitest";
import { inputsSchema, sectionInputSchema } from "./inputsSchema";

const validIInputs = {
  shape: "I" as const,
  fabricationType: "rolled" as const,
  h: 300,
  b: 150,
  tw: 7.1,
  tf: 10.7,
  r: 15,
  fy: 235,
  E: 210000,
  G: 81000,
  N_Ed: 0,
  M_y_Ed: 0,
  M_z_Ed: 0,
  V_y_Ed: 0,
  V_z_Ed: 0,
  L: 6000,
  k_y: 1,
  k_z: 1,
  LLT_over_L: 1,
  LcrT_over_L: 1,
  psi_y: 0,
  psi_z: 0,
  psi_LT: 0,
  moment_shape_y: "uniform" as const,
  moment_shape_z: "uniform" as const,
  moment_shape_LT: "uniform" as const,
  support_condition_y: "pinned-pinned" as const,
  support_condition_z: "pinned-pinned" as const,
  support_condition_LT: "pinned-pinned" as const,
  load_application_LT: "centroid" as const,
  torsional_deformations: "no" as const,
  interaction_factor_method: "both" as const,
  coefficient_f_method: "default-equation" as const,
  buckling_curves_LT_policy: "default" as const,
  section_class_selection: "auto" as const,
};

describe("ec3 input schemas", () => {
  it("accepts a valid flat EC3 input object", () => {
    const parsed = inputsSchema.parse(validIInputs);

    expect(parsed).toEqual(validIInputs);
  });

  it("rejects impossible CHS geometry", () => {
    const result = sectionInputSchema.safeParse({
      shape: "CHS",
      fabricationType: "rolled",
      d: 120,
      t: 60,
    });

    expect(result.success).toBe(false);
  });

  it("rejects linear psi values outside the EC3 range", () => {
    const result = inputsSchema.safeParse({
      ...validIInputs,
      moment_shape_y: "linear",
      psi_y: 1.2,
    });

    expect(result.success).toBe(false);
  });

  it("allows non-linear shapes to carry psi placeholders", () => {
    const result = inputsSchema.safeParse({
      ...validIInputs,
      moment_shape_y: "parabolic",
      psi_y: 1.2,
    });

    expect(result.success).toBe(true);
  });
});

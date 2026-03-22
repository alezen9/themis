import { describe, expect, it } from "vitest";
import verify, {
  ec3VerificationDefinitions,
  type Ec3Inputs,
} from "./index";

const baseISectionInputs: Ec3Inputs = {
  N_Ed: -30_000,
  M_y_Ed: 50_000_000,
  M_z_Ed: 10_000_000,
  V_y_Ed: 5_000,
  V_z_Ed: 10_000,
  A: 5381,
  b: 150,
  h: 300,
  tf: 10.7,
  tw: 7.1,
  t: 7.1,
  Wel_y: 557_074,
  Wel_z: 80_504,
  Wpl_y: 628_356,
  Wpl_z: 125_219,
  Av_y: 3210,
  Av_z: 2568,
  hw: 278.6,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iy: 83_560_000,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_y: 1,
  k_z: 1,
  k_T: 1,
  k_LT: 1,
  psi_y: 1,
  psi_z: 1,
  psi_LT: 1,
  torsional_deformations: "yes",
  interaction_factor_method: "both",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_y: "uniform",
  support_condition_y: "pinned-pinned",
  moment_shape_z: "uniform",
  support_condition_z: "pinned-pinned",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  section_shape: "I",
  section_class: 2,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
};

describe("verify", () => {
  it("exports a stable public verification catalog in registry order", () => {
    expect(ec3VerificationDefinitions).toHaveLength(22);
    expect(ec3VerificationDefinitions.map((entry) => entry.checkId)).toEqual(
      Array.from({ length: 22 }, (_, index) => index + 1),
    );

    for (const entry of ec3VerificationDefinitions) {
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.check.name).toBe(entry.name);
      expect(entry.nodes.length).toBeGreaterThan(0);
      expect(entry.nodes.some((node) => node.type === "check")).toBe(true);
    }
  });

  it("returns the fixed 22-check contract in registry order", () => {
    const rows = verify(baseISectionInputs);

    expect(rows).toHaveLength(22);
    expect(rows.map((row) => row.checkId)).toEqual(
      Array.from({ length: 22 }, (_, index) => index + 1),
    );
  });

  it("returns only data or legitimate not-applicable rows for a valid I-section input set", () => {
    const rows = verify(baseISectionInputs);
    const unexpectedErrors = rows.filter(
      (row) =>
        row.payload.error !== undefined &&
        !row.payload.error.type.startsWith("not-applicable-"),
    );

    expect(unexpectedErrors).toEqual([]);
  });
});

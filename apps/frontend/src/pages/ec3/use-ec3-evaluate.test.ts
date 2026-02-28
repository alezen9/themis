import { describe, expect, it } from "vitest";
import {
  ANNEX_EDITABLE_KEYS,
  EDITABLE_INPUT_KEYS,
  REQUIRED_RUNTIME_INPUT_KEYS,
  SECTION_CLASS_OPTIONS,
  getRuntimeInputKeysFromGraph,
} from "./input-contract";
import {
  buildResolvedInputs,
  evaluateEc3Rows,
  hasData,
} from "./use-ec3-evaluate";
import type {
  AnnexCoeffs,
  Ec3EditableInputs,
  Ec3MaterialInputs,
  Ec3SectionDerivedInputs,
} from "./use-ec3-evaluate";

const annex: AnnexCoeffs = {
  gamma_M0: 1.0,
  gamma_M1: 1.0,
  lambda_LT_0: 0.4,
  beta_LT: 0.75,
};

const editableInputs: Ec3EditableInputs = {
  N_Ed: -200000,
  M_y_Ed: 20000000,
  M_z_Ed: 5000000,
  V_y_Ed: 10000,
  V_z_Ed: 50000,
  section_class: 2,
  L: 3000,
  k_y: 1,
  k_z: 1,
  k_LT: 1,
  moment_shape_y: "linear",
  support_condition_y: "pinned-pinned",
  moment_shape_z: "linear",
  support_condition_z: "pinned-pinned",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  psi_y: 0.1,
  psi_z: -0.2,
  psi_LT: 1,
};

const section: Ec3SectionDerivedInputs = {
  A: 2848,
  Wel_y: 200000,
  Wel_z: 50000,
  Wpl_y: 220600,
  Wpl_z: 57700,
  Av_y: 2848,
  Av_z: 1424,
  tw: 5.6,
  hw: 181.2,
  section_shape: "I",
  Iy: 19430000,
  Iz: 1424000,
  It: 69800,
  Iw: 12990000000,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
};

const material: Ec3MaterialInputs = {
  fy: 355,
  E: 210000,
  G: 81000,
};

describe("EC3 frontend input + evaluation contract", () => {
  it("matches runtime user-input keys required by graph", () => {
    const graphKeys = getRuntimeInputKeysFromGraph();
    expect(graphKeys).toEqual([...REQUIRED_RUNTIME_INPUT_KEYS]);
  });

  it("keeps editable keys and annex keys aligned with scope", () => {
    expect(EDITABLE_INPUT_KEYS).toContain("section_class");
    expect(SECTION_CLASS_OPTIONS).toEqual([1, 2, 3]);
    expect(ANNEX_EDITABLE_KEYS).toEqual(["gamma_M0", "gamma_M1", "lambda_LT_0", "beta_LT"]);
  });

  it("builds resolved input payload with exact required keys", () => {
    const resolved = buildResolvedInputs(editableInputs, section, material);
    const resolvedKeys = Object.keys(resolved).sort();
    expect(resolvedKeys).toEqual([...REQUIRED_RUNTIME_INPUT_KEYS]);
  });

  it("normalizes support condition aliases and clamps linear psi values", () => {
    const resolved = buildResolvedInputs(
      {
        ...editableInputs,
        support_condition_y: "pinned-fixed",
        support_condition_z: "pinned-fixed",
        support_condition_LT: "pinned-fixed",
        moment_shape_LT: "linear",
        psi_y: 2.5,
        psi_z: -4.2,
        psi_LT: 9.1,
      },
      section,
      material,
    );

    expect(resolved.support_condition_y).toBe("fixed-pinned");
    expect(resolved.support_condition_z).toBe("fixed-pinned");
    expect(resolved.support_condition_LT).toBe("fixed-pinned");
    expect(resolved.psi_y).toBe(1);
    expect(resolved.psi_z).toBe(-1);
    expect(resolved.psi_LT).toBe(1);
  });

  it("enforces payload exclusivity for all rows", () => {
    const resolved = buildResolvedInputs(editableInputs, section, material);
    const rows = evaluateEc3Rows(resolved, annex);
    expect(rows).toHaveLength(22);

    for (const row of rows) {
      const hasPayloadData = row.payload.data !== undefined;
      const hasPayloadError = row.payload.error !== undefined;
      expect(hasPayloadData !== hasPayloadError, `check ${row.checkId}`).toBe(true);
    }
  });

  it("does not preemptively block RHS check 12 and keeps engine as source of truth", () => {
    const resolved = buildResolvedInputs(
      editableInputs,
      { ...section, section_shape: "RHS", Iw: 0 },
      material,
    );
    const rows = evaluateEc3Rows(resolved, annex);
    const check12 = rows.find((row) => row.checkId === 12);
    expect(check12).toBeDefined();
    expect(hasData(check12!)).toBe(true);
  });
});

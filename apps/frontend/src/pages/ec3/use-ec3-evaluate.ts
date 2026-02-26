import { useMemo } from "react";
import {
  evaluate,
  ec3Verifications,
} from "@ndg/ndg-ec3";
import type { EvaluationResult, EvaluationContext, TraceEntry } from "@ndg/ndg-ec3";

/**
 * Unit system: mm / N / MPa (= N/mm²) / N·mm throughout.
 * - dimensions: mm, areas: mm², inertia: mm⁴, warping: mm⁶, section moduli: mm³
 * - forces: N, moments: N·mm, lengths: mm, strength/stiffness: MPa
 * Ratios produced by verifications are dimensionless.
 */
export interface Ec3Inputs {
  [key: string]: number | string;
  // Actions
  N_Ed: number;
  M_y_Ed: number;
  M_z_Ed: number;
  V_y_Ed: number;
  V_z_Ed: number;
  // Section
  A: number;
  Wpl_y: number;
  Wpl_z: number;
  Av_y: number;
  Av_z: number;
  /** Web thickness t_w — used in §6.2.8 bending+shear formulas */
  tw: number;
  /** Clear web height h_w — informational */
  hw: number;
  /** Section shape family: "I" | "RHS" | "CHS" — used in §6.2.9.1 biaxial exponents */
  section_shape: string;
  fy: number;
  E: number;
  G: number;
  // Inertia
  Iy: number;
  Iz: number;
  It: number;
  Iw: number;
  // Buckling
  Lcr_y: number;
  Lcr_z: number;
  Lcr_T: number;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
  M_cr: number;
  Cm_y: number;
  Cm_z: number;
  Cm_LT: number;
}

export interface AnnexCoeffs {
  [key: string]: number;
  gamma_M0: number;
  gamma_M1: number;
  gamma_M2: number;
  eta: number;
  lambda_LT_0: number;
  beta_LT: number;
}

export interface VerificationRow {
  name: string;
  ratio: number;
  passed: boolean;
  cache: Record<string, number | string>;
  trace: TraceEntry[];
  error?: string;
}

export function useEc3Evaluate(
  inputs: Ec3Inputs,
  annexCoeffs: AnnexCoeffs,
): VerificationRow[] {
  return useMemo(() => {
    const context: EvaluationContext = {
      inputs,
      annex: {
        id: "custom",
        coefficients: annexCoeffs,
      },
    };

    return ec3Verifications.map((v) => {
      const checkNode = [...v.nodes].reverse().find((n) => n.type === "check");
      const name = checkNode?.name ?? v.nodes[v.nodes.length - 1].key;

      try {
        const result: EvaluationResult = evaluate(v, context);
        return {
          name,
          ratio: result.ratio,
          passed: result.passed,
          cache: result.cache,
          trace: result.trace,
        };
      } catch (e) {
        return {
          name,
          ratio: NaN,
          passed: false,
          cache: {},
          trace: [],
          error: e instanceof Error ? e.message : String(e),
        };
      }
    });
  }, [inputs, annexCoeffs]);
}

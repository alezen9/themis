import { useMemo } from "react";
import {
  evaluate,
  ec3Verifications,
  toEc3VerificationFailure,
} from "@ndg/ndg-ec3";
import type { EvaluationResult, EvaluationContext } from "@ndg/ndg-ec3";
import type { Ec3VerificationFailure } from "@ndg/ndg-ec3";

export type SectionShape = "I" | "RHS" | "CHS";
export type SectionClass = 1 | 2 | 3;
export type MomentShape = "uniform" | "linear" | "parabolic" | "triangular";
export type SupportCondition = "pinned-pinned" | "fixed-pinned" | "fixed-fixed";
export type LoadApplicationLT = "top-flange" | "centroid" | "bottom-flange";

export type Ec3EditableInputs = {
  N_Ed: number;
  M_y_Ed: number;
  M_z_Ed: number;
  V_y_Ed: number;
  V_z_Ed: number;
  L: number;
  k_y: number;
  k_z: number;
  k_LT: number;
  psi_y: number;
  psi_z: number;
  psi_LT: number;
  moment_shape_y: MomentShape;
  moment_shape_z: MomentShape;
  moment_shape_LT: MomentShape;
  support_condition_y: SupportCondition;
  support_condition_z: SupportCondition;
  support_condition_LT: SupportCondition;
  load_application_LT: LoadApplicationLT;
  section_class: SectionClass;
};

export type Ec3SectionDerivedInputs = {
  A: number;
  Wel_y: number;
  Wel_z: number;
  Wpl_y: number;
  Wpl_z: number;
  Av_y: number;
  Av_z: number;
  tw: number;
  hw: number;
  section_shape: SectionShape;
  Iy: number;
  Iz: number;
  It: number;
  Iw: number;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
};

export type Ec3MaterialInputs = {
  fy: number;
  E: number;
  G: number;
};

export type Ec3ResolvedInputs = Ec3EditableInputs & Ec3SectionDerivedInputs & Ec3MaterialInputs;

export type AnnexCoeffs = {
  gamma_M0: number;
  gamma_M1: number;
  lambda_LT_0: number;
  beta_LT: number;
};

export type VerificationRow = {
  checkId: number;
  name: string;
  payload: {
    data?: EvaluationResult;
    error?: Ec3VerificationFailure;
  };
};

export const buildResolvedInputs = (
  editable: Ec3EditableInputs,
  section: Ec3SectionDerivedInputs,
  material: Ec3MaterialInputs,
): Ec3ResolvedInputs => ({
  ...editable,
  ...section,
  ...material,
});

export const hasData = (row: VerificationRow): row is VerificationRow & {
  payload: { data: EvaluationResult; error?: undefined };
} => row.payload.data !== undefined;

export const hasError = (row: VerificationRow): row is VerificationRow & {
  payload: { data?: undefined; error: Ec3VerificationFailure };
} => row.payload.error !== undefined;

export const isNotApplicable = (row: VerificationRow): boolean =>
  row.payload.error?.type?.startsWith("NOT_APPLICABLE") ?? false;

export const evaluateEc3Rows = (
  inputs: Ec3ResolvedInputs,
  annexCoeffs: AnnexCoeffs,
): VerificationRow[] => {
  const context: EvaluationContext = {
    inputs: inputs as unknown as Record<string, number | string>,
    annex: {
      id: "custom",
      coefficients: annexCoeffs,
    },
  };

  return ec3Verifications.map((verification, index) => {
    const checkId = index + 1;
    const checkNode = [...verification.nodes].reverse().find((node) => node.type === "check");
    const name = checkNode?.name ?? verification.nodes[verification.nodes.length - 1].key;

    try {
      const data = evaluate(verification, context);
      return {
        checkId,
        name,
        payload: { data },
      };
    } catch (error) {
      const failure = toEc3VerificationFailure(error);
      return {
        checkId,
        name,
        payload: { error: failure },
      };
    }
  });
};

export const useEc3Evaluate = (
  inputs: Ec3ResolvedInputs,
  annexCoeffs: AnnexCoeffs,
): VerificationRow[] => {
  return useMemo(() => evaluateEc3Rows(inputs, annexCoeffs), [inputs, annexCoeffs]);
};

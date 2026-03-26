import { useMemo } from "react";
import verify from "@ndg/ndg-ec3";

export type SectionShape = "I" | "RHS" | "CHS";
export type EditableSectionClass = "auto" | 1 | 2 | 3;
export type ResolvedSectionClass = 1 | 2 | 3 | 4;
export type MomentShape = "uniform" | "linear" | "parabolic" | "triangular";
export type SupportCondition =
  | "pinned-pinned"
  | "fixed-pinned"
  | "pinned-fixed"
  | "fixed-fixed";
export type LoadApplicationLT = "top-flange" | "centroid" | "bottom-flange";
export type TorsionalDeformations = "yes" | "no";
export type InteractionFactorMethod = "both" | "method1" | "method2" | "any";
export type CoefficientFMethod = "default-equation" | "force-1.0";
export type BucklingCurvesLtPolicy = "default" | "general";

export type Ec3EditableInputs = {
  N_Ed: number;
  M_y_Ed: number;
  M_z_Ed: number;
  V_y_Ed: number;
  V_z_Ed: number;
  L: number;
  k_y: number;
  k_z: number;
  LLT_over_L: number;
  LcrT_over_L: number;
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
  torsional_deformations: TorsionalDeformations;
  interaction_factor_method: InteractionFactorMethod;
  coefficient_f_method: CoefficientFMethod;
  buckling_curves_LT_policy: BucklingCurvesLtPolicy;
  section_class_mode: EditableSectionClass;
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
  h: number;
  b: number;
  tf: number;
  t: number;
};

export type Ec3MaterialInputs = { fy: number; E: number; G: number };

export type Ec3ResolvedInputs = Omit<
  Ec3EditableInputs,
  "section_class_mode" | "LLT_over_L" | "LcrT_over_L"
> & {
  section_class: ResolvedSectionClass;
  k_LT: number;
  k_T: number;
} & Ec3SectionDerivedInputs &
  Ec3MaterialInputs;

export type AnnexCoeffs = {
  gamma_M0: number;
  gamma_M1: number;
  lambda_LT_0: number;
  beta_LT: number;
};

export type VerificationRow = ReturnType<typeof verify>[number];
type EvaluationResult = NonNullable<VerificationRow["payload"]["data"]>;
export const FRONTEND_MAX_CHECK_ID = 22;

const clampPsi = (value: number): number => Math.max(-1, Math.min(1, value));
const canonicalSupportCondition = (
  value: SupportCondition,
): "pinned-pinned" | "fixed-pinned" | "fixed-fixed" =>
  value === "pinned-fixed" ? "fixed-pinned" : value;

export const buildResolvedInputs = (
  editable: Ec3EditableInputs,
  section: Ec3SectionDerivedInputs,
  material: Ec3MaterialInputs,
  resolvedSectionClass: ResolvedSectionClass,
): Ec3ResolvedInputs => {
  const normalized = { ...editable };

  if (normalized.moment_shape_y === "linear")
    normalized.psi_y = clampPsi(normalized.psi_y);
  if (normalized.moment_shape_z === "linear")
    normalized.psi_z = clampPsi(normalized.psi_z);
  if (normalized.moment_shape_LT === "linear")
    normalized.psi_LT = clampPsi(normalized.psi_LT);

  normalized.support_condition_y = canonicalSupportCondition(
    normalized.support_condition_y,
  );
  normalized.support_condition_z = canonicalSupportCondition(
    normalized.support_condition_z,
  );
  normalized.support_condition_LT = canonicalSupportCondition(
    normalized.support_condition_LT,
  );

  const resolvedEditable = { ...normalized } as Omit<
    Ec3EditableInputs,
    "section_class_mode" | "LLT_over_L" | "LcrT_over_L"
  >;
  delete (resolvedEditable as Partial<Ec3EditableInputs>).section_class_mode;
  delete (resolvedEditable as Partial<Ec3EditableInputs>).LLT_over_L;
  delete (resolvedEditable as Partial<Ec3EditableInputs>).LcrT_over_L;

  return {
    ...resolvedEditable,
    section_class: resolvedSectionClass,
    k_LT: normalized.LLT_over_L,
    k_T: normalized.LcrT_over_L,
    ...section,
    ...material,
  };
};

export const hasData = (
  row: VerificationRow,
): row is VerificationRow & {
  payload: { data: EvaluationResult; error?: undefined };
} => row.payload.data !== undefined;

export const hasError = (
  row: VerificationRow,
): row is VerificationRow & {
  payload: {
    data?: undefined;
    error: NonNullable<VerificationRow["payload"]["error"]>;
  };
} => row.payload.error !== undefined;

export const isNotApplicable = (row: VerificationRow): boolean =>
  row.payload.error?.type?.startsWith("not-applicable-") ?? false;

export const evaluateEc3Rows = (
  inputs: Ec3ResolvedInputs | null,
  annexCoeffs: AnnexCoeffs,
): VerificationRow[] => {
  if (inputs === null) return [];

  const rows = verify(inputs, { id: "custom", coefficients: annexCoeffs });
  return rows.filter((row) => row.checkId <= FRONTEND_MAX_CHECK_ID);
};

export const useEc3Evaluate = (
  inputs: Ec3ResolvedInputs | null,
  annexCoeffs: AnnexCoeffs,
): VerificationRow[] => {
  return useMemo(
    () => evaluateEc3Rows(inputs, annexCoeffs),
    [inputs, annexCoeffs],
  );
};

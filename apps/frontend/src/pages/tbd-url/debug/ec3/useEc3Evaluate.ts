import { useMemo } from "react";
import verify from "@ndg/ndg-ec3";
import { computeAdditionalProperties } from "../../../../features/verifications/ec3/domain/computeAdditionalProperties";
import type { Ec3FormValues } from "../../../../features/verifications/ec3/domain/formSchema";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SHAPE_OPTIONS,
  SUPPORT_CONDITION_VALUES,
  TORSIONAL_DEFORMATION_OPTIONS,
} from "../../../../features/verifications/ec3/options";

export type AnnexCoeffs = Pick<
  Ec3FormValues,
  "gamma_M0" | "gamma_M1" | "lambda_LT_0" | "beta_LT"
>;
export type SectionShape = (typeof SHAPE_OPTIONS)[number];
export type SectionClassSelection = (typeof SECTION_CLASS_OPTIONS)[number];
export type MomentShape = (typeof MOMENT_SHAPE_OPTIONS)[number];
export type SupportCondition = (typeof SUPPORT_CONDITION_VALUES)[number];
export type LoadApplicationLT = (typeof LOAD_APPLICATION_LT_OPTIONS)[number];
export type TorsionalDeformations =
  (typeof TORSIONAL_DEFORMATION_OPTIONS)[number];
export type InteractionFactorMethod =
  (typeof INTERACTION_FACTOR_METHOD_OPTIONS)[number];
export type CoefficientFMethod = (typeof COEFFICIENT_F_METHOD_OPTIONS)[number];
export type BucklingCurvesLtPolicy =
  (typeof BUCKLING_CURVES_LT_POLICY_OPTIONS)[number];
export type ResolvedSectionClass = 1 | 2 | 3;

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
  k_T: number;
  torsional_deformations: TorsionalDeformations;
  interaction_factor_method: InteractionFactorMethod;
  coefficient_f_method: CoefficientFMethod;
  buckling_curves_LT_policy: BucklingCurvesLtPolicy;
  section_class: SectionClassSelection;
  moment_shape_y: MomentShape;
  psi_y: number;
  support_condition_y: SupportCondition;
  moment_shape_z: MomentShape;
  psi_z: number;
  support_condition_z: SupportCondition;
  moment_shape_LT: MomentShape;
  psi_LT: number;
  support_condition_LT: SupportCondition;
  load_application_LT: LoadApplicationLT;
};

export type Ec3MaterialInputs = { E: number; G: number };

type Ec3ComputedProperties = ReturnType<typeof computeAdditionalProperties>;
type EngineSectionInputs = Omit<
  Ec3ComputedProperties,
  | "buckling_curve_y"
  | "buckling_curve_z"
  | "buckling_curve_LT"
  | "d"
  | "section_class"
>;

export type Ec3ResolvedInputs = Omit<Ec3EditableInputs, "section_class"> & {
  section_class: ResolvedSectionClass;
} & EngineSectionInputs &
  Ec3MaterialInputs;

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
  computedProperties: ReturnType<typeof computeAdditionalProperties>,
  material: Ec3MaterialInputs,
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

  const { section_class: _sectionClass, ...resolvedEditable } = normalized;
  void _sectionClass;

  const {
    buckling_curve_y: _bucklingCurveY,
    buckling_curve_z: _bucklingCurveZ,
    buckling_curve_LT: _bucklingCurveLT,
    d: _d,
    section_class,
    ...section
  } = computedProperties;
  void _bucklingCurveY;
  void _bucklingCurveZ;
  void _bucklingCurveLT;
  void _d;

  return { ...resolvedEditable, section_class, ...section, ...material };
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

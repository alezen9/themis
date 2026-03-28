import { useMemo } from "react";
import verify from "@ndg/ndg-ec3";
import type { Ec3SectionDerivedInputs } from "../domain/computedProperties";
import type {
  AnnexCoeffs,
  Ec3EditableInputs,
  Ec3MaterialInputs,
  ResolvedSectionClass,
  SupportCondition,
} from "../domain/inputs";

export type {
  AnnexCoeffs,
  BucklingCurvesLtPolicy,
  CoefficientFMethod,
  Ec3EditableInputs,
  Ec3MaterialInputs,
  EditableSectionClass,
  InteractionFactorMethod,
  LoadApplicationLT,
  MomentShape,
  ResolvedSectionClass,
  SectionShape,
  SupportCondition,
  TorsionalDeformations,
} from "../domain/inputs";
export type { Ec3SectionDerivedInputs } from "../domain/computedProperties";

export type Ec3ResolvedInputs = Omit<
  Ec3EditableInputs,
  "section_class_mode" | "LLT_over_L" | "LcrT_over_L"
> & {
  section_class: ResolvedSectionClass;
  k_LT: number;
  k_T: number;
} & Ec3SectionDerivedInputs &
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

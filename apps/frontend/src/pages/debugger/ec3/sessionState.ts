import { SUPPORT_CONDITION_VALUES } from "../../../features/verifications/ec3/options";
import { steelGrades } from "../../../features/verifications/ec3/data/steelGrades";
import type {
  AnnexCoeffs,
  Ec3EditableInputs,
  ResolvedSectionClass,
  SupportCondition,
} from "./useEc3Evaluate";
import {
  ANNEXES,
  CUSTOM_SECTION_ID,
  DEFAULT_ANNEX,
  DEFAULT_GRADE,
  DEFAULT_SECTION,
  DEFAULT_SHAPE,
  getSectionsByShape,
  INITIAL_CUSTOM_CHS_GEOMETRY,
  INITIAL_CUSTOM_I_GEOMETRY,
  INITIAL_CUSTOM_RHS_GEOMETRY,
  type CustomChsSectionGeometry,
  type CustomISectionGeometry,
  type CustomRhsSectionGeometry,
  type FabricationType,
  type ShapeKey,
} from "./config";

export const INITIAL_EDITABLE_INPUTS: Ec3EditableInputs = {
  N_Ed: -100_000,
  M_y_Ed: 20_000_000,
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  V_z_Ed: 50_000,
  section_class: "auto",
  L: 5000,
  k_y: 1,
  k_z: 1,
  k_LT: 1,
  k_T: 1,
  torsional_deformations: "yes",
  interaction_factor_method: "both",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_y: "linear",
  support_condition_y: "pinned-pinned",
  moment_shape_z: "linear",
  support_condition_z: "pinned-pinned",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  psi_y: 0,
  psi_z: 0,
  psi_LT: 1,
};

export type Ec3WorkbenchSessionState = {
  version: 1;
  shape: ShapeKey;
  selectedSectionId: string;
  customFabricationType: FabricationType;
  customISectionGeometry: CustomISectionGeometry;
  customRhsSectionGeometry: CustomRhsSectionGeometry;
  customChsSectionGeometry: CustomChsSectionGeometry;
  gradeId: string;
  editableInputs: Ec3EditableInputs;
  selectedAnnexId: string;
  annex: AnnexCoeffs;
  resolvedSectionClassHint: ResolvedSectionClass | null;
};

export type NormalizedInitialState = Omit<
  Ec3WorkbenchSessionState,
  "version" | "resolvedSectionClassHint"
>;

const isShapeKey = (value: unknown): value is ShapeKey =>
  typeof value === "string" &&
  (["I", "RHS", "CHS"] as const).includes(value as ShapeKey);

const isSupportCondition = (value: unknown): value is SupportCondition =>
  typeof value === "string" &&
  SUPPORT_CONDITION_VALUES.includes(value as SupportCondition);

const pickFiniteNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const coerceShape = (value: unknown): ShapeKey =>
  isShapeKey(value) ? value : DEFAULT_SHAPE;

const coerceSectionId = (shape: ShapeKey, value: unknown): string => {
  if (value === CUSTOM_SECTION_ID) return CUSTOM_SECTION_ID;
  if (typeof value === "string") {
    const sections = getSectionsByShape(shape);
    if (sections.some((section) => section.id === value)) return value;
  }
  return getSectionsByShape(shape)[0]?.id ?? DEFAULT_SECTION.id;
};

const coerceGradeId = (value: unknown): string => {
  if (typeof value === "string") {
    const [norm, id] = value.split(":");
    const exists = steelGrades.some(
      (grade) => grade.norm === norm && grade.id === id,
    );
    if (exists) return value;
  }
  return `${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`;
};

const coerceAnnexId = (value: unknown): string => {
  if (
    typeof value === "string" &&
    ANNEXES.some((annex) => annex.id === value)
  ) {
    return value;
  }
  return DEFAULT_ANNEX.id;
};

const coerceCustomISectionGeometry = (
  value: Partial<CustomISectionGeometry> | undefined,
): CustomISectionGeometry => ({
  h: pickFiniteNumber(value?.h, INITIAL_CUSTOM_I_GEOMETRY.h),
  b: pickFiniteNumber(value?.b, INITIAL_CUSTOM_I_GEOMETRY.b),
  tw: pickFiniteNumber(value?.tw, INITIAL_CUSTOM_I_GEOMETRY.tw),
  tf: pickFiniteNumber(value?.tf, INITIAL_CUSTOM_I_GEOMETRY.tf),
  r: pickFiniteNumber(value?.r, INITIAL_CUSTOM_I_GEOMETRY.r),
});

const coerceCustomRhsSectionGeometry = (
  value: Partial<CustomRhsSectionGeometry> | undefined,
): CustomRhsSectionGeometry => ({
  h: pickFiniteNumber(value?.h, INITIAL_CUSTOM_RHS_GEOMETRY.h),
  b: pickFiniteNumber(value?.b, INITIAL_CUSTOM_RHS_GEOMETRY.b),
  t: pickFiniteNumber(value?.t, INITIAL_CUSTOM_RHS_GEOMETRY.t),
  ro: pickFiniteNumber(value?.ro, INITIAL_CUSTOM_RHS_GEOMETRY.ro),
  ri: pickFiniteNumber(value?.ri, INITIAL_CUSTOM_RHS_GEOMETRY.ri),
});

const coerceCustomChsSectionGeometry = (
  value: Partial<CustomChsSectionGeometry> | undefined,
): CustomChsSectionGeometry => ({
  d: pickFiniteNumber(value?.d, INITIAL_CUSTOM_CHS_GEOMETRY.d),
  t: pickFiniteNumber(value?.t, INITIAL_CUSTOM_CHS_GEOMETRY.t),
});

const coerceEditableInputs = (
  value: Partial<Ec3EditableInputs> | undefined,
): Ec3EditableInputs => {
  if (!value) return { ...INITIAL_EDITABLE_INPUTS };
  const candidate = {
    ...INITIAL_EDITABLE_INPUTS,
    ...value,
    section_class:
      value.section_class ??
      (
        value as {
          section_class_selection?: Ec3EditableInputs["section_class"];
        }
      ).section_class_selection ??
      (value as { section_class_mode?: Ec3EditableInputs["section_class"] })
        .section_class_mode ??
      INITIAL_EDITABLE_INPUTS.section_class,
  };

  candidate.N_Ed = pickFiniteNumber(
    candidate.N_Ed,
    INITIAL_EDITABLE_INPUTS.N_Ed,
  );
  candidate.M_y_Ed = pickFiniteNumber(
    candidate.M_y_Ed,
    INITIAL_EDITABLE_INPUTS.M_y_Ed,
  );
  candidate.M_z_Ed = pickFiniteNumber(
    candidate.M_z_Ed,
    INITIAL_EDITABLE_INPUTS.M_z_Ed,
  );
  candidate.V_y_Ed = pickFiniteNumber(
    candidate.V_y_Ed,
    INITIAL_EDITABLE_INPUTS.V_y_Ed,
  );
  candidate.V_z_Ed = pickFiniteNumber(
    candidate.V_z_Ed,
    INITIAL_EDITABLE_INPUTS.V_z_Ed,
  );
  candidate.L = pickFiniteNumber(candidate.L, INITIAL_EDITABLE_INPUTS.L);
  candidate.k_y = pickFiniteNumber(candidate.k_y, INITIAL_EDITABLE_INPUTS.k_y);
  candidate.k_z = pickFiniteNumber(candidate.k_z, INITIAL_EDITABLE_INPUTS.k_z);
  candidate.k_LT = pickFiniteNumber(
    candidate.k_LT ?? (value as { LLT_over_L?: number }).LLT_over_L,
    INITIAL_EDITABLE_INPUTS.k_LT,
  );
  candidate.k_T = pickFiniteNumber(
    candidate.k_T ?? (value as { LcrT_over_L?: number }).LcrT_over_L,
    INITIAL_EDITABLE_INPUTS.k_T,
  );
  candidate.psi_y = pickFiniteNumber(
    candidate.psi_y,
    INITIAL_EDITABLE_INPUTS.psi_y,
  );
  candidate.psi_z = pickFiniteNumber(
    candidate.psi_z,
    INITIAL_EDITABLE_INPUTS.psi_z,
  );
  candidate.psi_LT = pickFiniteNumber(
    candidate.psi_LT,
    INITIAL_EDITABLE_INPUTS.psi_LT,
  );

  if (!isSupportCondition(candidate.support_condition_y)) {
    candidate.support_condition_y = INITIAL_EDITABLE_INPUTS.support_condition_y;
  }
  if (!isSupportCondition(candidate.support_condition_z)) {
    candidate.support_condition_z = INITIAL_EDITABLE_INPUTS.support_condition_z;
  }
  if (!isSupportCondition(candidate.support_condition_LT)) {
    candidate.support_condition_LT =
      INITIAL_EDITABLE_INPUTS.support_condition_LT;
  }

  return candidate;
};

const coerceAnnexCoeffs = (
  selectedAnnexId: string,
  value: Partial<AnnexCoeffs> | undefined,
) => {
  const annexDefaults =
    ANNEXES.find((annex) => annex.id === selectedAnnexId) ?? DEFAULT_ANNEX;

  return {
    gamma_M0: pickFiniteNumber(
      value?.gamma_M0,
      annexDefaults.coefficients.gamma_M0,
    ),
    gamma_M1: pickFiniteNumber(
      value?.gamma_M1,
      annexDefaults.coefficients.gamma_M1,
    ),
    lambda_LT_0: pickFiniteNumber(
      value?.lambda_LT_0,
      annexDefaults.coefficients.lambda_LT_0,
    ),
    beta_LT: pickFiniteNumber(
      value?.beta_LT,
      annexDefaults.coefficients.beta_LT,
    ),
  } satisfies AnnexCoeffs;
};

const canonicalizeSupportCondition = (
  condition: SupportCondition,
): Exclude<SupportCondition, "pinned-fixed"> =>
  condition === "pinned-fixed" ? "fixed-pinned" : condition;

export const normalizeInitialState = (
  initialSession?: Partial<Ec3WorkbenchSessionState> | null,
): NormalizedInitialState => {
  const shape = coerceShape(initialSession?.shape);
  const selectedAnnexId = coerceAnnexId(initialSession?.selectedAnnexId);

  return {
    shape,
    selectedSectionId: coerceSectionId(
      shape,
      initialSession?.selectedSectionId,
    ),
    customFabricationType:
      initialSession?.customFabricationType === "welded" ? "welded" : "rolled",
    customISectionGeometry: coerceCustomISectionGeometry(
      initialSession?.customISectionGeometry,
    ),
    customRhsSectionGeometry: coerceCustomRhsSectionGeometry(
      initialSession?.customRhsSectionGeometry,
    ),
    customChsSectionGeometry: coerceCustomChsSectionGeometry(
      initialSession?.customChsSectionGeometry,
    ),
    gradeId: coerceGradeId(initialSession?.gradeId),
    editableInputs: coerceEditableInputs(initialSession?.editableInputs),
    selectedAnnexId,
    annex: coerceAnnexCoeffs(selectedAnnexId, initialSession?.annex),
  };
};

export const normalizeEditableInputsForSession = (
  editableInputs: Ec3EditableInputs,
): Ec3EditableInputs => ({
  ...editableInputs,
  psi_y: Math.max(-1, Math.min(1, editableInputs.psi_y)),
  psi_z: Math.max(-1, Math.min(1, editableInputs.psi_z)),
  psi_LT: Math.max(-1, Math.min(1, editableInputs.psi_LT)),
  support_condition_y: canonicalizeSupportCondition(
    editableInputs.support_condition_y,
  ),
  support_condition_z: canonicalizeSupportCondition(
    editableInputs.support_condition_z,
  ),
  support_condition_LT: canonicalizeSupportCondition(
    editableInputs.support_condition_LT,
  ),
});

export const createDefaultEc3WorkbenchSessionState =
  (): Ec3WorkbenchSessionState => ({
    version: 1,
    shape: DEFAULT_SHAPE,
    selectedSectionId: DEFAULT_SECTION.id,
    customFabricationType: "rolled",
    customISectionGeometry: { ...INITIAL_CUSTOM_I_GEOMETRY },
    customRhsSectionGeometry: { ...INITIAL_CUSTOM_RHS_GEOMETRY },
    customChsSectionGeometry: { ...INITIAL_CUSTOM_CHS_GEOMETRY },
    gradeId: `${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`,
    editableInputs: { ...INITIAL_EDITABLE_INPUTS },
    selectedAnnexId: DEFAULT_ANNEX.id,
    annex: {
      gamma_M0: DEFAULT_ANNEX.coefficients.gamma_M0,
      gamma_M1: DEFAULT_ANNEX.coefficients.gamma_M1,
      lambda_LT_0: DEFAULT_ANNEX.coefficients.lambda_LT_0,
      beta_LT: DEFAULT_ANNEX.coefficients.beta_LT,
    },
    resolvedSectionClassHint: null,
  });

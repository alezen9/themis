import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  buildResolvedInputs,
  FRONTEND_MAX_CHECK_ID,
  hasData,
  isNotApplicable,
  useEc3Evaluate,
} from "./use-ec3-evaluate";
import { flangedSections, type FlangedSection } from "./data/flanged-sections";
import { hollowSections, type HollowSection } from "./data/hollow-sections";
import {
  circularSections,
  type CircularSection,
} from "./data/circular-sections";
import {
  steelGrades,
  STEEL_E,
  STEEL_G,
  type SteelGrade,
} from "./data/steel-grades";
import type {
  AnnexCoeffs,
  Ec3EditableInputs,
  Ec3ResolvedInputs,
  Ec3SectionDerivedInputs,
  ResolvedSectionClass,
  SupportCondition,
  VerificationRow,
} from "./use-ec3-evaluate";
import { ANNEX_EDITABLE_KEYS, SECTION_CLASS_OPTIONS } from "./input-contract";
import {
  computeSectionProperties,
  type FabricationType,
  type SectionInput,
} from "./compute-section-properties";
import computeClass from "./section-class";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";

type CatalogSection = FlangedSection | HollowSection | CircularSection;

export const ANNEXES: readonly {
  id: string;
  name: string;
  coefficients: Record<string, number>;
}[] = [italianAnnex, eurocodeAnnex];

export const SHAPE_OPTIONS = ["I", "RHS", "CHS"] as const;
export type ShapeKey = (typeof SHAPE_OPTIONS)[number];

export const CUSTOM_SECTION_ID = "custom";

const getSectionsByShape = (shape: ShapeKey): readonly CatalogSection[] => {
  if (shape === "I") return flangedSections;
  if (shape === "CHS") return circularSections;
  return hollowSections;
};

const DEFAULT_SHAPE: ShapeKey = "I";
const DEFAULT_I_SECTION = flangedSections.find(
  (section) => section.id === "IPE300",
)!;
const DEFAULT_RHS_SECTION = hollowSections[0]!;
const DEFAULT_CHS_SECTION = circularSections[0]!;
const DEFAULT_SECTION = DEFAULT_I_SECTION;
const DEFAULT_GRADE = steelGrades.find(
  (g) => g.id === "S235" && g.norm === "EN10025-2",
)!;
const DEFAULT_ANNEX = italianAnnex;

export type CustomISectionGeometry = {
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
};

export type CustomRhsSectionGeometry = {
  h: number;
  b: number;
  t: number;
  ro: number;
  ri: number;
};

export type CustomChsSectionGeometry = { d: number; t: number };

const INITIAL_CUSTOM_I_GEOMETRY: CustomISectionGeometry = {
  h: DEFAULT_I_SECTION.h,
  b: DEFAULT_I_SECTION.b,
  tw: DEFAULT_I_SECTION.tw,
  tf: DEFAULT_I_SECTION.tf,
  r: DEFAULT_I_SECTION.r,
};

const INITIAL_CUSTOM_RHS_GEOMETRY: CustomRhsSectionGeometry = {
  h: DEFAULT_RHS_SECTION.h,
  b: DEFAULT_RHS_SECTION.b,
  t: DEFAULT_RHS_SECTION.tw,
  ro: DEFAULT_RHS_SECTION.ro,
  ri: DEFAULT_RHS_SECTION.ri,
};

const INITIAL_CUSTOM_CHS_GEOMETRY: CustomChsSectionGeometry = {
  d: DEFAULT_CHS_SECTION.d,
  t: DEFAULT_CHS_SECTION.t,
};

const mapCatalogSectionToInput = (section: CatalogSection): SectionInput => {
  if (section.shape === "I") {
    return {
      shape: "I",
      fabricationType: "rolled",
      h: section.h,
      b: section.b,
      tw: section.tw,
      tf: section.tf,
      r: section.r,
      A: section.A,
      Iy: section.Iy,
      Iz: section.Iz,
      Wpl_y: section.Wpl_y,
      Wpl_z: section.Wpl_z,
      It: section.It,
      Iw: section.Iw,
    };
  }

  if (section.shape === "RHS") {
    return {
      shape: "RHS",
      fabricationType: "rolled",
      h: section.h,
      b: section.b,
      tw: section.tw,
      ro: section.ro,
      ri: section.ri,
      A: section.A,
      Iy: section.Iy,
      Iz: section.Iz,
      Wpl_y: section.Wpl_y,
      Wpl_z: section.Wpl_z,
      It: section.It,
    };
  }

  return {
    shape: "CHS",
    fabricationType: "rolled",
    d: section.d,
    t: section.t,
    A: section.A,
    Iy: section.Iy,
    Wpl_y: section.Wpl_y,
    It: section.It,
  };
};

const buildCustomSectionInput = (
  shape: ShapeKey,
  fabricationType: FabricationType,
  customISectionGeometry: CustomISectionGeometry,
  customRhsSectionGeometry: CustomRhsSectionGeometry,
  customChsSectionGeometry: CustomChsSectionGeometry,
): SectionInput => {
  if (shape === "I") {
    return {
      shape: "I",
      fabricationType,
      h: customISectionGeometry.h,
      b: customISectionGeometry.b,
      tw: customISectionGeometry.tw,
      tf: customISectionGeometry.tf,
      r: customISectionGeometry.r,
    };
  }

  if (shape === "RHS") {
    return {
      shape: "RHS",
      fabricationType,
      h: customRhsSectionGeometry.h,
      b: customRhsSectionGeometry.b,
      tw: customRhsSectionGeometry.t,
      ro: customRhsSectionGeometry.ro,
      ri: customRhsSectionGeometry.ri,
    };
  }

  return {
    shape: "CHS",
    fabricationType,
    d: customChsSectionGeometry.d,
    t: customChsSectionGeometry.t,
  };
};

const validateCustomSectionGeometry = (
  shape: ShapeKey,
  customISectionGeometry: CustomISectionGeometry,
  customRhsSectionGeometry: CustomRhsSectionGeometry,
  customChsSectionGeometry: CustomChsSectionGeometry,
): string | null => {
  if (shape === "I") {
    const { h, b, tw, tf, r } = customISectionGeometry;
    const hasInvalidInput =
      !Number.isFinite(h) ||
      !Number.isFinite(b) ||
      !Number.isFinite(tw) ||
      !Number.isFinite(tf) ||
      !Number.isFinite(r) ||
      h <= 0 ||
      b <= 0 ||
      tw <= 0 ||
      tf <= 0 ||
      r <= 0;

    if (hasInvalidInput) {
      return "Custom I-section geometry must use positive finite values for h, b, tw, tf, and r.";
    }

    return null;
  }

  if (shape === "RHS") {
    const { h, b, t, ro, ri } = customRhsSectionGeometry;
    const hasInvalidInput =
      !Number.isFinite(h) ||
      !Number.isFinite(b) ||
      !Number.isFinite(t) ||
      !Number.isFinite(ro) ||
      !Number.isFinite(ri) ||
      h <= 0 ||
      b <= 0 ||
      t <= 0 ||
      ro <= 0 ||
      ri <= 0;

    if (hasInvalidInput) {
      return "Custom RHS geometry must use positive finite values for h, b, t, ro, and ri.";
    }

    if (ro < ri) {
      return "Custom RHS geometry requires ro >= ri.";
    }

    if (h <= 2 * ro || b <= 2 * ro) {
      return "Custom RHS geometry requires h > 2*ro and b > 2*ro.";
    }

    if (h <= 2 * (ri + t) || b <= 2 * (ri + t)) {
      return "Custom RHS geometry requires h > 2*(ri+t) and b > 2*(ri+t).";
    }

    return null;
  }

  const { d, t } = customChsSectionGeometry;
  const hasInvalidInput =
    !Number.isFinite(d) || !Number.isFinite(t) || d <= 0 || t <= 0;

  if (hasInvalidInput) {
    return "Custom CHS geometry must use positive finite values for d and t.";
  }

  return null;
};

export const MOMENT_SHAPE_OPTIONS = [
  "uniform",
  "linear",
  "parabolic",
  "triangular",
] as const;
export const SUPPORT_CONDITION_OPTIONS = [
  "pinned-pinned",
  "pinned-fixed",
  "fixed-fixed",
] as const;
export const LOAD_APPLICATION_LT_OPTIONS = [
  "top-flange",
  "centroid",
  "bottom-flange",
] as const;
export const TORSIONAL_DEFORMATION_OPTIONS = ["yes", "no"] as const;
export const INTERACTION_FACTOR_METHOD_OPTIONS = [
  "both",
  "method1",
  "method2",
  "any",
] as const;
export const COEFFICIENT_F_METHOD_OPTIONS = [
  "default-equation",
  "force-1.0",
] as const;
export const BUCKLING_CURVES_LT_POLICY_OPTIONS = [
  "default",
  "general",
] as const;

export type EditableNumericKey = {
  [K in keyof Ec3EditableInputs]: Ec3EditableInputs[K] extends number
    ? K
    : never;
}[keyof Ec3EditableInputs];

export type FieldDef<K extends string = EditableNumericKey> = {
  key: K;
  label: string;
  displayUnit?: string;
  toEngine?: number;
};

export const FIELD_GROUPS: { legend: string; fields: FieldDef[] }[] = [
  {
    legend: "Actions",
    fields: [
      {
        key: "N_Ed",
        label: "N_Ed (comp<0)",
        displayUnit: "kN",
        toEngine: 1000,
      },
      { key: "M_y_Ed", label: "M_y,Ed", displayUnit: "kNm", toEngine: 1e6 },
      { key: "M_z_Ed", label: "M_z,Ed", displayUnit: "kNm", toEngine: 1e6 },
      { key: "V_y_Ed", label: "V_y,Ed", displayUnit: "kN", toEngine: 1000 },
      { key: "V_z_Ed", label: "V_z,Ed", displayUnit: "kN", toEngine: 1000 },
    ],
  },
  {
    legend: "Buckling",
    fields: [
      { key: "L", label: "L", displayUnit: "m", toEngine: 1000 },
      { key: "k_y", label: "Lcr,y / L" },
      { key: "k_z", label: "Lcr,z / L" },
      { key: "LLT_over_L", label: "LLT / L" },
      { key: "LcrT_over_L", label: "Lcr,T / L" },
    ],
  },
];

export const ANNEX_FIELDS: FieldDef<(typeof ANNEX_EDITABLE_KEYS)[number]>[] = [
  { key: "gamma_M0", label: "\u03B3_M0" },
  { key: "gamma_M1", label: "\u03B3_M1" },
  { key: "lambda_LT_0", label: "\u03BB_LT,0" },
  { key: "beta_LT", label: "\u03B2_LT" },
];

const FIELD_MAP: Record<string, FieldDef> = {};
for (const group of FIELD_GROUPS) {
  for (const field of group.fields) FIELD_MAP[field.key] = field;
}

export function toDisplay(key: string, engineValue: number): number {
  const factor = FIELD_MAP[key]?.toEngine;
  return factor ? engineValue / factor : engineValue;
}

function toEngineValue(key: string, displayValue: number): number {
  const factor = FIELD_MAP[key]?.toEngine;
  return factor ? displayValue * factor : displayValue;
}

function clampPsi(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

export const INITIAL_EDITABLE_INPUTS: Ec3EditableInputs = {
  N_Ed: -100_000,
  M_y_Ed: 20_000_000,
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  V_z_Ed: 50_000,
  section_class_mode: "auto",
  L: 5000,
  k_y: 1,
  k_z: 1,
  LLT_over_L: 1,
  LcrT_over_L: 1,
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

const resolveSectionClass = (
  section: SectionInput,
  fy: number,
  sectionDerived: Ec3SectionDerivedInputs,
  actions: Pick<Ec3EditableInputs, "N_Ed" | "M_y_Ed" | "M_z_Ed">,
  sectionClassMode: Ec3EditableInputs["section_class_mode"],
): ResolvedSectionClass => {
  if (sectionClassMode !== "auto") return sectionClassMode;
  if (section.shape === "I") {
    return computeClass({
      sectionShape: "I",
      fabricationType: section.fabricationType,
      yieldStrength: fy,
      depth: section.h,
      width: section.b,
      webThickness: section.tw,
      flangeThickness: section.tf,
      rootRadius: section.r,
      crossSectionArea: sectionDerived.A,
      elasticSectionModulusY: sectionDerived.Wel_y,
      elasticSectionModulusZ: sectionDerived.Wel_z,
      axialForceEd: actions.N_Ed,
      bendingMomentYEd: actions.M_y_Ed,
      bendingMomentZEd: actions.M_z_Ed,
    });
  }
  if (section.shape === "RHS") {
    return computeClass({
      sectionShape: "RHS",
      yieldStrength: fy,
      depth: section.h,
      width: section.b,
      wallThickness: section.tw,
      innerRadius: section.ri,
      crossSectionArea: sectionDerived.A,
      elasticSectionModulusY: sectionDerived.Wel_y,
      elasticSectionModulusZ: sectionDerived.Wel_z,
      axialForceEd: actions.N_Ed,
      bendingMomentYEd: actions.M_y_Ed,
      bendingMomentZEd: actions.M_z_Ed,
    });
  }
  return computeClass({
    sectionShape: "CHS",
    yieldStrength: fy,
    diameter: section.d,
    wallThickness: section.t,
    crossSectionArea: sectionDerived.A,
    elasticSectionModulusY: sectionDerived.Wel_y,
    elasticSectionModulusZ: sectionDerived.Wel_z,
    axialForceEd: actions.N_Ed,
    bendingMomentYEd: actions.M_y_Ed,
    bendingMomentZEd: actions.M_z_Ed,
  });
};

type GradesByNormGroup = { norm: string; grades: SteelGrade[] };

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

type NormalizedInitialState = Omit<
  Ec3WorkbenchSessionState,
  "version" | "resolvedSectionClassHint"
>;

const isShapeKey = (value: unknown): value is ShapeKey =>
  typeof value === "string" &&
  (SHAPE_OPTIONS as readonly string[]).includes(value);

const isSupportCondition = (value: unknown): value is SupportCondition =>
  typeof value === "string" &&
  (
    ["pinned-pinned", "fixed-pinned", "pinned-fixed", "fixed-fixed"] as const
  ).includes(value as SupportCondition);

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

const pickFiniteNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

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
  const candidate = { ...INITIAL_EDITABLE_INPUTS, ...value };
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
  candidate.LLT_over_L = pickFiniteNumber(
    candidate.LLT_over_L,
    INITIAL_EDITABLE_INPUTS.LLT_over_L,
  );
  candidate.LcrT_over_L = pickFiniteNumber(
    candidate.LcrT_over_L,
    INITIAL_EDITABLE_INPUTS.LcrT_over_L,
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

const normalizeInitialState = (
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

const canonicalizeSupportCondition = (
  condition: SupportCondition,
): Exclude<SupportCondition, "pinned-fixed"> =>
  condition === "pinned-fixed" ? "fixed-pinned" : condition;

const normalizeEditableInputsForSession = (
  editableInputs: Ec3EditableInputs,
): Ec3EditableInputs => ({
  ...editableInputs,
  psi_y: clampPsi(editableInputs.psi_y),
  psi_z: clampPsi(editableInputs.psi_z),
  psi_LT: clampPsi(editableInputs.psi_LT),
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

export type Ec3WorkbenchState = {
  shape: ShapeKey;
  setShape: Dispatch<SetStateAction<ShapeKey>>;
  selectedSectionId: string;
  setSelectedSectionId: Dispatch<SetStateAction<string>>;
  customFabricationType: FabricationType;
  setCustomFabricationType: Dispatch<SetStateAction<FabricationType>>;
  customISectionGeometry: CustomISectionGeometry;
  setCustomISectionGeometry: Dispatch<SetStateAction<CustomISectionGeometry>>;
  customRhsSectionGeometry: CustomRhsSectionGeometry;
  setCustomRhsSectionGeometry: Dispatch<
    SetStateAction<CustomRhsSectionGeometry>
  >;
  customChsSectionGeometry: CustomChsSectionGeometry;
  setCustomChsSectionGeometry: Dispatch<
    SetStateAction<CustomChsSectionGeometry>
  >;
  gradeId: string;
  setGradeId: Dispatch<SetStateAction<string>>;
  editableInputs: Ec3EditableInputs;
  setEditableInputs: Dispatch<SetStateAction<Ec3EditableInputs>>;
  selectedAnnexId: string;
  annex: AnnexCoeffs;
  sections: readonly CatalogSection[];
  isCustomSectionSelected: boolean;
  currentCatalogSection: CatalogSection | undefined;
  sectionForSummary: SectionInput;
  grade: SteelGrade;
  gradesByNorm: GradesByNormGroup[];
  resolvedInputs: Ec3ResolvedInputs | null;
  sectionDerivedInputs: Ec3SectionDerivedInputs | null;
  materialInputs: { fy: number; E: number; G: number };
  classResolutionMessage: string | null;
  resolvedSectionClass: ResolvedSectionClass | null;
  results: VerificationRow[];
  totalCount: number;
  passedCount: number;
  failedCount: number;
  notApplicableCount: number;
  yLinear: boolean;
  zLinear: boolean;
  ltLinear: boolean;
  torsionalActive: boolean;
  yNeedsSupport: boolean;
  zNeedsSupport: boolean;
  ltNonLinear: boolean;
  handleShapeChange: (nextShape: ShapeKey) => void;
  handleAnnexChange: (annexId: string) => void;
  setInput: (key: EditableNumericKey, value: number) => void;
  setEditableValue: <K extends keyof Ec3EditableInputs>(
    key: K,
    value: Ec3EditableInputs[K],
  ) => void;
  setCoeff: (key: keyof AnnexCoeffs, value: number) => void;
  toEngineDisplayValue: (key: string, displayValue: number) => number;
  sessionState: Ec3WorkbenchSessionState;
};

type UseEc3WorkbenchOptions = {
  initialSession?: Partial<Ec3WorkbenchSessionState> | null;
  resetKey?: string;
};

export const useEc3Workbench = (
  options: UseEc3WorkbenchOptions = {},
): Ec3WorkbenchState => {
  const normalizedInitialState = useMemo(
    () => normalizeInitialState(options.initialSession),
    [options.initialSession],
  );

  const [shape, setShape] = useState<ShapeKey>(normalizedInitialState.shape);
  const [selectedSectionId, setSelectedSectionId] = useState(
    normalizedInitialState.selectedSectionId,
  );
  const [customFabricationType, setCustomFabricationType] =
    useState<FabricationType>(normalizedInitialState.customFabricationType);
  const [customISectionGeometry, setCustomISectionGeometry] =
    useState<CustomISectionGeometry>(
      normalizedInitialState.customISectionGeometry,
    );
  const [customRhsSectionGeometry, setCustomRhsSectionGeometry] =
    useState<CustomRhsSectionGeometry>(
      normalizedInitialState.customRhsSectionGeometry,
    );
  const [customChsSectionGeometry, setCustomChsSectionGeometry] =
    useState<CustomChsSectionGeometry>(
      normalizedInitialState.customChsSectionGeometry,
    );
  const [gradeId, setGradeId] = useState(normalizedInitialState.gradeId);
  const [editableInputs, setEditableInputs] = useState<Ec3EditableInputs>(
    normalizedInitialState.editableInputs,
  );
  const [selectedAnnexId, setSelectedAnnexId] = useState(
    normalizedInitialState.selectedAnnexId,
  );
  const [annex, setAnnex] = useState<AnnexCoeffs>(normalizedInitialState.annex);

  useEffect(() => {
    setShape(normalizedInitialState.shape);
    setSelectedSectionId(normalizedInitialState.selectedSectionId);
    setCustomFabricationType(normalizedInitialState.customFabricationType);
    setCustomISectionGeometry(normalizedInitialState.customISectionGeometry);
    setCustomRhsSectionGeometry(
      normalizedInitialState.customRhsSectionGeometry,
    );
    setCustomChsSectionGeometry(
      normalizedInitialState.customChsSectionGeometry,
    );
    setGradeId(normalizedInitialState.gradeId);
    setEditableInputs(normalizedInitialState.editableInputs);
    setSelectedAnnexId(normalizedInitialState.selectedAnnexId);
    setAnnex(normalizedInitialState.annex);
  }, [normalizedInitialState, options.resetKey]);

  const sections = useMemo(() => getSectionsByShape(shape), [shape]);
  const isCustomSectionSelected = selectedSectionId === CUSTOM_SECTION_ID;
  const currentCatalogSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );
  const sectionForSummary = useMemo<SectionInput>(() => {
    if (isCustomSectionSelected) {
      return buildCustomSectionInput(
        shape,
        customFabricationType,
        customISectionGeometry,
        customRhsSectionGeometry,
        customChsSectionGeometry,
      );
    }

    const selectedCatalogSection =
      currentCatalogSection ?? sections[0] ?? DEFAULT_SECTION;
    return mapCatalogSectionToInput(selectedCatalogSection);
  }, [
    isCustomSectionSelected,
    shape,
    customFabricationType,
    customISectionGeometry,
    customRhsSectionGeometry,
    customChsSectionGeometry,
    currentCatalogSection,
    sections,
  ]);

  const grade = useMemo(() => {
    const [norm, id] = gradeId.split(":");
    return (
      steelGrades.find(
        (candidate) => candidate.norm === norm && candidate.id === id,
      ) ?? DEFAULT_GRADE
    );
  }, [gradeId]);

  const materialInputs = useMemo(
    () => ({ fy: grade.fy, E: STEEL_E, G: STEEL_G }),
    [grade.fy],
  );

  const {
    resolvedInputs,
    classResolutionMessage,
    resolvedSectionClass,
    sectionDerivedInputs,
  } = useMemo<{
    resolvedInputs: Ec3ResolvedInputs | null;
    classResolutionMessage: string | null;
    resolvedSectionClass: ResolvedSectionClass | null;
    sectionDerivedInputs: Ec3SectionDerivedInputs | null;
  }>(() => {
    if (isCustomSectionSelected) {
      const invalidCustomGeometryMessage = validateCustomSectionGeometry(
        shape,
        customISectionGeometry,
        customRhsSectionGeometry,
        customChsSectionGeometry,
      );

      if (invalidCustomGeometryMessage) {
        return {
          resolvedInputs: null,
          classResolutionMessage: invalidCustomGeometryMessage,
          resolvedSectionClass: null,
          sectionDerivedInputs: null,
        };
      }
    }

    const properties = computeSectionProperties(sectionForSummary);
    const sectionDerived = {
      A: properties.A,
      Wel_y: properties.Wel_y,
      Wel_z: properties.Wel_z,
      Wpl_y: properties.Wpl_y,
      Wpl_z: properties.Wpl_z,
      Av_y: properties.Av_y,
      Av_z: properties.Av_z,
      tw: properties.tw,
      hw: properties.hw,
      section_shape: properties.section_shape,
      Iy: properties.Iy,
      Iz: properties.Iz,
      It: properties.It,
      Iw: properties.Iw,
      alpha_y: properties.alpha_y,
      alpha_z: properties.alpha_z,
      alpha_LT: properties.alpha_LT,
      h: properties.h,
      b: properties.b,
      tf: properties.tf,
      t: properties.t,
    } satisfies Ec3SectionDerivedInputs;
    const nextResolvedSectionClass = resolveSectionClass(
      sectionForSummary,
      grade.fy,
      sectionDerived,
      {
        N_Ed: editableInputs.N_Ed,
        M_y_Ed: editableInputs.M_y_Ed,
        M_z_Ed: editableInputs.M_z_Ed,
      },
      editableInputs.section_class_mode,
    );

    if (
      editableInputs.section_class_mode === "auto" &&
      nextResolvedSectionClass === 4
    ) {
      return {
        resolvedInputs: null,
        classResolutionMessage:
          "Automatic section class resolved to class 4, which is not supported in this scope. Select class 1, 2, or 3 manually.",
        resolvedSectionClass: nextResolvedSectionClass,
        sectionDerivedInputs: sectionDerived,
      };
    }

    return {
      resolvedInputs: buildResolvedInputs(
        editableInputs,
        sectionDerived,
        materialInputs,
        nextResolvedSectionClass,
      ),
      classResolutionMessage: null,
      resolvedSectionClass: nextResolvedSectionClass,
      sectionDerivedInputs: sectionDerived,
    };
  }, [
    isCustomSectionSelected,
    shape,
    customISectionGeometry,
    customRhsSectionGeometry,
    customChsSectionGeometry,
    sectionForSummary,
    editableInputs,
    grade.fy,
    materialInputs,
  ]);

  const handleShapeChange = useCallback((nextShape: ShapeKey) => {
    setShape(nextShape);
    const nextSections = getSectionsByShape(nextShape);
    if (nextSections[0]) setSelectedSectionId(nextSections[0].id);
  }, []);

  const handleAnnexChange = useCallback((annexId: string) => {
    setSelectedAnnexId(annexId);
    const selected = ANNEXES.find((candidate) => candidate.id === annexId);
    if (!selected) return;
    setAnnex({
      gamma_M0: selected.coefficients.gamma_M0,
      gamma_M1: selected.coefficients.gamma_M1,
      lambda_LT_0: selected.coefficients.lambda_LT_0,
      beta_LT: selected.coefficients.beta_LT,
    });
  }, []);

  const setInput = useCallback(
    (key: EditableNumericKey, value: number) =>
      setEditableInputs((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setEditableValue = useCallback(
    <K extends keyof Ec3EditableInputs>(key: K, value: Ec3EditableInputs[K]) =>
      setEditableInputs((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setCoeff = useCallback(
    (key: keyof AnnexCoeffs, value: number) =>
      setAnnex((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const results = useEc3Evaluate(resolvedInputs, annex);
  const totalCount = results.length;
  const passedCount = results.filter(
    (row) => hasData(row) && row.payload.data.passed,
  ).length;
  const notApplicableCount = results.filter((row) =>
    isNotApplicable(row),
  ).length;
  const failedCount = totalCount - passedCount - notApplicableCount;

  const gradesByNorm = useMemo(() => {
    const grouped = new Map<string, GradesByNormGroup>();
    for (const candidate of steelGrades) {
      if (!grouped.has(candidate.norm)) {
        grouped.set(candidate.norm, { norm: candidate.norm, grades: [] });
      }
      grouped.get(candidate.norm)!.grades.push(candidate);
    }
    return [...grouped.values()];
  }, []);

  const yLinear = editableInputs.moment_shape_y === "linear";
  const zLinear = editableInputs.moment_shape_z === "linear";
  const ltLinear = editableInputs.moment_shape_LT === "linear";
  const torsionalActive = editableInputs.torsional_deformations === "yes";
  const yNeedsSupport =
    editableInputs.moment_shape_y === "parabolic" ||
    editableInputs.moment_shape_y === "triangular";
  const zNeedsSupport =
    editableInputs.moment_shape_z === "parabolic" ||
    editableInputs.moment_shape_z === "triangular";
  const ltNonLinear =
    editableInputs.moment_shape_LT === "parabolic" ||
    editableInputs.moment_shape_LT === "triangular";

  const sessionState = useMemo<Ec3WorkbenchSessionState>(
    () => ({
      version: 1,
      shape,
      selectedSectionId,
      customFabricationType,
      customISectionGeometry,
      customRhsSectionGeometry,
      customChsSectionGeometry,
      gradeId,
      editableInputs: normalizeEditableInputsForSession(editableInputs),
      selectedAnnexId,
      annex,
      resolvedSectionClassHint: resolvedSectionClass,
    }),
    [
      shape,
      selectedSectionId,
      customFabricationType,
      customISectionGeometry,
      customRhsSectionGeometry,
      customChsSectionGeometry,
      gradeId,
      editableInputs,
      selectedAnnexId,
      annex,
      resolvedSectionClass,
    ],
  );

  return {
    shape,
    setShape,
    selectedSectionId,
    setSelectedSectionId,
    customFabricationType,
    setCustomFabricationType,
    customISectionGeometry,
    setCustomISectionGeometry,
    customRhsSectionGeometry,
    setCustomRhsSectionGeometry,
    customChsSectionGeometry,
    setCustomChsSectionGeometry,
    gradeId,
    setGradeId,
    editableInputs,
    setEditableInputs,
    selectedAnnexId,
    annex,
    sections,
    isCustomSectionSelected,
    currentCatalogSection,
    sectionForSummary,
    grade,
    gradesByNorm,
    resolvedInputs,
    sectionDerivedInputs,
    materialInputs,
    classResolutionMessage,
    resolvedSectionClass,
    results,
    totalCount,
    passedCount,
    failedCount,
    notApplicableCount,
    yLinear,
    zLinear,
    ltLinear,
    torsionalActive,
    yNeedsSupport,
    zNeedsSupport,
    ltNonLinear,
    handleShapeChange,
    handleAnnexChange,
    setInput,
    setEditableValue,
    setCoeff,
    toEngineDisplayValue: toEngineValue,
    sessionState,
  };
};

export {
  DEFAULT_GRADE,
  DEFAULT_SECTION,
  FRONTEND_MAX_CHECK_ID,
  SECTION_CLASS_OPTIONS,
  getSectionsByShape,
};

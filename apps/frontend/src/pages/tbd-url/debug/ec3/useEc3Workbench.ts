import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  buildResolvedInputs,
  hasData,
  isNotApplicable,
  useEc3Evaluate,
} from "./useEc3Evaluate";
import { computeAdditionalProperties } from "../../../../features/verifications/ec3/domain/computeAdditionalProperties";
import { formSchema, type Ec3FormValues } from "../../../../features/verifications/ec3/domain/formSchema";
import {
  steelGrades,
  STEEL_E,
  STEEL_G,
  type SteelGrade,
} from "../../../../features/verifications/ec3/data/steelGrades";
import type {
  AnnexCoeffs,
  Ec3EditableInputs,
  Ec3ResolvedInputs,
  ResolvedSectionClass,
  VerificationRow,
} from "./useEc3Evaluate";
import { ANNEX_EDITABLE_KEYS } from "./inputContract";
import { type SectionInput } from "../../../../features/verifications/ec3/domain/geometry/sectionProperties";
import {
  ANNEXES,
  CUSTOM_SECTION_ID,
  DEFAULT_GRADE,
  DEFAULT_SECTION,
  getSectionsByShape,
  type CatalogSection,
  type CustomChsSectionGeometry,
  type CustomISectionGeometry,
  type CustomRhsSectionGeometry,
  type FabricationType,
  type ShapeKey,
} from "./config";
import {
  INITIAL_EDITABLE_INPUTS,
  normalizeEditableInputsForSession,
  normalizeInitialState,
  type Ec3WorkbenchSessionState,
} from "./sessionState";

type Ec3ComputedProperties = ReturnType<typeof computeAdditionalProperties>;

const mapCatalogSectionToInput = (section: CatalogSection): SectionInput => {
  if (section.shape === "I") {
    const { h, b, tw, tf, r } = section;

    return { shape: "I", fabricationType: "rolled", h, b, tw, tf, r };
  }

  if (section.shape === "RHS") {
    const { h, b, tw, ro, ri } = section;

    return { shape: "RHS", fabricationType: "rolled", h, b, tw, ro, ri };
  }

  const { d, t } = section;

  return { shape: "CHS", fabricationType: "rolled", d, t };
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

export type EditableNumericKey = {
  [K in Extract<
    keyof Ec3EditableInputs,
    string
  >]: Ec3EditableInputs[K] extends number ? K : never;
}[Extract<keyof Ec3EditableInputs, string>];

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
      { key: "k_LT", label: "Lcr,LT / L" },
      { key: "k_T", label: "Lcr,T / L" },
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

type GradesByNormGroup = { norm: string; grades: SteelGrade[] };

const buildMomentYFields = (editableInputs: Ec3EditableInputs) => {
  switch (editableInputs.moment_shape_y) {
    case "uniform":
      return { moment_shape_y: "uniform" };
    case "linear":
      return { moment_shape_y: "linear", psi_y: editableInputs.psi_y };
    case "parabolic":
      return {
        moment_shape_y: "parabolic",
        support_condition_y: editableInputs.support_condition_y,
      };
    case "triangular":
      return {
        moment_shape_y: "triangular",
        support_condition_y: editableInputs.support_condition_y,
      };
  }
};

const buildMomentZFields = (editableInputs: Ec3EditableInputs) => {
  switch (editableInputs.moment_shape_z) {
    case "uniform":
      return { moment_shape_z: "uniform" };
    case "linear":
      return { moment_shape_z: "linear", psi_z: editableInputs.psi_z };
    case "parabolic":
      return {
        moment_shape_z: "parabolic",
        support_condition_z: editableInputs.support_condition_z,
      };
    case "triangular":
      return {
        moment_shape_z: "triangular",
        support_condition_z: editableInputs.support_condition_z,
      };
  }
};

const buildLateralTorsionalFields = (editableInputs: Ec3EditableInputs) => {
  if (editableInputs.torsional_deformations === "no") {
    return { torsional_deformations: "no" };
  }

  const ltBase = {
    torsional_deformations: "yes" as const,
    k_LT: editableInputs.k_LT,
    k_T: editableInputs.k_T,
    coefficient_f_method: editableInputs.coefficient_f_method,
    buckling_curves_LT_policy: editableInputs.buckling_curves_LT_policy,
  };

  switch (editableInputs.moment_shape_LT) {
    case "uniform":
      return { ...ltBase, moment_shape_LT: "uniform" };
    case "linear":
      return {
        ...ltBase,
        moment_shape_LT: "linear",
        psi_LT: editableInputs.psi_LT,
      };
    case "parabolic":
      return {
        ...ltBase,
        moment_shape_LT: "parabolic",
        support_condition_LT: editableInputs.support_condition_LT,
        load_application_LT: editableInputs.load_application_LT,
      };
    case "triangular":
      return {
        ...ltBase,
        moment_shape_LT: "triangular",
        support_condition_LT: editableInputs.support_condition_LT,
        load_application_LT: editableInputs.load_application_LT,
      };
  }
};

const buildFormValues = (
  section: SectionInput,
  editableInputs: Ec3EditableInputs,
  gradeId: string,
  annexId: Ec3FormValues["annexId"],
  annex: AnnexCoeffs,
) =>
  formSchema.safeParse({
    ...section,
    gradeId,
    annexId,
    ...annex,
    section_class: editableInputs.section_class,
    N_Ed: editableInputs.N_Ed,
    M_y_Ed: editableInputs.M_y_Ed,
    M_z_Ed: editableInputs.M_z_Ed,
    V_y_Ed: editableInputs.V_y_Ed,
    V_z_Ed: editableInputs.V_z_Ed,
    L: editableInputs.L,
    k_y: editableInputs.k_y,
    k_z: editableInputs.k_z,
    interaction_factor_method: editableInputs.interaction_factor_method,
    ...buildMomentYFields(editableInputs),
    ...buildMomentZFields(editableInputs),
    ...buildLateralTorsionalFields(editableInputs),
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
  sectionDerivedInputs: Ec3ComputedProperties | null;
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
    sectionDerivedInputs: Ec3ComputedProperties | null;
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

    const formValuesResult = buildFormValues(
      sectionForSummary,
      editableInputs,
      gradeId,
      selectedAnnexId as Ec3FormValues["annexId"],
      annex,
    );

    if (!formValuesResult.success) {
      return {
        resolvedInputs: null,
        classResolutionMessage:
          formValuesResult.error.issues[0]?.message ??
          "Invalid EC3 form values",
        resolvedSectionClass: null,
        sectionDerivedInputs: null,
      };
    }

    let computedProperties: Ec3ComputedProperties;
    try {
      computedProperties = computeAdditionalProperties(formValuesResult.data);
    } catch (error) {
      return {
        resolvedInputs: null,
        classResolutionMessage:
          error instanceof Error
            ? error.message
            : "Invalid additional EC3 properties",
        resolvedSectionClass: null,
        sectionDerivedInputs: null,
      };
    }

    const nextResolvedSectionClass = computedProperties.section_class;

    return {
      resolvedInputs: buildResolvedInputs(
        editableInputs,
        computedProperties,
        materialInputs,
      ),
      classResolutionMessage: null,
      resolvedSectionClass: nextResolvedSectionClass,
      sectionDerivedInputs: computedProperties,
    };
  }, [
    isCustomSectionSelected,
    shape,
    customISectionGeometry,
    customRhsSectionGeometry,
    customChsSectionGeometry,
    sectionForSummary,
    editableInputs,
    gradeId,
    selectedAnnexId,
    annex,
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
      setEditableInputs((prev: Ec3EditableInputs) => ({
        ...prev,
        [key]: value,
      })),
    [],
  );

  const setEditableValue = useCallback(
    <K extends keyof Ec3EditableInputs>(key: K, value: Ec3EditableInputs[K]) =>
      setEditableInputs((prev: Ec3EditableInputs) => ({
        ...prev,
        [key]: value,
      })),
    [],
  );

  const setCoeff = useCallback(
    (key: keyof AnnexCoeffs, value: number) =>
      setAnnex((prev: AnnexCoeffs) => ({ ...prev, [key]: value })),
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

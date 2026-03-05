import { useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  buildResolvedInputs,
  FRONTEND_MAX_CHECK_ID,
  hasData,
  isNotApplicable,
  useEc3Evaluate,
} from "./use-ec3-evaluate";
import { Ec3Results } from "./Ec3Results";
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

const ANNEXES = [italianAnnex, eurocodeAnnex];

const SHAPE_OPTIONS = ["I", "RHS", "CHS"] as const;
type ShapeKey = (typeof SHAPE_OPTIONS)[number];

const CUSTOM_SECTION_ID = "custom";

const getSectionsByShape = (shape: ShapeKey): readonly CatalogSection[] => {
  if (shape === "I") return flangedSections;
  if (shape === "CHS") return circularSections;
  return hollowSections;
};

const DEFAULT_SHAPE: ShapeKey = "I";
const DEFAULT_I_SECTION = flangedSections.find((section) => section.id === "IPE300")!;
const DEFAULT_RHS_SECTION = hollowSections[0]!;
const DEFAULT_CHS_SECTION = circularSections[0]!;
const DEFAULT_SECTION = DEFAULT_I_SECTION;
const DEFAULT_GRADE = steelGrades.find(
  (g) => g.id === "S235" && g.norm === "EN10025-2",
)!;
const DEFAULT_ANNEX = italianAnnex;

type CustomISectionGeometry = {
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
};

type CustomRhsSectionGeometry = {
  h: number;
  b: number;
  t: number;
  ro: number;
  ri: number;
};

type CustomChsSectionGeometry = {
  d: number;
  t: number;
};

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
    !Number.isFinite(d) ||
    !Number.isFinite(t) ||
    d <= 0 ||
    t <= 0;

  if (hasInvalidInput) {
    return "Custom CHS geometry must use positive finite values for d and t.";
  }

  return null;
};

const MOMENT_SHAPE_OPTIONS = [
  "uniform",
  "linear",
  "parabolic",
  "triangular",
] as const;
const SUPPORT_CONDITION_OPTIONS = [
  "pinned-pinned",
  "pinned-fixed",
  "fixed-fixed",
] as const;
const LOAD_APPLICATION_LT_OPTIONS = [
  "top-flange",
  "centroid",
  "bottom-flange",
] as const;
const TORSIONAL_DEFORMATION_OPTIONS = ["yes", "no"] as const;
const INTERACTION_FACTOR_METHOD_OPTIONS = [
  "both",
  "method1",
  "method2",
  "any",
] as const;
const COEFFICIENT_F_METHOD_OPTIONS = ["default-equation", "force-1.0"] as const;
const BUCKLING_CURVES_LT_POLICY_OPTIONS = ["default", "general"] as const;

type EditableNumericKey = {
  [K in keyof Ec3EditableInputs]: Ec3EditableInputs[K] extends number
    ? K
    : never;
}[keyof Ec3EditableInputs];
type FieldDef<K extends string = EditableNumericKey> = {
  key: K;
  label: string;
  displayUnit?: string;
  toEngine?: number;
};

const FIELD_GROUPS: { legend: string; fields: FieldDef[] }[] = [
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

const ANNEX_FIELDS: FieldDef<(typeof ANNEX_EDITABLE_KEYS)[number]>[] = [
  { key: "gamma_M0", label: "\u03B3_M0" },
  { key: "gamma_M1", label: "\u03B3_M1" },
  { key: "lambda_LT_0", label: "\u03BB_LT,0" },
  { key: "beta_LT", label: "\u03B2_LT" },
];

const FIELD_MAP: Record<string, FieldDef> = {};
for (const group of FIELD_GROUPS) {
  for (const field of group.fields) FIELD_MAP[field.key] = field;
}

function toDisplay(key: string, engineValue: number): number {
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

const INITIAL_EDITABLE_INPUTS: Ec3EditableInputs = {
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
  torsional_deformations: "no",
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

function resolveSectionClass(
  section: SectionInput,
  fy: number,
  sectionDerived: Ec3SectionDerivedInputs,
  actions: Pick<Ec3EditableInputs, "N_Ed" | "M_y_Ed" | "M_z_Ed">,
  sectionClassMode: Ec3EditableInputs["section_class_mode"],
): 1 | 2 | 3 | 4 {
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
}

function NumberInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="w-20 shrink-0">{label}</span>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border px-1 py-0.5 w-36 tabular-nums"
      />
      {unit && <span className="text-gray-500 text-xs">{unit}</span>}
    </label>
  );
}

function FieldGroup({
  legend,
  fields,
  values,
  onChange,
}: {
  legend: string;
  fields: FieldDef[];
  values: Record<string, number>;
  onChange: (key: EditableNumericKey, engineValue: number) => void;
}) {
  return (
    <fieldset className="border p-3">
      <legend className="text-xs font-semibold px-1">{legend}</legend>
      <div className="space-y-1">
        {fields.map((field) => (
          <NumberInput
            key={field.key}
            label={field.label}
            unit={field.displayUnit}
            value={toDisplay(field.key, values[field.key])}
            onChange={(displayVal) =>
              onChange(
                field.key as EditableNumericKey,
                toEngineValue(field.key, displayVal),
              )
            }
          />
        ))}
      </div>
    </fieldset>
  );
}

function SectionSummary({
  section,
  sectionClassMode,
  resolvedSectionClass,
}: {
  section: SectionInput;
  sectionClassMode: Ec3EditableInputs["section_class_mode"];
  resolvedSectionClass: 1 | 2 | 3 | 4 | null;
}) {
  const computed = computeSectionProperties(section);
  const classDisplay =
    sectionClassMode === "auto"
      ? resolvedSectionClass === null
        ? "auto: —"
        : `auto: ${resolvedSectionClass}`
      : `manual: ${sectionClassMode}`;

  const geometryDisplay =
    section.shape === "I"
      ? `h=${section.h} mm, b=${section.b} mm, tw=${section.tw} mm, tf=${section.tf} mm, r=${section.r} mm`
      : section.shape === "RHS"
        ? `h=${section.h} mm, b=${section.b} mm, t=${section.tw} mm, ro=${section.ro} mm, ri=${section.ri} mm`
        : `d=${section.d} mm, t=${section.t} mm`;

  return (
    <div className="rounded border bg-gray-50 px-3 py-2 text-xs text-gray-700">
      <div className="grid grid-cols-[88px_1fr] gap-x-2 gap-y-1">
        <span className="font-medium text-gray-600">Shape</span>
        <span>
          {section.shape} ({section.fabricationType})
        </span>

        <span className="font-medium text-gray-600">Class</span>
        <span>{classDisplay}</span>

        <span className="font-medium text-gray-600">Geometry</span>
        <span>{geometryDisplay}</span>

        <span className="font-medium text-gray-600">Area</span>
        <span>{(computed.A / 100).toFixed(2)} cm²</span>

        <span className="font-medium text-gray-600">Wpl,y</span>
        <span>{(computed.Wpl_y / 1000).toFixed(1)} cm³</span>

        <span className="font-medium text-gray-600">Curves</span>
        <span>
          y/z/LT: {computed.bucklingY}/{computed.bucklingZ}/{computed.bucklingLT}
        </span>
      </div>
    </div>
  );
}

export function PageEc3() {
  const [shape, setShape] = useState<ShapeKey>(DEFAULT_SHAPE);
  const [selectedSectionId, setSelectedSectionId] = useState(DEFAULT_SECTION.id);
  const [customFabricationType, setCustomFabricationType] =
    useState<FabricationType>("rolled");
  const [customISectionGeometry, setCustomISectionGeometry] =
    useState<CustomISectionGeometry>(INITIAL_CUSTOM_I_GEOMETRY);
  const [customRhsSectionGeometry, setCustomRhsSectionGeometry] =
    useState<CustomRhsSectionGeometry>(INITIAL_CUSTOM_RHS_GEOMETRY);
  const [customChsSectionGeometry, setCustomChsSectionGeometry] =
    useState<CustomChsSectionGeometry>(INITIAL_CUSTOM_CHS_GEOMETRY);
  const [gradeId, setGradeId] = useState(
    `${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`,
  );
  const [editableInputs, setEditableInputs] = useState<Ec3EditableInputs>(
    INITIAL_EDITABLE_INPUTS,
  );
  const [selectedAnnexId, setSelectedAnnexId] = useState(DEFAULT_ANNEX.id);
  const [annex, setAnnex] = useState<AnnexCoeffs>({
    gamma_M0: DEFAULT_ANNEX.coefficients.gamma_M0,
    gamma_M1: DEFAULT_ANNEX.coefficients.gamma_M1,
    lambda_LT_0: DEFAULT_ANNEX.coefficients.lambda_LT_0,
    beta_LT: DEFAULT_ANNEX.coefficients.beta_LT,
  });

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

    const selectedCatalogSection = currentCatalogSection ?? sections[0] ?? DEFAULT_SECTION;
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

  const { resolvedInputs, classResolutionMessage, resolvedSectionClass } = useMemo<{
    resolvedInputs: Ec3ResolvedInputs | null;
    classResolutionMessage: string | null;
    resolvedSectionClass: 1 | 2 | 3 | 4 | null;
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
    const resolvedSectionClass = resolveSectionClass(
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
      resolvedSectionClass === 4
    ) {
      return {
        resolvedInputs: null,
        classResolutionMessage:
          "Automatic section class resolved to class 4, which is not supported in this scope. Select class 1, 2, or 3 manually.",
        resolvedSectionClass,
      };
    }

    return {
      resolvedInputs: buildResolvedInputs(
        editableInputs,
        sectionDerived,
        { fy: grade.fy, E: STEEL_E, G: STEEL_G },
        resolvedSectionClass,
      ),
      classResolutionMessage: null,
      resolvedSectionClass,
    };
  }, [
    isCustomSectionSelected,
    shape,
    customISectionGeometry,
    customRhsSectionGeometry,
    customChsSectionGeometry,
    sectionForSummary,
    editableInputs,
    grade,
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
    (
      key: keyof Ec3EditableInputs,
      value: Ec3EditableInputs[keyof Ec3EditableInputs],
    ) => setEditableInputs((prev) => ({ ...prev, [key]: value })),
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
    const grouped = new Map<string, { norm: string; grades: SteelGrade[] }>();
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

  return (
    <div className="p-8 max-w-6xl">
      <nav className="flex gap-4 mb-6 text-sm">
        <Link to="/" className="underline hover:no-underline">
          Home
        </Link>
      </nav>

      <h1 className="text-2xl font-bold mb-6">EC3 Verifications</h1>

      <div className="grid grid-cols-[1fr_2fr] gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">Section</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Shape</span>
                <select
                  value={shape}
                  onChange={(e) =>
                    handleShapeChange(e.target.value as ShapeKey)
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {SHAPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Section</span>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="border px-1 py-0.5 w-36"
                >
                  <option value={CUSTOM_SECTION_ID}>Custom</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.id}
                    </option>
                  ))}
                </select>
              </label>
              {isCustomSectionSelected && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">Fabrication</span>
                    <select
                      value={customFabricationType}
                      onChange={(event) =>
                        setCustomFabricationType(
                          event.target.value as FabricationType,
                        )
                      }
                      className="border px-1 py-0.5 w-36"
                    >
                      <option value="rolled">rolled</option>
                      <option value="welded">welded</option>
                    </select>
                  </label>
                  {shape === "I" && (
                    <>
                      <NumberInput
                        label="h"
                        unit="mm"
                        value={customISectionGeometry.h}
                        onChange={(value) =>
                          setCustomISectionGeometry((previous) => ({
                            ...previous,
                            h: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="b"
                        unit="mm"
                        value={customISectionGeometry.b}
                        onChange={(value) =>
                          setCustomISectionGeometry((previous) => ({
                            ...previous,
                            b: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="tw"
                        unit="mm"
                        value={customISectionGeometry.tw}
                        onChange={(value) =>
                          setCustomISectionGeometry((previous) => ({
                            ...previous,
                            tw: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="tf"
                        unit="mm"
                        value={customISectionGeometry.tf}
                        onChange={(value) =>
                          setCustomISectionGeometry((previous) => ({
                            ...previous,
                            tf: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="r"
                        unit="mm"
                        value={customISectionGeometry.r}
                        onChange={(value) =>
                          setCustomISectionGeometry((previous) => ({
                            ...previous,
                            r: value,
                          }))
                        }
                      />
                    </>
                  )}
                  {shape === "RHS" && (
                    <>
                      <NumberInput
                        label="h"
                        unit="mm"
                        value={customRhsSectionGeometry.h}
                        onChange={(value) =>
                          setCustomRhsSectionGeometry((previous) => ({
                            ...previous,
                            h: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="b"
                        unit="mm"
                        value={customRhsSectionGeometry.b}
                        onChange={(value) =>
                          setCustomRhsSectionGeometry((previous) => ({
                            ...previous,
                            b: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="t"
                        unit="mm"
                        value={customRhsSectionGeometry.t}
                        onChange={(value) =>
                          setCustomRhsSectionGeometry((previous) => ({
                            ...previous,
                            t: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="ro"
                        unit="mm"
                        value={customRhsSectionGeometry.ro}
                        onChange={(value) =>
                          setCustomRhsSectionGeometry((previous) => ({
                            ...previous,
                            ro: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="ri"
                        unit="mm"
                        value={customRhsSectionGeometry.ri}
                        onChange={(value) =>
                          setCustomRhsSectionGeometry((previous) => ({
                            ...previous,
                            ri: value,
                          }))
                        }
                      />
                    </>
                  )}
                  {shape === "CHS" && (
                    <>
                      <NumberInput
                        label="d"
                        unit="mm"
                        value={customChsSectionGeometry.d}
                        onChange={(value) =>
                          setCustomChsSectionGeometry((previous) => ({
                            ...previous,
                            d: value,
                          }))
                        }
                      />
                      <NumberInput
                        label="t"
                        unit="mm"
                        value={customChsSectionGeometry.t}
                        onChange={(value) =>
                          setCustomChsSectionGeometry((previous) => ({
                            ...previous,
                            t: value,
                          }))
                        }
                      />
                    </>
                  )}
                </>
              )}
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Class</span>
                <select
                  value={editableInputs.section_class_mode}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const nextClass =
                      rawValue === "auto"
                        ? "auto"
                        : (Number(rawValue) as Exclude<
                            Ec3EditableInputs["section_class_mode"],
                            "auto"
                          >);
                    setEditableValue("section_class_mode", nextClass);
                  }}
                  className="border px-1 py-0.5 w-36"
                >
                  {SECTION_CLASS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <SectionSummary
                section={sectionForSummary}
                sectionClassMode={editableInputs.section_class_mode}
                resolvedSectionClass={resolvedSectionClass}
              />
            </div>
          </fieldset>

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">Material</legend>
            <label className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0">Grade</span>
              <select
                value={gradeId}
                onChange={(e) => setGradeId(e.target.value)}
                className="border px-1 py-0.5 w-48"
              >
                {gradesByNorm.map((group) => (
                  <optgroup key={group.norm} label={group.norm}>
                    {group.grades.map((candidate) => (
                      <option
                        key={`${candidate.norm}:${candidate.id}`}
                        value={`${candidate.norm}:${candidate.id}`}
                      >
                        {candidate.id} (fy={candidate.fy})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </fieldset>

          {FIELD_GROUPS.map((group) => (
            <FieldGroup
              key={group.legend}
              legend={group.legend}
              fields={
                group.legend === "Buckling" && !torsionalActive
                  ? group.fields.filter(
                      (field) =>
                        field.key !== "LLT_over_L" &&
                        field.key !== "LcrT_over_L",
                    )
                  : group.fields
              }
              values={editableInputs as unknown as Record<string, number>}
              onChange={setInput}
            />
          ))}

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">
              Stability Options
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">torsional</span>
                <select
                  value={editableInputs.torsional_deformations}
                  onChange={(e) =>
                    setEditableValue(
                      "torsional_deformations",
                      e.target
                        .value as Ec3EditableInputs["torsional_deformations"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {TORSIONAL_DEFORMATION_OPTIONS.map((option) => (
                    <option key={`td-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">k-method</span>
                <select
                  value={editableInputs.interaction_factor_method}
                  onChange={(e) =>
                    setEditableValue(
                      "interaction_factor_method",
                      e.target
                        .value as Ec3EditableInputs["interaction_factor_method"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {INTERACTION_FACTOR_METHOD_OPTIONS.map((option) => (
                    <option key={`ifm-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">f method</span>
                <select
                  value={editableInputs.coefficient_f_method}
                  onChange={(e) =>
                    setEditableValue(
                      "coefficient_f_method",
                      e.target
                        .value as Ec3EditableInputs["coefficient_f_method"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {COEFFICIENT_F_METHOD_OPTIONS.map((option) => (
                    <option key={`fm-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">LT curves</span>
                <select
                  value={editableInputs.buckling_curves_LT_policy}
                  onChange={(e) =>
                    setEditableValue(
                      "buckling_curves_LT_policy",
                      e.target
                        .value as Ec3EditableInputs["buckling_curves_LT_policy"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {BUCKLING_CURVES_LT_POLICY_OPTIONS.map((option) => (
                    <option key={`ltc-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">Moment Shape</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape y</span>
                <select
                  value={editableInputs.moment_shape_y}
                  onChange={(e) =>
                    setEditableValue(
                      "moment_shape_y",
                      e.target.value as Ec3EditableInputs["moment_shape_y"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`y-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {yLinear ? (
                <NumberInput
                  label="psi_y"
                  value={editableInputs.psi_y}
                  onChange={(value) => setInput("psi_y", clampPsi(value))}
                  unit="[-1,1]"
                />
              ) : null}
              {yNeedsSupport && (
                <label className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0">support y</span>
                  <select
                    value={editableInputs.support_condition_y}
                    onChange={(e) =>
                      setEditableValue(
                        "support_condition_y",
                        e.target
                          .value as Ec3EditableInputs["support_condition_y"],
                      )
                    }
                    className="border px-1 py-0.5 w-36"
                  >
                    {SUPPORT_CONDITION_OPTIONS.map((option) => (
                      <option key={`sy-${option}`} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape z</span>
                <select
                  value={editableInputs.moment_shape_z}
                  onChange={(e) =>
                    setEditableValue(
                      "moment_shape_z",
                      e.target.value as Ec3EditableInputs["moment_shape_z"],
                    )
                  }
                  className="border px-1 py-0.5 w-36"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`z-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {zLinear ? (
                <NumberInput
                  label="psi_z"
                  value={editableInputs.psi_z}
                  onChange={(value) => setInput("psi_z", clampPsi(value))}
                  unit="[-1,1]"
                />
              ) : null}
              {zNeedsSupport && (
                <label className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0">support z</span>
                  <select
                    value={editableInputs.support_condition_z}
                    onChange={(e) =>
                      setEditableValue(
                        "support_condition_z",
                        e.target
                          .value as Ec3EditableInputs["support_condition_z"],
                      )
                    }
                    className="border px-1 py-0.5 w-36"
                  >
                    {SUPPORT_CONDITION_OPTIONS.map((option) => (
                      <option key={`sz-${option}`} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {torsionalActive && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">shape LT</span>
                    <select
                      value={editableInputs.moment_shape_LT}
                      onChange={(e) =>
                        setEditableValue(
                          "moment_shape_LT",
                          e.target
                            .value as Ec3EditableInputs["moment_shape_LT"],
                        )
                      }
                      className="border px-1 py-0.5 w-36"
                    >
                      {MOMENT_SHAPE_OPTIONS.map((option) => (
                        <option key={`lt-${option}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  {ltLinear && (
                    <NumberInput
                      label="psi_LT"
                      value={editableInputs.psi_LT}
                      onChange={(value) => setInput("psi_LT", clampPsi(value))}
                      unit="[-1,1]"
                    />
                  )}
                  {ltNonLinear && (
                    <>
                      <label className="flex items-center gap-2 text-sm">
                        <span className="w-20 shrink-0">support LT</span>
                        <select
                          value={editableInputs.support_condition_LT}
                          onChange={(e) =>
                            setEditableValue(
                              "support_condition_LT",
                              e.target
                                .value as Ec3EditableInputs["support_condition_LT"],
                            )
                          }
                          className="border px-1 py-0.5 w-36"
                        >
                          {SUPPORT_CONDITION_OPTIONS.map((option) => (
                            <option key={`slt-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <span className="w-20 shrink-0">load LT</span>
                        <select
                          value={editableInputs.load_application_LT}
                          onChange={(e) =>
                            setEditableValue(
                              "load_application_LT",
                              e.target
                                .value as Ec3EditableInputs["load_application_LT"],
                            )
                          }
                          className="border px-1 py-0.5 w-36"
                        >
                          {LOAD_APPLICATION_LT_OPTIONS.map((option) => (
                            <option key={`llt-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                </>
              )}
            </div>
          </fieldset>

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">
              National Annex
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm mb-2">
                <span className="w-20 shrink-0">Annex</span>
                <select
                  value={selectedAnnexId}
                  onChange={(e) => handleAnnexChange(e.target.value)}
                  className="border px-1 py-0.5 w-48"
                >
                  {ANNEXES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              {ANNEX_FIELDS.map((field) => (
                <NumberInput
                  key={field.key}
                  label={field.label}
                  unit={field.displayUnit}
                  value={annex[field.key]}
                  onChange={(value) => setCoeff(field.key, value)}
                />
              ))}
            </div>
          </fieldset>
        </form>

        <div>
          {classResolutionMessage && (
            <div className="mb-3 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {classResolutionMessage}
            </div>
          )}
          <h2 className="font-semibold mb-3">
            Results ({passedCount}/{totalCount} passed, {failedCount}/
            {totalCount} failed, {notApplicableCount}/{totalCount} N/A)
            <span className="text-xs text-gray-500 ml-2">
              checks 01-{String(FRONTEND_MAX_CHECK_ID).padStart(2, "0")}
            </span>
          </h2>
          <Ec3Results results={results} />
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { buildResolvedInputs, hasData, isNotApplicable, useEc3Evaluate } from "./use-ec3-evaluate";
import { Ec3Results } from "./Ec3Results";
import {
  flangedSections,
  hollowSections,
  circularSections,
  steelGrades,
  STEEL_E,
  STEEL_G,
} from "./data";
import type { Section, SteelGrade } from "./data";
import type { AnnexCoeffs, Ec3EditableInputs, Ec3SectionDerivedInputs } from "./use-ec3-evaluate";
import {
  ANNEX_EDITABLE_KEYS,
  SECTION_CLASS_OPTIONS,
} from "./input-contract";
import { computeSectionProperties } from "./compute-section-properties";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import type { Ec3NationalAnnex } from "@ndg/ndg-ec3";

const ANNEXES: Ec3NationalAnnex[] = [italianAnnex, eurocodeAnnex];

const SHAPE_OPTIONS = ["I", "RHS", "CHS"] as const;
type ShapeKey = (typeof SHAPE_OPTIONS)[number];

function getSectionTypes(shape: ShapeKey): string[] {
  if (shape === "I") return [...new Set(flangedSections.map((s) => s.sectionType))];
  if (shape === "CHS") return [...new Set(circularSections.map((s) => s.sectionType))];
  return [...new Set(hollowSections.map((s) => s.sectionType))];
}

function getSections(shape: ShapeKey, sectionType: string): Section[] {
  if (shape === "I") return flangedSections.filter((s) => s.sectionType === sectionType);
  if (shape === "CHS") return circularSections.filter((s) => s.sectionType === sectionType);
  return hollowSections.filter((s) => s.sectionType === sectionType);
}

const DEFAULT_SHAPE: ShapeKey = "I";
const DEFAULT_SECTION_TYPE = "IPE";
const DEFAULT_SECTION = flangedSections.find((s) => s.id === "IPE200")!;
const DEFAULT_GRADE = steelGrades.find(
  (g) => g.id === "S355" && g.norm === "EN10025-2",
)!;
const DEFAULT_ANNEX = italianAnnex;

const MOMENT_SHAPE_OPTIONS = ["uniform", "linear", "parabolic", "triangular"] as const;
const SUPPORT_CONDITION_OPTIONS = ["pinned-pinned", "fixed-pinned", "fixed-fixed"] as const;
const LOAD_APPLICATION_LT_OPTIONS = ["top-flange", "centroid", "bottom-flange"] as const;

type EditableNumericKey = {
  [K in keyof Ec3EditableInputs]: Ec3EditableInputs[K] extends number ? K : never;
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
      { key: "N_Ed", label: "N_Ed (comp<0)", displayUnit: "kN", toEngine: 1000 },
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
      { key: "k_y", label: "k_y" },
      { key: "k_z", label: "k_z" },
      { key: "k_LT", label: "k_LT" },
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

const INITIAL_EDITABLE_INPUTS: Ec3EditableInputs = {
  N_Ed: -100_000,
  M_y_Ed: 20_000_000,
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  V_z_Ed: 50_000,
  section_class: 1,
  L: 5000,
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
  psi_y: 0,
  psi_z: 0,
  psi_LT: 1,
};

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
            onChange={(displayVal) => onChange(field.key as EditableNumericKey, toEngineValue(field.key, displayVal))}
          />
        ))}
      </div>
    </fieldset>
  );
}

function SectionSummary({ section }: { section: Section }) {
  const dims =
    section.shape === "CHS"
      ? `d=${section.d} t=${section.t}`
      : `h=${section.h} b=${section.b} tw=${section.tw}${"tf" in section ? ` tf=${section.tf}` : ""}`;
  const computed = computeSectionProperties(section);
  return (
    <p className="text-xs text-gray-500">
      {dims} | A={(computed.A / 100).toFixed(2)} cm² | Wpl,y={(computed.Wpl_y / 1000).toFixed(1)} cm³
      {" "} | curves y/z/LT: {computed.bucklingY}/{computed.bucklingZ}/{computed.bucklingLT}
    </p>
  );
}

export function PageEc3() {
  const [shape, setShape] = useState<ShapeKey>(DEFAULT_SHAPE);
  const [sectionType, setSectionType] = useState(DEFAULT_SECTION_TYPE);
  const [sectionId, setSectionId] = useState(DEFAULT_SECTION.id);
  const [gradeId, setGradeId] = useState(`${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`);
  const [editableInputs, setEditableInputs] = useState<Ec3EditableInputs>(INITIAL_EDITABLE_INPUTS);
  const [selectedAnnexId, setSelectedAnnexId] = useState(DEFAULT_ANNEX.id);
  const [annex, setAnnex] = useState<AnnexCoeffs>({
    gamma_M0: DEFAULT_ANNEX.coefficients.gamma_M0,
    gamma_M1: DEFAULT_ANNEX.coefficients.gamma_M1,
    lambda_LT_0: DEFAULT_ANNEX.coefficients.lambda_LT_0,
    beta_LT: DEFAULT_ANNEX.coefficients.beta_LT,
  });

  const sectionTypes = useMemo(() => getSectionTypes(shape), [shape]);
  const sections = useMemo(() => getSections(shape, sectionType), [shape, sectionType]);
  const currentSection = useMemo(
    () => sections.find((s) => s.id === sectionId),
    [sections, sectionId],
  );

  const grade = useMemo(() => {
    const [norm, id] = gradeId.split(":");
    return steelGrades.find((candidate) => candidate.norm === norm && candidate.id === id) ?? DEFAULT_GRADE;
  }, [gradeId]);

  const resolvedInputs = useMemo(() => {
    const selectedSection = currentSection ?? sections[0] ?? DEFAULT_SECTION;
    const properties = computeSectionProperties(selectedSection);
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
    } satisfies Ec3SectionDerivedInputs;

    return buildResolvedInputs(
      editableInputs,
      sectionDerived,
      {
        fy: grade.fy,
        E: STEEL_E,
        G: STEEL_G,
      },
    );
  }, [currentSection, editableInputs, grade, sections]);

  const handleShapeChange = useCallback(
    (nextShape: ShapeKey) => {
      setShape(nextShape);
      const nextTypes = getSectionTypes(nextShape);
      const nextType = nextTypes[0];
      setSectionType(nextType);
      const nextSections = getSections(nextShape, nextType);
      if (nextSections[0]) setSectionId(nextSections[0].id);
    },
    [],
  );

  const handleSectionTypeChange = useCallback(
    (type: string) => {
      setSectionType(type);
      const nextSections = getSections(shape, type);
      if (nextSections[0]) setSectionId(nextSections[0].id);
    },
    [shape],
  );

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
    (key: keyof Ec3EditableInputs, value: Ec3EditableInputs[keyof Ec3EditableInputs]) =>
      setEditableInputs((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setCoeff = useCallback(
    (key: keyof AnnexCoeffs, value: number) =>
      setAnnex((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const results = useEc3Evaluate(resolvedInputs, annex);
  const computableCount = results.filter((row) => hasData(row)).length;
  const passedCount = results.filter((row) => hasData(row) && row.payload.data.passed).length;
  const notApplicableCount = results.filter((row) => isNotApplicable(row)).length;

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
  const ltNonLinear =
    editableInputs.moment_shape_LT === "parabolic"
    || editableInputs.moment_shape_LT === "triangular";

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
                  onChange={(e) => handleShapeChange(e.target.value as ShapeKey)}
                  className="border px-1 py-0.5 w-36"
                >
                  {SHAPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Type</span>
                <select
                  value={sectionType}
                  onChange={(e) => handleSectionTypeChange(e.target.value)}
                  className="border px-1 py-0.5 w-36"
                >
                  {sectionTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Size</span>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="border px-1 py-0.5 w-36"
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.id}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Class</span>
                <select
                  value={editableInputs.section_class}
                  onChange={(e) => {
                    const nextClass = Number(e.target.value) as Ec3EditableInputs["section_class"];
                    setEditableValue("section_class", nextClass);
                  }}
                  className="border px-1 py-0.5 w-36"
                >
                  {SECTION_CLASS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              {currentSection && <SectionSummary section={currentSection} />}
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
                      <option key={`${candidate.norm}:${candidate.id}`} value={`${candidate.norm}:${candidate.id}`}>
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
              fields={group.fields}
              values={editableInputs as unknown as Record<string, number>}
              onChange={setInput}
            />
          ))}

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">Moment Shape</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape y</span>
                <select
                  value={editableInputs.moment_shape_y}
                  onChange={(e) =>
                    setEditableValue("moment_shape_y", e.target.value as Ec3EditableInputs["moment_shape_y"])}
                  className="border px-1 py-0.5 w-36"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`y-${option}`} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              {yLinear ? (
                <NumberInput
                  label="psi_y"
                  value={editableInputs.psi_y}
                  onChange={(value) => setInput("psi_y", value)}
                />
              ) : (
                <label className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0">support y</span>
                  <select
                    value={editableInputs.support_condition_y}
                    onChange={(e) =>
                      setEditableValue("support_condition_y", e.target.value as Ec3EditableInputs["support_condition_y"])}
                    className="border px-1 py-0.5 w-36"
                  >
                    {SUPPORT_CONDITION_OPTIONS.map((option) => (
                      <option key={`sy-${option}`} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape z</span>
                <select
                  value={editableInputs.moment_shape_z}
                  onChange={(e) =>
                    setEditableValue("moment_shape_z", e.target.value as Ec3EditableInputs["moment_shape_z"])}
                  className="border px-1 py-0.5 w-36"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`z-${option}`} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              {zLinear ? (
                <NumberInput
                  label="psi_z"
                  value={editableInputs.psi_z}
                  onChange={(value) => setInput("psi_z", value)}
                />
              ) : (
                <label className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0">support z</span>
                  <select
                    value={editableInputs.support_condition_z}
                    onChange={(e) =>
                      setEditableValue("support_condition_z", e.target.value as Ec3EditableInputs["support_condition_z"])}
                    className="border px-1 py-0.5 w-36"
                  >
                    {SUPPORT_CONDITION_OPTIONS.map((option) => (
                      <option key={`sz-${option}`} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              )}

              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape LT</span>
                <select
                  value={editableInputs.moment_shape_LT}
                  onChange={(e) =>
                    setEditableValue("moment_shape_LT", e.target.value as Ec3EditableInputs["moment_shape_LT"])}
                  className="border px-1 py-0.5 w-36"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`lt-${option}`} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              {ltLinear && (
                <NumberInput
                  label="psi_LT"
                  value={editableInputs.psi_LT}
                  onChange={(value) => setInput("psi_LT", value)}
                />
              )}
              {ltNonLinear && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">support LT</span>
                    <select
                      value={editableInputs.support_condition_LT}
                      onChange={(e) =>
                        setEditableValue("support_condition_LT", e.target.value as Ec3EditableInputs["support_condition_LT"])}
                      className="border px-1 py-0.5 w-36"
                    >
                      {SUPPORT_CONDITION_OPTIONS.map((option) => (
                        <option key={`slt-${option}`} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">load LT</span>
                    <select
                      value={editableInputs.load_application_LT}
                      onChange={(e) =>
                        setEditableValue("load_application_LT", e.target.value as Ec3EditableInputs["load_application_LT"])}
                      className="border px-1 py-0.5 w-36"
                    >
                      {LOAD_APPLICATION_LT_OPTIONS.map((option) => (
                        <option key={`llt-${option}`} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
          </fieldset>

          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">National Annex</legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm mb-2">
                <span className="w-20 shrink-0">Annex</span>
                <select
                  value={selectedAnnexId}
                  onChange={(e) => handleAnnexChange(e.target.value)}
                  className="border px-1 py-0.5 w-48"
                >
                  {ANNEXES.map((option) => (
                    <option key={option.id} value={option.id}>{option.name}</option>
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
          <h2 className="font-semibold mb-3">
            Results ({passedCount}/{computableCount} passed
            {notApplicableCount > 0 ? `, ${notApplicableCount} N/A` : ""})
          </h2>
          <Ec3Results results={results} />
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useEc3Evaluate } from "./use-ec3-evaluate";
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
import type { Ec3Inputs, AnnexCoeffs } from "./use-ec3-evaluate";
import { computeSectionProperties } from "./compute-section-properties";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import type { Ec3NationalAnnex } from "@ndg/ndg-ec3";

// ── Available annexes ──

const ANNEXES: Ec3NationalAnnex[] = [italianAnnex, eurocodeAnnex];

// ── Shape / section type helpers ──

const SHAPE_OPTIONS = ["I", "RHS", "CHS"] as const;
type ShapeKey = (typeof SHAPE_OPTIONS)[number];

function getSectionTypes(shape: ShapeKey): string[] {
  if (shape === "I") {
    return [...new Set(flangedSections.map((s) => s.sectionType))];
  }
  if (shape === "CHS") {
    return [...new Set(circularSections.map((s) => s.sectionType))];
  }
  return [...new Set(hollowSections.map((s) => s.sectionType))];
}

function getSections(shape: ShapeKey, sectionType: string): Section[] {
  if (shape === "I") {
    return flangedSections.filter((s) => s.sectionType === sectionType);
  }
  if (shape === "CHS") {
    return circularSections.filter((s) => s.sectionType === sectionType);
  }
  return hollowSections.filter((s) => s.sectionType === sectionType);
}

function inputsFromSection(
  section: Section,
  grade: SteelGrade,
  prev: Ec3Inputs,
): Ec3Inputs {
  const props = computeSectionProperties(section);
  return {
    ...prev,
    A: props.A,
    Wpl_y: props.Wpl_y,
    Wpl_z: props.Wpl_z,
    Av_y: props.Av_y,
    Av_z: props.Av_z,
    tw: props.tw,
    hw: props.hw,
    section_shape: props.section_shape,
    Iy: props.Iy,
    Iz: props.Iz,
    It: props.It,
    Iw: props.Iw,
    fy: grade.fy,
    E: STEEL_E,
    G: STEEL_G,
    alpha_y: props.alpha_y,
    alpha_z: props.alpha_z,
    alpha_LT: props.alpha_LT,
  };
}

// ── Defaults ──

const DEFAULT_SHAPE: ShapeKey = "I";
const DEFAULT_SECTION_TYPE = "IPE";
const DEFAULT_SECTION = flangedSections.find((s) => s.id === "IPE200")!;
const DEFAULT_GRADE = steelGrades.find(
  (g) => g.id === "S355" && g.norm === "EN10025-2",
)!;
const DEFAULT_ANNEX = italianAnnex;

/**
 * Unit display layer: users see kN, kNm, m for lengths.
 * Engine uses N, N·mm, mm internally.
 *
 * displayUnit: what the user sees
 * toEngine: multiply user value by this to get engine value
 * fromEngine: multiply engine value by this to get display value (= 1/toEngine)
 */
interface FieldDef {
  key: string;
  label: string;
  displayUnit?: string;
  toEngine?: number;
}

// kN → N: *1000, kNm → N·mm: *1e6, m → mm: *1000
const FIELD_GROUPS: { legend: string; fields: FieldDef[] }[] = [
  {
    legend: "Actions",
    fields: [
      { key: "N_Ed", label: "N_Ed", displayUnit: "kN", toEngine: 1000 },
      { key: "M_y_Ed", label: "M_y,Ed", displayUnit: "kNm", toEngine: 1e6 },
      { key: "M_z_Ed", label: "M_z,Ed", displayUnit: "kNm", toEngine: 1e6 },
      { key: "V_y_Ed", label: "V_y,Ed", displayUnit: "kN", toEngine: 1000 },
      { key: "V_z_Ed", label: "V_z,Ed", displayUnit: "kN", toEngine: 1000 },
    ],
  },
  {
    legend: "Section properties",
    fields: [
      { key: "A", label: "A", displayUnit: "mm\u00B2" },
      { key: "Wpl_y", label: "W_pl,y", displayUnit: "mm\u00B3" },
      { key: "Wpl_z", label: "W_pl,z", displayUnit: "mm\u00B3" },
      { key: "Av_y", label: "A_v,y", displayUnit: "mm\u00B2" },
      { key: "Av_z", label: "A_v,z", displayUnit: "mm\u00B2" },
      { key: "tw", label: "t_w", displayUnit: "mm" },
      { key: "hw", label: "h_w", displayUnit: "mm" },
      { key: "fy", label: "f_y", displayUnit: "MPa" },
      { key: "E", label: "E", displayUnit: "MPa" },
      { key: "G", label: "G", displayUnit: "MPa" },
    ],
  },
  {
    legend: "Inertia",
    fields: [
      { key: "Iy", label: "I_y", displayUnit: "mm\u2074" },
      { key: "Iz", label: "I_z", displayUnit: "mm\u2074" },
      { key: "It", label: "I_t", displayUnit: "mm\u2074" },
      { key: "Iw", label: "I_w", displayUnit: "mm\u2076" },
    ],
  },
  {
    legend: "Buckling",
    fields: [
      { key: "Lcr_y", label: "L_cr,y", displayUnit: "m", toEngine: 1000 },
      { key: "Lcr_z", label: "L_cr,z", displayUnit: "m", toEngine: 1000 },
      { key: "Lcr_T", label: "L_cr,T", displayUnit: "m", toEngine: 1000 },
      { key: "alpha_y", label: "\u03B1_y" },
      { key: "alpha_z", label: "\u03B1_z" },
      { key: "alpha_LT", label: "\u03B1_LT" },
      { key: "M_cr", label: "M_cr", displayUnit: "kNm", toEngine: 1e6 },
      { key: "Cm_y", label: "C_m,y" },
      { key: "Cm_z", label: "C_m,z" },
      { key: "Cm_LT", label: "C_m,LT" },
    ],
  },
];

const ANNEX_FIELDS: FieldDef[] = [
  { key: "gamma_M0", label: "\u03B3_M0" },
  { key: "gamma_M1", label: "\u03B3_M1" },
  { key: "gamma_M2", label: "\u03B3_M2" },
  { key: "eta", label: "\u03B7" },
  { key: "lambda_LT_0", label: "\u03BB_LT,0" },
  { key: "beta_LT", label: "\u03B2_LT" },
];

/**
 * Build a flat lookup of all field definitions for conversion access.
 */
const FIELD_MAP: Record<string, FieldDef> = {};
for (const group of FIELD_GROUPS) {
  for (const f of group.fields) {
    FIELD_MAP[f.key] = f;
  }
}

/** Convert engine value → display value for a field. */
function toDisplay(key: string, engineValue: number): number {
  const factor = FIELD_MAP[key]?.toEngine;
  return factor ? engineValue / factor : engineValue;
}

/** Convert display value → engine value for a field. */
function toEngineValue(key: string, displayValue: number): number {
  const factor = FIELD_MAP[key]?.toEngine;
  return factor ? displayValue * factor : displayValue;
}

// ── Initial state (engine units internally, display converted on render) ──

const INITIAL_INPUTS: Ec3Inputs = inputsFromSection(
  DEFAULT_SECTION,
  DEFAULT_GRADE,
  {
    N_Ed: 100_000,       // 100 kN
    M_y_Ed: 20_000_000,  // 20 kNm
    M_z_Ed: 5_000_000,   // 5 kNm
    V_y_Ed: 10_000,      // 10 kN
    V_z_Ed: 50_000,      // 50 kN
    A: 0, Wpl_y: 0, Wpl_z: 0, Av_y: 0, Av_z: 0, tw: 0, hw: 0,
    section_shape: "I",
    fy: 0, E: 0, G: 0,
    Iy: 0, Iz: 0, It: 0, Iw: 0,
    Lcr_y: 5000, Lcr_z: 5000, Lcr_T: 5000,
    alpha_y: 0, alpha_z: 0, alpha_LT: 0,
    M_cr: 120_000_000, Cm_y: 0.9, Cm_z: 0.9, Cm_LT: 0.9,
  },
);

// ── Components ──

function NumberInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit?: string;
  value: number;
  onChange: (v: number) => void;
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
  engineValues,
  onChange,
}: {
  legend: string;
  fields: FieldDef[];
  engineValues: Record<string, number | string>;
  onChange: (key: string, engineValue: number) => void;
}) {
  return (
    <fieldset className="border p-3">
      <legend className="text-xs font-semibold px-1">{legend}</legend>
      <div className="space-y-1">
        {fields.map((f) => (
          <NumberInput
            key={f.key}
            label={f.label}
            unit={f.displayUnit}
            value={toDisplay(f.key, engineValues[f.key] as number)}
            onChange={(displayVal) => onChange(f.key, toEngineValue(f.key, displayVal))}
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
      : `h=${section.h} b=${section.b} tw=${section.tw}${
          "tf" in section ? ` tf=${section.tf}` : ""
        }`;
  const computed = computeSectionProperties(section);
  return (
    <p className="text-xs text-gray-500">
      {dims} | buckling y/z/LT: {computed.bucklingY}/{computed.bucklingZ}/{computed.bucklingLT}
    </p>
  );
}

// ── Page ──

export function PageEc3() {
  const [shape, setShape] = useState<ShapeKey>(DEFAULT_SHAPE);
  const [sectionType, setSectionType] = useState(DEFAULT_SECTION_TYPE);
  const [sectionId, setSectionId] = useState(DEFAULT_SECTION.id);
  const [gradeId, setGradeId] = useState(`${DEFAULT_GRADE.norm}:${DEFAULT_GRADE.id}`);
  const [inputs, setInputs] = useState<Ec3Inputs>(INITIAL_INPUTS);
  const [selectedAnnexId, setSelectedAnnexId] = useState(DEFAULT_ANNEX.id);
  const [annex, setAnnex] = useState<AnnexCoeffs>({
    gamma_M0: DEFAULT_ANNEX.coefficients.gamma_M0,
    gamma_M1: DEFAULT_ANNEX.coefficients.gamma_M1,
    gamma_M2: DEFAULT_ANNEX.coefficients.gamma_M2,
    eta: DEFAULT_ANNEX.coefficients.eta,
    lambda_LT_0: DEFAULT_ANNEX.coefficients.lambda_LT_0,
    beta_LT: DEFAULT_ANNEX.coefficients.beta_LT,
  });

  const sectionTypes = useMemo(() => getSectionTypes(shape), [shape]);
  const sections = useMemo(() => getSections(shape, sectionType), [shape, sectionType]);
  const currentSection = useMemo(
    () => sections.find((s) => s.id === sectionId),
    [sections, sectionId],
  );

  const resolveGrade = useCallback(
    (key: string): SteelGrade | undefined => {
      const [norm, id] = key.split(":");
      return steelGrades.find((g) => g.norm === norm && g.id === id);
    },
    [],
  );

  const applySection = useCallback(
    (section: Section) => {
      const grade = resolveGrade(gradeId) ?? DEFAULT_GRADE;
      setInputs((prev) => inputsFromSection(section, grade, prev));
    },
    [gradeId, resolveGrade],
  );

  const handleShapeChange = useCallback(
    (s: ShapeKey) => {
      setShape(s);
      const types = getSectionTypes(s);
      const firstType = types[0];
      setSectionType(firstType);
      const sects = getSections(s, firstType);
      const first = sects[0];
      if (first) {
        setSectionId(first.id);
        const grade = resolveGrade(gradeId) ?? DEFAULT_GRADE;
        setInputs((prev) => inputsFromSection(first, grade, prev));
      }
    },
    [gradeId, resolveGrade],
  );

  const handleSectionTypeChange = useCallback(
    (type: string) => {
      setSectionType(type);
      const sects = getSections(shape, type);
      const first = sects[0];
      if (first) {
        setSectionId(first.id);
        applySection(first);
      }
    },
    [shape, applySection],
  );

  const handleSectionChange = useCallback(
    (id: string) => {
      setSectionId(id);
      const section = sections.find((s) => s.id === id);
      if (section) applySection(section);
    },
    [sections, applySection],
  );

  const handleGradeChange = useCallback(
    (key: string) => {
      setGradeId(key);
      const grade = steelGrades.find(
        (g) => `${g.norm}:${g.id}` === key,
      );
      if (grade && currentSection) {
        setInputs((prev) => inputsFromSection(currentSection, grade, prev));
      }
    },
    [currentSection],
  );

  const handleAnnexChange = useCallback((annexId: string) => {
    setSelectedAnnexId(annexId);
    const a = ANNEXES.find((x) => x.id === annexId);
    if (a) {
      setAnnex({
        gamma_M0: a.coefficients.gamma_M0,
        gamma_M1: a.coefficients.gamma_M1,
        gamma_M2: a.coefficients.gamma_M2,
        eta: a.coefficients.eta,
        lambda_LT_0: a.coefficients.lambda_LT_0,
        beta_LT: a.coefficients.beta_LT,
      });
    }
  }, []);

  const setInput = useCallback(
    (key: string, value: number) =>
      setInputs((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setCoeff = useCallback(
    (key: string, value: number) =>
      setAnnex((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const results = useEc3Evaluate(inputs, annex);

  // Group steel grades by norm for <optgroup>
  const gradesByNorm = useMemo(() => {
    const map = new Map<string, { norm: string; desc: string; grades: SteelGrade[] }>();
    for (const g of steelGrades) {
      if (!map.has(g.norm)) {
        map.set(g.norm, { norm: g.norm, desc: g.normDescription, grades: [] });
      }
      map.get(g.norm)!.grades.push(g);
    }
    return [...map.values()];
  }, []);

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
          {/* Section selection */}
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
                  {SHAPE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
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
                  {sectionTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Size</span>
                <select
                  value={sectionId}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="border px-1 py-0.5 w-36"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.id}</option>
                  ))}
                </select>
              </label>
              {currentSection && (
                <SectionSummary section={currentSection} />
              )}
            </div>
          </fieldset>

          {/* Material selection */}
          <fieldset className="border p-3">
            <legend className="text-xs font-semibold px-1">Material</legend>
            <label className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0">Grade</span>
              <select
                value={gradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="border px-1 py-0.5 w-48"
              >
                {gradesByNorm.map((group) => (
                  <optgroup key={group.norm} label={group.norm}>
                    {group.grades.map((g) => (
                      <option key={`${g.norm}:${g.id}`} value={`${g.norm}:${g.id}`}>
                        {g.id} (fy={g.fy})
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
              engineValues={inputs}
              onChange={setInput}
            />
          ))}

          {/* National Annex */}
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
                  {ANNEXES.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </label>
              {ANNEX_FIELDS.map((f) => (
                <NumberInput
                  key={f.key}
                  label={f.label}
                  unit={f.displayUnit}
                  value={annex[f.key]}
                  onChange={(v) => setCoeff(f.key, v)}
                />
              ))}
            </div>
          </fieldset>
        </form>

        {/* Results */}
        <div>
          <h2 className="font-semibold mb-3">
            Results ({results.filter((r) => r.passed).length}/{results.length}{" "}
            passed)
          </h2>
          <Ec3Results results={results} />
        </div>
      </div>
    </div>
  );
}

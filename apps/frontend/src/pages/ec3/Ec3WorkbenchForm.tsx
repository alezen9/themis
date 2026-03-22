import type { Ec3EditableInputs } from "./use-ec3-evaluate";
import { computeSectionProperties, type SectionInput } from "./compute-section-properties";
import {
  ANNEXES,
  ANNEX_FIELDS,
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  CUSTOM_SECTION_ID,
  FIELD_GROUPS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SHAPE_OPTIONS,
  SUPPORT_CONDITION_OPTIONS,
  toDisplay,
  type Ec3WorkbenchState,
  type EditableNumericKey,
  type FieldDef,
  type ShapeKey,
} from "./use-ec3-workbench";

const clampPsi = (value: number): number => Math.max(-1, Math.min(1, value));

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
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-36 border px-1 py-0.5 tabular-nums"
      />
      {unit ? <span className="text-xs text-gray-500">{unit}</span> : null}
    </label>
  );
}

function FieldGroup({
  legend,
  fields,
  values,
  onChange,
  toEngineValue,
}: {
  legend: string;
  fields: FieldDef[];
  values: Record<string, number>;
  onChange: (key: EditableNumericKey, engineValue: number) => void;
  toEngineValue: (key: string, displayValue: number) => number;
}) {
  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">{legend}</legend>
      <div className="space-y-1">
        {fields.map((field) => (
          <NumberInput
            key={field.key}
            label={field.label}
            unit={field.displayUnit}
            value={toDisplay(field.key, values[field.key])}
            onChange={(displayValue) =>
              onChange(
                field.key as EditableNumericKey,
                toEngineValue(field.key, displayValue),
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

export function Ec3WorkbenchForm({
  workbench,
  className,
}: {
  workbench: Ec3WorkbenchState;
  className?: string;
}) {
  const {
    annex,
    classResolutionMessage,
    customChsSectionGeometry,
    customFabricationType,
    customISectionGeometry,
    customRhsSectionGeometry,
    editableInputs,
    gradeId,
    gradesByNorm,
    handleAnnexChange,
    handleShapeChange,
    isCustomSectionSelected,
    ltLinear,
    ltNonLinear,
    resolvedSectionClass,
    sectionForSummary,
    sections,
    selectedAnnexId,
    selectedSectionId,
    setCoeff,
    setCustomChsSectionGeometry,
    setCustomFabricationType,
    setCustomISectionGeometry,
    setCustomRhsSectionGeometry,
    setEditableValue,
    setGradeId,
    setInput,
    setSelectedSectionId,
    shape,
    toEngineDisplayValue,
    torsionalActive,
    yLinear,
    yNeedsSupport,
    zLinear,
    zNeedsSupport,
  } = workbench;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className={className ? className : "space-y-4"}
    >
      {classResolutionMessage ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {classResolutionMessage}
        </div>
      ) : null}

      <fieldset className="border p-3">
        <legend className="px-1 text-xs font-semibold">Section</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">Shape</span>
            <select
              value={shape}
              onChange={(event) =>
                handleShapeChange(event.target.value as ShapeKey)
              }
              className="w-36 border px-1 py-0.5"
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
              onChange={(event) => setSelectedSectionId(event.target.value)}
              className="w-36 border px-1 py-0.5"
            >
              <option value={CUSTOM_SECTION_ID}>Custom</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.id}
                </option>
              ))}
            </select>
          </label>

          {isCustomSectionSelected ? (
            <>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">Fabrication</span>
                <select
                  value={customFabricationType}
                  onChange={(event) =>
                    setCustomFabricationType(
                      event.target.value as typeof customFabricationType,
                    )
                  }
                  className="w-36 border px-1 py-0.5"
                >
                  <option value="rolled">rolled</option>
                  <option value="welded">welded</option>
                </select>
              </label>

              {shape === "I" ? (
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
              ) : null}

              {shape === "RHS" ? (
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
              ) : null}

              {shape === "CHS" ? (
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
              ) : null}
            </>
          ) : null}

          <label className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">Class</span>
            <select
              value={editableInputs.section_class_mode}
              onChange={(event) => {
                const rawValue = event.target.value;
                setEditableValue(
                  "section_class_mode",
                  rawValue === "auto" ? "auto" : Number(rawValue) as 1 | 2 | 3,
                );
              }}
              className="w-36 border px-1 py-0.5"
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
        <legend className="px-1 text-xs font-semibold">Material</legend>
        <label className="flex items-center gap-2 text-sm">
          <span className="w-20 shrink-0">Grade</span>
          <select
            value={gradeId}
            onChange={(event) => setGradeId(event.target.value)}
            className="w-48 border px-1 py-0.5"
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
                    field.key !== "LLT_over_L" && field.key !== "LcrT_over_L",
                )
              : group.fields
          }
          values={editableInputs as unknown as Record<string, number>}
          onChange={setInput}
          toEngineValue={toEngineDisplayValue}
        />
      ))}

      <fieldset className="border p-3">
        <legend className="px-1 text-xs font-semibold">Stability Options</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">torsional</span>
            <select
              value={editableInputs.torsional_deformations}
              onChange={(event) =>
                setEditableValue(
                  "torsional_deformations",
                  event.target.value as Ec3EditableInputs["torsional_deformations"],
                )
              }
              className="w-36 border px-1 py-0.5"
            >
              {["yes", "no"].map((option) => (
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
              onChange={(event) =>
                setEditableValue(
                  "interaction_factor_method",
                  event.target
                    .value as Ec3EditableInputs["interaction_factor_method"],
                )
              }
              className="w-36 border px-1 py-0.5"
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
              onChange={(event) =>
                setEditableValue(
                  "coefficient_f_method",
                  event.target.value as Ec3EditableInputs["coefficient_f_method"],
                )
              }
              className="w-36 border px-1 py-0.5"
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
              onChange={(event) =>
                setEditableValue(
                  "buckling_curves_LT_policy",
                  event.target
                    .value as Ec3EditableInputs["buckling_curves_LT_policy"],
                )
              }
              className="w-36 border px-1 py-0.5"
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
        <legend className="px-1 text-xs font-semibold">Moment Shape</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">shape y</span>
            <select
              value={editableInputs.moment_shape_y}
              onChange={(event) =>
                setEditableValue(
                  "moment_shape_y",
                  event.target.value as Ec3EditableInputs["moment_shape_y"],
                )
              }
              className="w-36 border px-1 py-0.5"
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

          {yNeedsSupport ? (
            <label className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0">support y</span>
              <select
                value={editableInputs.support_condition_y}
                onChange={(event) =>
                  setEditableValue(
                    "support_condition_y",
                    event.target.value as Ec3EditableInputs["support_condition_y"],
                  )
                }
                className="w-36 border px-1 py-0.5"
              >
                {SUPPORT_CONDITION_OPTIONS.map((option) => (
                  <option key={`sy-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">shape z</span>
            <select
              value={editableInputs.moment_shape_z}
              onChange={(event) =>
                setEditableValue(
                  "moment_shape_z",
                  event.target.value as Ec3EditableInputs["moment_shape_z"],
                )
              }
              className="w-36 border px-1 py-0.5"
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

          {zNeedsSupport ? (
            <label className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0">support z</span>
              <select
                value={editableInputs.support_condition_z}
                onChange={(event) =>
                  setEditableValue(
                    "support_condition_z",
                    event.target.value as Ec3EditableInputs["support_condition_z"],
                  )
                }
                className="w-36 border px-1 py-0.5"
              >
                {SUPPORT_CONDITION_OPTIONS.map((option) => (
                  <option key={`sz-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {torsionalActive ? (
            <>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">shape LT</span>
                <select
                  value={editableInputs.moment_shape_LT}
                  onChange={(event) =>
                    setEditableValue(
                      "moment_shape_LT",
                      event.target.value as Ec3EditableInputs["moment_shape_LT"],
                    )
                  }
                  className="w-36 border px-1 py-0.5"
                >
                  {MOMENT_SHAPE_OPTIONS.map((option) => (
                    <option key={`lt-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {ltLinear ? (
                <NumberInput
                  label="psi_LT"
                  value={editableInputs.psi_LT}
                  onChange={(value) => setInput("psi_LT", clampPsi(value))}
                  unit="[-1,1]"
                />
              ) : null}

              {ltNonLinear ? (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="w-20 shrink-0">support LT</span>
                    <select
                      value={editableInputs.support_condition_LT}
                      onChange={(event) =>
                        setEditableValue(
                          "support_condition_LT",
                          event.target
                            .value as Ec3EditableInputs["support_condition_LT"],
                        )
                      }
                      className="w-36 border px-1 py-0.5"
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
                      onChange={(event) =>
                        setEditableValue(
                          "load_application_LT",
                          event.target
                            .value as Ec3EditableInputs["load_application_LT"],
                        )
                      }
                      className="w-36 border px-1 py-0.5"
                    >
                      {LOAD_APPLICATION_LT_OPTIONS.map((option) => (
                        <option key={`llt-${option}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="border p-3">
        <legend className="px-1 text-xs font-semibold">National Annex</legend>
        <div className="space-y-2">
          <label className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">Annex</span>
            <select
              value={selectedAnnexId}
              onChange={(event) => handleAnnexChange(event.target.value)}
              className="w-48 border px-1 py-0.5"
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
  );
}

/* eslint-disable react-refresh/only-export-components */
import { Option } from "@components/inputs/InputSelect";
import { Latex } from "@components/Latex";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import { NationalAnnex } from "@ndg/ndg-editor";
import {
  composeSteelGradeId,
  composeSteelGradeLabel,
  SteelGrade,
  steelGrades,
} from "./data/steelGrades";

type OptionValue = string | number;

export const extractValues = <
  const T extends readonly { value: OptionValue }[],
>(
  options: T,
) =>
  options.map((option) => option.value) as {
    readonly [K in keyof T]: T[K]["value"];
  };

export const annexOptions = [italianAnnex, eurocodeAnnex].map<
  Option<NationalAnnex>
>((annex) => ({ label: annex.name, value: annex.id, ctx: annex }));

export const shapeOptions = [
  { value: "I", label: "I" },
  { value: "RHS", label: "RHS" },
  { value: "CHS", label: "CHS" },
] as const satisfies Option[];
export const shapeValues = extractValues(shapeOptions);

export const fabricationTypeOptions = [
  { value: "rolled", label: "Rolled" },
  { value: "welded", label: "Welded" },
] as const;
export const fabricationTypeValues = extractValues(fabricationTypeOptions);

export const momentShapeOptions = [
  { value: "uniform", label: "Uniform" },
  { value: "linear", label: "Linear" },
  { value: "parabolic", label: "Parabolic" },
  { value: "triangular", label: "Triangular" },
] as const satisfies Option[];
export const momentShapeValues = extractValues(momentShapeOptions);

export const supportConditionOptions = [
  { value: "pinned-pinned", label: "Pinned-pinned" },
  { value: "fixed-pinned", label: "Fixed-pinned" },
  { value: "pinned-fixed", label: "Pinned-fixed" },
  { value: "fixed-fixed", label: "Fixed-fixed" },
] as const satisfies Option[];
export const supportConditionValues = extractValues(supportConditionOptions);

export const loadApplicationLTOptions = [
  { value: "top-flange", label: "Top flange" },
  { value: "centroid", label: "Centroid" },
  { value: "bottom-flange", label: "Bottom flange" },
] as const satisfies Option[];
export const loadApplicationLTValues = extractValues(loadApplicationLTOptions);

export const interactionFactorMethodOptions = [
  { value: "both", label: "Both" },
  { value: "method1", label: "Method 1" },
  { value: "method2", label: "Method 2" },
  { value: "any", label: "Any" },
] as const satisfies Option[];
export const interactionFactorMethodValues = extractValues(
  interactionFactorMethodOptions,
);

export const coefficientFMethodOptions = [
  { value: "default-equation", label: "Default equation" },
  { value: "force-1.0", label: "Force 1.0" },
] as const satisfies Option[];
export const coefficientFMethodValues = extractValues(
  coefficientFMethodOptions,
);

export const bucklingCurvesLTPolicyOptions = [
  { value: "default", label: "Default" },
  { value: "general", label: "General" },
] as const satisfies Option[];
export const bucklingCurvesLTPolicyValues = extractValues(
  bucklingCurvesLTPolicyOptions,
);

export const sectionClassOptions = [
  { value: "auto", label: "Auto" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
] as const satisfies Option[];
export const sectionClassValues = extractValues(sectionClassOptions);

const SteelGradeOption = (props: { label: string; fy: number }) => {
  const { label, fy } = props;
  return (
    <div className="flex flex-col">
      <p>{label}</p>
      <span className="text-xs">
        <Latex tex="fy" className="text-lg" /> = {fy} Mpa
      </span>
    </div>
  );
};

export const steelGradeOptions = steelGrades.map<Option<SteelGrade>>(
  (grade) => {
    const label = composeSteelGradeLabel(grade);
    const value = composeSteelGradeId(grade);
    return {
      label,
      item: <SteelGradeOption label={label} fy={grade.fy} />,
      value,
    };
  },
);

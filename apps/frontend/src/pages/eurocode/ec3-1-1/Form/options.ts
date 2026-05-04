import { Option } from "@components/inputs/shared";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3";
import {
  composeSteelGradeId,
  composeSteelGradeLabel,
  SteelGrade,
  steelGrades,
} from "../data/steelGrades";
import { FlangedSection, flangedSections } from "../data/flangedSections";
import { CircularSection, circularSections } from "../data/circularSections";
import { HollowSection, hollowSections } from "../data/hollowSections";

type OptionValue = string | number;

export const extractValues = <
  const T extends readonly { value: OptionValue }[],
>(
  options: T,
) =>
  options.map((option) => option.value) as {
    readonly [K in keyof T]: T[K]["value"];
  };

export const annexOptions = [
  { value: eurocodeAnnex.id, label: `🇪🇺\xa0\xa0\xa0${eurocodeAnnex.name}` },
  { value: italianAnnex.id, label: `🇮🇹\xa0\xa0\xa0${italianAnnex.name}` },
] as const satisfies Option[];
export const annexValues = extractValues(annexOptions);

export const shapeOptions = [
  { value: "I", label: "I" },
  { value: "RHS", label: "RHS" },
  { value: "CHS", label: "CHS" },
] as const satisfies Option[];
export const shapeValues = extractValues(shapeOptions);

export const iFabricationTypeOptions = [
  { value: "rolled", label: "Rolled" },
  { value: "welded", label: "Welded" },
] as const;
export const iFabricationTypeValues = extractValues(iFabricationTypeOptions);

export const rhsChsFabricationTypeOptions = [
  { value: "cold-formed", label: "Cold formed" },
  { value: "hot-formed", label: "Hot formed" },
] as const;
export const rhsChsFabricationTypeValues = extractValues(
  rhsChsFabricationTypeOptions,
);

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
  { value: 1, label: "1" },
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

export const steelGradeOptions = steelGrades.map<Option<SteelGrade>>(
  (grade) => {
    const label = composeSteelGradeLabel(grade);
    const value = composeSteelGradeId(grade);
    return { label, value };
  },
);

export const customSectionId = "custom";
const customOption: Option = { label: "Custom", value: customSectionId };

export const flangedSectionOptions = [
  customOption,
  ...flangedSections.map<Option<FlangedSection>>(({ id }) => ({
    label: id,
    value: id,
  })),
];
export const circularSectionOptions = [
  customOption,
  ...circularSections.map<Option<CircularSection>>(({ id }) => ({
    label: id,
    value: id,
  })),
];
export const hollowSectionOptions = [
  customOption,
  ...hollowSections.map<Option<HollowSection>>(({ id }) => ({
    label: id,
    value: id,
  })),
];

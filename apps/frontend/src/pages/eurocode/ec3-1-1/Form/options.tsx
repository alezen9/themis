import { IconFlagEuropeanUnion, IconFlagItaly } from "@components/Icons";
import { Option, OptionGroup } from "@components/inputs/shared";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3-1-1";
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
  {
    value: eurocodeAnnex.id,
    label: eurocodeAnnex.name,
    item: (
      <span className="inline-grid min-w-28 grid-cols-[1rem_1fr] items-center gap-4 text-left">
        <IconFlagEuropeanUnion className="size-5 rounded-full border border-sand-300" />
        <span>{eurocodeAnnex.name}</span>
      </span>
    ),
  },
  {
    value: italianAnnex.id,
    label: italianAnnex.name,
    item: (
      <span className="inline-grid min-w-28 grid-cols-[1rem_1fr] items-center gap-6 text-left">
        <IconFlagItaly className="size-5 rounded-full border border-sand-300" />
        <span>{italianAnnex.name}</span>
      </span>
    ),
  },
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
  { value: "hot-formed", label: "Hot finished" },
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
  { value: "default-rolled-welded", label: "Default (Rolled / Welded)" },
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

const iSectionSteelGradeStandards = [
  "EN10025-2",
  "EN10025-3",
  "EN10025-4",
  "EN10025-5",
  "EN10025-6",
];

const getSteelGradeStandards = (shape: string, fabricationType: string) => {
  if (shape === "I") return iSectionSteelGradeStandards;
  if (fabricationType === "hot-formed") return ["EN10210-1"];
  return ["EN10219-1"];
};

export const getSteelGradeOptions = (
  shape: string,
  fabricationType: string,
) => {
  const standards = getSteelGradeStandards(shape, fabricationType);

  return standards
    .map<OptionGroup<SteelGrade>>((standard) => ({
      label: standard,
      options: steelGrades
        .filter((grade) => grade.standard === standard)
        .map((grade) => {
          const label = composeSteelGradeLabel(grade);
          const value = composeSteelGradeId(grade);
          return { label, value, ctx: grade };
        }),
    }))
    .filter((group) => group.options.length > 0);
};

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

import type { Ec3FormValues } from "../../Form/schema";
import { computeChsSectionProperties } from "./sectionPropertiesChs";
import { computeISectionProperties } from "./sectionPropertiesI";
import { computeRhsSectionProperties } from "./sectionPropertiesRhs";

type ISectionInput = Pick<
  Extract<Ec3FormValues, { shape: "I" }>,
  "shape" | "fabricationType" | "h" | "b" | "tw" | "tf" | "r"
>;

type RhsSectionInput = Pick<
  Extract<Ec3FormValues, { shape: "RHS" }>,
  "shape" | "fabricationType" | "h" | "b" | "tw" | "ro" | "ri"
>;

type ChsSectionInput = Pick<
  Extract<Ec3FormValues, { shape: "CHS" }>,
  "shape" | "fabricationType" | "d" | "t"
>;

export type SectionInput = ISectionInput | RhsSectionInput | ChsSectionInput;

export const computeSectionProperties = (
  inputs: SectionInput | Ec3FormValues,
) => {
  switch (inputs.shape) {
    case "I":
      return computeISectionProperties(inputs);
    case "RHS":
      return computeRhsSectionProperties(inputs);
    case "CHS":
      return computeChsSectionProperties(inputs);
  }
};

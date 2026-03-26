import { computeChsClass } from "./computeChsClass";
import { computeIShapeClass } from "./computeIShapeClass";
import { computeRhsClass } from "./computeRhsClass";

type StressStateInput = {
  crossSectionArea?: number;
  elasticSectionModulusY?: number;
  elasticSectionModulusZ?: number;
  axialForceEd?: number;
  bendingMomentYEd?: number;
  bendingMomentZEd?: number;
};

export type IShapeClassInput = StressStateInput & {
  sectionShape: "I";
  fabricationType?: "rolled" | "welded";
  yieldStrength: number;
  depth: number;
  width: number;
  webThickness: number;
  flangeThickness: number;
  rootRadius?: number;
};

export type RhsClassInput = StressStateInput & {
  sectionShape: "RHS";
  yieldStrength: number;
  depth: number;
  width: number;
  wallThickness: number;
  innerRadius: number;
};

export type ChsClassInput = StressStateInput & {
  sectionShape: "CHS";
  yieldStrength: number;
  diameter: number;
  wallThickness: number;
};

export type ComputeClassInput =
  | IShapeClassInput
  | RhsClassInput
  | ChsClassInput;
export type SectionClass = 1 | 2 | 3 | 4;

const computeClass = (input: ComputeClassInput): SectionClass => {
  switch (input.sectionShape) {
    case "I":
      return computeIShapeClass(input);
    case "RHS":
      return computeRhsClass(input);
    case "CHS":
      return computeChsClass(input);
    default:
      throw new Error("Unsupported section shape");
  }
};

export default computeClass;

import { computeSectionClassification } from "./classification/sectionClassification";
import {
  computeSectionProperties,
  type SectionProperties,
} from "./geometry/sectionProperties";
import type {
  ChsSectionClassificationInput,
  Ec3EditableInputs,
  Ec3MaterialInputs,
  ISectionClassificationInput,
  ResolvedSectionClass,
  RhsSectionClassificationInput,
  SectionInput,
} from "./inputs";

export type Ec3SectionDerivedInputs = {
  A: number;
  Wel_y: number;
  Wel_z: number;
  Wpl_y: number;
  Wpl_z: number;
  Av_y: number;
  Av_z: number;
  tw: number;
  hw: number;
  section_shape: SectionInput["shape"];
  Iy: number;
  Iz: number;
  It: number;
  Iw: number;
  alpha_y: number;
  alpha_z: number;
  alpha_LT: number;
  h: number;
  b: number;
  tf: number;
  t: number;
};

export type Ec3ComputedProperties = SectionProperties & {
  section_class: ResolvedSectionClass;
};

export type ComputeEc3ComputedPropertiesInput = {
  section: SectionInput;
  material: Pick<Ec3MaterialInputs, "fy">;
  editable: Pick<
    Ec3EditableInputs,
    "N_Ed" | "M_y_Ed" | "M_z_Ed" | "section_class_mode"
  >;
};

export type Ec3InputValues = {
  editable: Ec3EditableInputs;
  material: Ec3MaterialInputs;
  section: SectionInput;
};

export type Ec3InputsWithComputedProperties = Ec3EditableInputs &
  Ec3MaterialInputs &
  SectionInput &
  Ec3ComputedProperties;

const buildSectionClassificationInput = (
  section: SectionInput,
  sectionProperties: SectionProperties,
  fy: number,
  editable: Pick<
    Ec3EditableInputs,
    "N_Ed" | "M_y_Ed" | "M_z_Ed" | "section_class_mode"
  >,
):
  | ISectionClassificationInput
  | RhsSectionClassificationInput
  | ChsSectionClassificationInput => {
  const stressState = {
    crossSectionArea: sectionProperties.A,
    elasticSectionModulusY: sectionProperties.Wel_y,
    elasticSectionModulusZ: sectionProperties.Wel_z,
    axialForceEd: editable.N_Ed,
    bendingMomentYEd: editable.M_y_Ed,
    bendingMomentZEd: editable.M_z_Ed,
  };

  if (section.shape === "I") {
    return {
      shape: "I",
      fabricationType: section.fabricationType,
      yieldStrength: fy,
      depth: section.h,
      width: section.b,
      webThickness: section.tw,
      flangeThickness: section.tf,
      rootRadius: section.r,
      ...stressState,
    };
  }

  if (section.shape === "RHS") {
    return {
      shape: "RHS",
      yieldStrength: fy,
      depth: section.h,
      width: section.b,
      wallThickness: section.tw,
      innerRadius: section.ri,
      ...stressState,
    };
  }

  return {
    shape: "CHS",
    yieldStrength: fy,
    diameter: section.d,
    wallThickness: section.t,
    ...stressState,
  };
};

export const computeEc3ComputedProperties = (
  input: ComputeEc3ComputedPropertiesInput,
): Ec3ComputedProperties => {
  const sectionProperties = computeSectionProperties(input.section);
  const sectionClass =
    input.editable.section_class_mode === "auto"
      ? computeSectionClassification(
          buildSectionClassificationInput(
            input.section,
            sectionProperties,
            input.material.fy,
            input.editable,
          ),
        )
      : input.editable.section_class_mode;

  return { ...sectionProperties, section_class: sectionClass };
};

export const toEc3SectionDerivedInputs = (
  computed: Ec3ComputedProperties,
): Ec3SectionDerivedInputs => ({
  A: computed.A,
  Wel_y: computed.Wel_y,
  Wel_z: computed.Wel_z,
  Wpl_y: computed.Wpl_y,
  Wpl_z: computed.Wpl_z,
  Av_y: computed.Av_y,
  Av_z: computed.Av_z,
  tw: computed.tw,
  hw: computed.hw,
  section_shape: computed.section_shape,
  Iy: computed.Iy,
  Iz: computed.Iz,
  It: computed.It,
  Iw: computed.Iw,
  alpha_y: computed.alpha_y,
  alpha_z: computed.alpha_z,
  alpha_LT: computed.alpha_LT,
  h: computed.h,
  b: computed.b,
  tf: computed.tf,
  t: computed.t,
});

export const buildEc3InputsWithComputedProperties = (
  inputs: Ec3InputValues,
): Ec3InputsWithComputedProperties => {
  const computed = computeEc3ComputedProperties(inputs);

  return {
    ...inputs.editable,
    ...inputs.material,
    ...inputs.section,
    ...computed,
  };
};

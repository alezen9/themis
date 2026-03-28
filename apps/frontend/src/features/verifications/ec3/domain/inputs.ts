export type SectionShape = "I" | "RHS" | "CHS";
export type FabricationType = "rolled" | "welded";

export type ISectionInput = {
  shape: "I";
  fabricationType: FabricationType;
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
  A?: number;
  Iy?: number;
  Iz?: number;
  Wpl_y?: number;
  Wpl_z?: number;
  It?: number;
  Iw?: number;
};

export type RhsSectionInput = {
  shape: "RHS";
  fabricationType: FabricationType;
  h: number;
  b: number;
  tw: number;
  ro: number;
  ri: number;
  A?: number;
  Iy?: number;
  Iz?: number;
  Wpl_y?: number;
  Wpl_z?: number;
  It?: number;
};

export type ChsSectionInput = {
  shape: "CHS";
  fabricationType: FabricationType;
  d: number;
  t: number;
  A?: number;
  Iy?: number;
  Wpl_y?: number;
  It?: number;
};

export type SectionInput = ISectionInput | RhsSectionInput | ChsSectionInput;

export type EditableSectionClass = "auto" | 1 | 2 | 3;
export type ResolvedSectionClass = 1 | 2 | 3 | 4;
export type MomentShape = "uniform" | "linear" | "parabolic" | "triangular";
export type SupportCondition =
  | "pinned-pinned"
  | "fixed-pinned"
  | "pinned-fixed"
  | "fixed-fixed";
export type LoadApplicationLT = "top-flange" | "centroid" | "bottom-flange";
export type TorsionalDeformations = "yes" | "no";
export type InteractionFactorMethod = "both" | "method1" | "method2" | "any";
export type CoefficientFMethod = "default-equation" | "force-1.0";
export type BucklingCurvesLtPolicy = "default" | "general";

export type Ec3EditableInputs = {
  N_Ed: number;
  M_y_Ed: number;
  M_z_Ed: number;
  V_y_Ed: number;
  V_z_Ed: number;
  L: number;
  k_y: number;
  k_z: number;
  LLT_over_L: number;
  LcrT_over_L: number;
  psi_y: number;
  psi_z: number;
  psi_LT: number;
  moment_shape_y: MomentShape;
  moment_shape_z: MomentShape;
  moment_shape_LT: MomentShape;
  support_condition_y: SupportCondition;
  support_condition_z: SupportCondition;
  support_condition_LT: SupportCondition;
  load_application_LT: LoadApplicationLT;
  torsional_deformations: TorsionalDeformations;
  interaction_factor_method: InteractionFactorMethod;
  coefficient_f_method: CoefficientFMethod;
  buckling_curves_LT_policy: BucklingCurvesLtPolicy;
  section_class_mode: EditableSectionClass;
};

export type Ec3MaterialInputs = { fy: number; E: number; G: number };

export type AnnexCoeffs = {
  gamma_M0: number;
  gamma_M1: number;
  lambda_LT_0: number;
  beta_LT: number;
};

type StressStateInput = {
  crossSectionArea?: number;
  elasticSectionModulusY?: number;
  elasticSectionModulusZ?: number;
  axialForceEd?: number;
  bendingMomentYEd?: number;
  bendingMomentZEd?: number;
};

export type ISectionClassificationInput = StressStateInput & {
  shape: "I";
  fabricationType?: FabricationType;
  yieldStrength: number;
  depth: number;
  width: number;
  webThickness: number;
  flangeThickness: number;
  rootRadius?: number;
};

export type RhsSectionClassificationInput = StressStateInput & {
  shape: "RHS";
  yieldStrength: number;
  depth: number;
  width: number;
  wallThickness: number;
  innerRadius: number;
};

export type ChsSectionClassificationInput = StressStateInput & {
  shape: "CHS";
  yieldStrength: number;
  diameter: number;
  wallThickness: number;
};

export type SectionClassificationInput =
  | ISectionClassificationInput
  | RhsSectionClassificationInput
  | ChsSectionClassificationInput;

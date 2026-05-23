import type { EvaluationContext } from "@ndg/ndg-core";

type RuntimeValue = EvaluationContext["inputs"][string];

type Geometry = {
  h_mm: number;
  b_mm: number;
  tw_mm: number;
  tf_mm: number;
  r_mm: number;
};

type RhsGeometry = {
  h_mm: number;
  b_mm: number;
  tw_mm: number;
  ro_mm: number;
  ri_mm: number;
};

type ChsGeometry = { d_mm: number; t_mm: number };

type SupportCondition =
  | "pinned-pinned"
  | "fixed-pinned"
  | "pinned-fixed"
  | "fixed-fixed";

type MomentShape = "uniform" | "linear" | "parabolic" | "triangular";

type InactiveValue = unknown;

export type Ec3SectionClass = 1 | 2 | 3 | 4;
export type Ec3Shape = "I" | "RHS" | "CHS";
export type Ec3BucklingCurve = "a0" | "a" | "b" | "c" | "d";

export type Ec3VerifyInputs = {
  shape: Ec3Shape;
  steel_grade_id: string;
  fy_MPa: number;
  section_id: string;
  fabrication_type: "rolled" | "welded" | "cold-formed" | "hot-formed";
  section_class: Ec3SectionClass;
  L_m: number;
  i_geometry: Geometry;
  rhs_geometry: RhsGeometry;
  chs_geometry: ChsGeometry;
  N_Ed_kN: number;
  V_y_Ed_kN: number;
  V_z_Ed_kN: number;
  M_y_Ed_kNm: number;
  M_z_Ed_kNm: number;
  k_y: number;
  M_y_Ed_shape: MomentShape;
  psi_y?: number | InactiveValue;
  support_condition_y?: SupportCondition | InactiveValue;
  k_z: number;
  M_z_Ed_shape: MomentShape;
  psi_z?: number | InactiveValue;
  support_condition_z?: SupportCondition | InactiveValue;
  include_torsional_modes: boolean;
  k_T?: number | InactiveValue;
  k_LT?: number | InactiveValue;
  M_y_Ed_shape_LT?: MomentShape | InactiveValue;
  psi_y_LT?: number | InactiveValue;
  support_condition_LT?: SupportCondition | InactiveValue;
  load_LT?: "top-flange" | "centroid" | "bottom-flange" | InactiveValue;
  annex_id: string;
  gamma_M0: number;
  gamma_M1: number;
  lambda_LT_0: number;
  beta_LT: number;
  f_method?: "default-equation" | 1 | InactiveValue;
  interaction_factor_method: "both" | "method1" | "method2" | "any";
  buckling_curves_LT_policy: "default-rolled-welded" | "general";
};

export type Ec3DerivedGeometricProperties = {
  A_mm2: number;
  Iy_mm4: number;
  Iz_mm4: number;
  Wel_y_mm3: number;
  Wel_z_mm3: number;
  Wpl_y_mm3: number;
  Wpl_z_mm3: number;
  Av_y_mm2: number;
  Av_z_mm2: number;
  It_mm4: number;
  Iw_mm6: number;
  centroid: { y_mm: number; z_mm: number };
};

export type Ec3VerifyPayload = Ec3VerifyInputs & Ec3DerivedGeometricProperties;

export type Ec3EvaluatorInputs = Record<string, RuntimeValue> &
  Partial<
    Pick<
      Ec3VerifyInputs,
      | "shape"
      | "steel_grade_id"
      | "fy_MPa"
      | "section_id"
      | "fabrication_type"
      | "section_class"
      | "N_Ed_kN"
      | "V_y_Ed_kN"
      | "V_z_Ed_kN"
      | "M_y_Ed_kNm"
      | "M_z_Ed_kNm"
      | "k_y"
      | "k_z"
      | "annex_id"
      | "gamma_M0"
      | "gamma_M1"
      | "lambda_LT_0"
      | "beta_LT"
      | "interaction_factor_method"
      | "buckling_curves_LT_policy"
    >
  > &
  Partial<Omit<Ec3DerivedGeometricProperties, "centroid">>;

const addRuntimeValues = (
  target: Record<string, RuntimeValue>,
  source: Record<string, unknown>,
) => {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "number" || typeof value === "string") {
      target[key] = value;
    }
  }
};

export const createEc3RuntimeInputs = (
  payload: Ec3VerifyPayload,
): Ec3EvaluatorInputs => {
  const runtimeInputs: Record<string, RuntimeValue> = {};

  addRuntimeValues(runtimeInputs, payload);

  return runtimeInputs as Ec3EvaluatorInputs;
};

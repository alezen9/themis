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

type InactiveValue = unknown;

type Ec3VerifyInputs = {
  shape: "I" | "RHS" | "CHS";
  steel_grade_id: string;
  fy_MPa: number;
  section_id: string;
  fabrication_type: "rolled" | "welded" | "cold-formed" | "hot-formed";
  section_class: 1 | 2 | 3 | 4;
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
  M_y_Ed_shape: "uniform" | "linear" | "parabolic" | "triangular";
  psi_y?: number | InactiveValue;
  support_condition_y?:
    | "pinned-pinned"
    | "fixed-pinned"
    | "pinned-fixed"
    | "fixed-fixed"
    | InactiveValue;
  k_z: number;
  M_z_Ed_shape: "uniform" | "linear" | "parabolic" | "triangular";
  psi_z?: number | InactiveValue;
  support_condition_z?:
    | "pinned-pinned"
    | "fixed-pinned"
    | "pinned-fixed"
    | "fixed-fixed"
    | InactiveValue;
  include_torsional_modes: boolean;
  k_T?: number | InactiveValue;
  k_LT?: number | InactiveValue;
  M_y_Ed_shape_LT?:
    | "uniform"
    | "linear"
    | "parabolic"
    | "triangular"
    | InactiveValue;
  psi_y_LT?: number | InactiveValue;
  support_condition_LT?:
    | "pinned-pinned"
    | "fixed-pinned"
    | "pinned-fixed"
    | "fixed-fixed"
    | InactiveValue;
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

type Ec3DerivedGeometricProperties = {
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

type Ec3BaseUnitInputs = {
  N_Ed: number;
  V_y_Ed: number;
  V_z_Ed: number;
  M_y_Ed: number;
  M_z_Ed: number;
};

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
  Partial<Omit<Ec3DerivedGeometricProperties, "centroid">> &
  Partial<Ec3BaseUnitInputs>;

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
  runtimeInputs.N_Ed = payload.N_Ed_kN * 1_000;
  runtimeInputs.V_y_Ed = payload.V_y_Ed_kN * 1_000;
  runtimeInputs.V_z_Ed = payload.V_z_Ed_kN * 1_000;
  runtimeInputs.M_y_Ed = payload.M_y_Ed_kNm * 1_000_000;
  runtimeInputs.M_z_Ed = payload.M_z_Ed_kNm * 1_000_000;

  if (payload.shape === "I") {
    runtimeInputs.h_mm = payload.i_geometry.h_mm;
    runtimeInputs.b_mm = payload.i_geometry.b_mm;
    runtimeInputs.tw_mm = payload.i_geometry.tw_mm;
    runtimeInputs.tf_mm = payload.i_geometry.tf_mm;
    runtimeInputs.t_mm = payload.i_geometry.tw_mm;
  }
  if (payload.shape === "RHS") {
    runtimeInputs.h_mm = payload.rhs_geometry.h_mm;
    runtimeInputs.b_mm = payload.rhs_geometry.b_mm;
    runtimeInputs.tw_mm = payload.rhs_geometry.tw_mm;
    runtimeInputs.t_mm = payload.rhs_geometry.tw_mm;
  }
  if (payload.shape === "CHS") {
    runtimeInputs.t_mm = payload.chs_geometry.t_mm;
  }

  return runtimeInputs as Ec3EvaluatorInputs;
};

export const createEc3Annex = (
  payload: Ec3VerifyPayload,
): EvaluationContext["annex"] => ({
  id: payload.annex_id,
  name: payload.annex_id,
  coefficients: {
    gamma_M0: payload.gamma_M0,
    gamma_M1: payload.gamma_M1,
    lambda_LT_0: payload.lambda_LT_0,
    beta_LT: payload.beta_LT,
    f_method:
      typeof payload.f_method === "number" ||
      typeof payload.f_method === "string"
        ? payload.f_method
        : "default-equation",
    interaction_factor_method: payload.interaction_factor_method,
    buckling_curves_LT_policy: payload.buckling_curves_LT_policy,
  },
});

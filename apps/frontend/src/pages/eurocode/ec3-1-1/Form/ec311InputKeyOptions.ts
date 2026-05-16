import type { FieldPath } from "react-hook-form";
import type { Option } from "@components/inputs/shared";
import type { Ec3FormValues } from "./schema/schema";

type Ec311InputKey = FieldPath<Ec3FormValues>;

const option = (value: Ec311InputKey, label = value): Option => ({
  label,
  value,
});

export const ec311InputKeyOptions = [
  option("shape"),
  option("steel_grade_id"),
  option("section_id"),
  option("fabrication_type"),
  option("section_class"),
  option("L_m"),
  option("i_geometry.h_mm"),
  option("i_geometry.b_mm"),
  option("i_geometry.tw_mm"),
  option("i_geometry.tf_mm"),
  option("i_geometry.r_mm"),
  option("rhs_geometry.h_mm"),
  option("rhs_geometry.b_mm"),
  option("rhs_geometry.tw_mm"),
  option("rhs_geometry.ro_mm"),
  option("rhs_geometry.ri_mm"),
  option("chs_geometry.d_mm"),
  option("chs_geometry.t_mm"),
  option("N_Ed_kN"),
  option("V_y_Ed_kN"),
  option("V_z_Ed_kN"),
  option("M_y_Ed_kNm"),
  option("M_z_Ed_kNm"),
  option("k_y"),
  option("M_y_Ed_shape"),
  option("psi_y"),
  option("support_condition_y"),
  option("k_z"),
  option("M_z_Ed_shape"),
  option("psi_z"),
  option("support_condition_z"),
  option("include_torsional_modes"),
  option("k_T"),
  option("k_LT"),
  option("M_y_Ed_shape_LT"),
  option("psi_y_LT"),
  option("support_condition_LT"),
  option("load_LT"),
  option("annex_id"),
  option("gamma_M0"),
  option("gamma_M1"),
  option("lambda_LT_0"),
  option("beta_LT"),
  option("f_method"),
  option("interaction_factor_method"),
  option("buckling_curves_LT_policy"),
] satisfies Option[];

import {
  defineNDGSuite,
  runNDGSuite,
  type Condition,
  type ConditionOperand,
  type NDGSuiteRunRow,
  type NDGRunResult,
  type NDGTraceEntry,
  type Node,
} from "@ndg/ndg-core";
import type { Ec311Inputs } from "./ec311-inputs";
import v01_tension from "./verifications/01_tension/tension";
import v02_compression from "./verifications/02_compression/compression";
import v03_bendingY from "./verifications/03_bendingY/bendingY";
import v04_bendingZ from "./verifications/04_bendingZ/bendingZ";
import v05_shearZ from "./verifications/05_shearZ/shearZ";
import v06_shearY from "./verifications/06_shearY/shearY";
import v07_bendingYShear from "./verifications/07_bendingYShear/bendingYShear";
import v08_bendingZShear from "./verifications/08_bendingZShear/bendingZShear";
import v09_bendingYAxial from "./verifications/09_bendingYAxial/bendingYAxial";
import v10_bendingZAxial from "./verifications/10_bendingZAxial/bendingZAxial";

export { evaluateCondition } from "@ndg/ndg-core";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, NDGRunResult, NDGTraceEntry, Node };
export type { Ec311Inputs } from "./ec311-inputs";

const suite = defineNDGSuite([
  { id: 1, ndg: v01_tension },
  { id: 2, ndg: v02_compression },
  { id: 3, ndg: v03_bendingY },
  { id: 4, ndg: v04_bendingZ },
  { id: 5, ndg: v05_shearZ },
  { id: 6, ndg: v06_shearY },
  { id: 7, ndg: v07_bendingYShear },
  { id: 8, ndg: v08_bendingZShear },
  { id: 9, ndg: v09_bendingYAxial },
  { id: 10, ndg: v10_bendingZAxial },
]);

export type VerificationRow = NDGSuiteRunRow;

const createRuntimeValues = (
  inputs: Ec311Inputs,
): Record<string, number | string> => {
  let h_mm = inputs.i_geometry.h_mm;
  let b_mm = inputs.i_geometry.b_mm;
  let tw_mm = inputs.i_geometry.tw_mm;
  let tf_mm = inputs.i_geometry.tf_mm;
  let t_mm = inputs.i_geometry.tw_mm;
  let hw_mm = inputs.i_geometry.h_mm - 2 * inputs.i_geometry.tf_mm;

  if (inputs.shape === "RHS") {
    h_mm = inputs.rhs_geometry.h_mm;
    b_mm = inputs.rhs_geometry.b_mm;
    tw_mm = inputs.rhs_geometry.tw_mm;
    tf_mm = inputs.rhs_geometry.tw_mm;
    t_mm = inputs.rhs_geometry.tw_mm;
    hw_mm = inputs.rhs_geometry.h_mm;
  }

  if (inputs.shape === "CHS") {
    h_mm = inputs.chs_geometry.d_mm;
    b_mm = inputs.chs_geometry.d_mm;
    tw_mm = inputs.chs_geometry.t_mm;
    tf_mm = inputs.chs_geometry.t_mm;
    t_mm = inputs.chs_geometry.t_mm;
    hw_mm = inputs.chs_geometry.d_mm;
  }

  return {
    shape: inputs.shape,
    section_class: inputs.section_class,
    N_Ed_N: inputs.N_Ed_N,
    V_y_Ed_N: inputs.V_y_Ed_N,
    V_z_Ed_N: inputs.V_z_Ed_N,
    M_y_Ed_Nmm: inputs.M_y_Ed_Nmm,
    M_z_Ed_Nmm: inputs.M_z_Ed_Nmm,
    A_mm2: inputs.A_mm2,
    Wpl_y_mm3: inputs.Wpl_y_mm3,
    Wpl_z_mm3: inputs.Wpl_z_mm3,
    Wel_y_mm3: inputs.Wel_y_mm3,
    Wel_z_mm3: inputs.Wel_z_mm3,
    Av_y_mm2: inputs.Av_y_mm2,
    Av_z_mm2: inputs.Av_z_mm2,
    h_mm,
    hw_mm,
    b_mm,
    tw_mm,
    tf_mm,
    t_mm,
    fy_MPa: inputs.fy_MPa,
    gamma_M0: inputs.gamma_M0,
    eta: inputs.eta,
  };
};

const verify = (inputs: Ec311Inputs): readonly VerificationRow[] =>
  runNDGSuite(suite, { values: createRuntimeValues(inputs) });

export default verify;

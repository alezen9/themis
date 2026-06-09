import { defineEvaluators } from "../../define";
import { nodes } from "./torsion-nodes";
import {
  assertApplicable,
  assertFinite,
  assertPositive,
} from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  T_Rd_Nmm: ({ Wt_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(Wt_mm3, "Wt_mm3 must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return (Wt_mm3 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  utilisation: ({ T_Ed_Nmm, T_Rd_Nmm }, { inputs }) => {
    assertApplicable(
      inputs.shape === "RHS" || inputs.shape === "CHS",
      "Load case not applicable for shape",
    );
    assertFinite(T_Ed_Nmm, "T_Ed_Nmm must be a valid and finite value");
    assertPositive(T_Rd_Nmm, "Denominator T_Rd_Nmm must be > 0");

    return Math.abs(T_Ed_Nmm) / T_Rd_Nmm;
  },
});

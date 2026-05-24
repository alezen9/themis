import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./bendingZ-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_c_z_Rd_Nmm: ({ W_z_res_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res_mm3) || W_z_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: W_z_res_mm3 must be > 0",
        details: { W_z_res_mm3, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_z_res_mm3 * fy_MPa) / gamma_M0;
  },

  ratio: ({ M_z_Ed_Nmm, M_c_z_Rd_Nmm }) => {
    if (!Number.isFinite(M_z_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: M_z_Ed_Nmm must be finite",
        details: { M_z_Ed_Nmm, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(M_c_z_Rd_Nmm) || M_c_z_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z: denominator M_c_z_Rd_Nmm must be > 0 (division by zero)",
        details: { M_c_z_Rd_Nmm, sectionRef: "6.2.5" },
      });
    }

    return Math.abs(M_z_Ed_Nmm) / M_c_z_Rd_Nmm;
  },
});

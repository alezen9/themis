import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./shearZ-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  ratio: ({ V_z_Ed_N, V_pl_z_Rd_N }) => {
    if (!Number.isFinite(V_z_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: V_z_Ed_N must be finite",
        details: { V_z_Ed_N, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(V_pl_z_Rd_N) || V_pl_z_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "shear-z: denominator V_pl_z_Rd_N must be > 0 (division by zero)",
        details: { V_pl_z_Rd_N, sectionRef: "6.2.6" },
      });
    }

    return Math.abs(V_z_Ed_N) / V_pl_z_Rd_N;
  },
});

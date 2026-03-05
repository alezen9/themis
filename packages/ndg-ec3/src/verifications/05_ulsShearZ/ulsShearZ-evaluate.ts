import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsShearZ-nodes";

export const evaluate = defineEvaluators<Nodes>({
  V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z * fy) / (Math.sqrt(3) * gamma_M0);
  },

  abs_V_z_Ed: ({ V_z_Ed }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.6" },
      });
    }

    return Math.abs(V_z_Ed);
  },

  shear_z_check: ({ abs_V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-z: denominator V_pl_z_Rd must be > 0 (division by zero)",
        details: { V_pl_z_Rd, sectionRef: "6.2.6" },
      });
    }

    return abs_V_z_Ed / V_pl_z_Rd;
  },
});

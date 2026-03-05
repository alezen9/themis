import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZ-nodes";

export const evaluate = defineEvaluators<Nodes>({
  W_z_res_class12: ({ Wpl_z }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.5" },
      });
    }

    return Wpl_z;
  },

  W_z_res_class3: ({ Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.5" },
      });
    }

    return Wel_z;
  },

  W_z_res: ({ section_class, W_z_res_class12, W_z_res_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.5" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.5" },
      });
    }

    const selected = section_class === 3 ? W_z_res_class3 : W_z_res_class12;

    if (!Number.isFinite(selected) || selected <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: selected W_z_res branch must be > 0",
        details: { section_class, selected, sectionRef: "6.2.5" },
      });
    }

    return selected;
  },

  M_c_z_Rd: ({ W_z_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_z_res * fy) / gamma_M0;
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.5" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  bending_z_check: ({ abs_M_z_Ed, M_c_z_Rd }) => {
    if (!Number.isFinite(M_c_z_Rd) || M_c_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: denominator M_c_z_Rd must be > 0 (division by zero)",
        details: { M_c_z_Rd, sectionRef: "6.2.5" },
      });
    }

    return abs_M_z_Ed / M_c_z_Rd;
  },
});

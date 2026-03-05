import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingY-nodes";

export const evaluate = defineEvaluators<Nodes>({
  W_y_res_class12: ({ Wpl_y }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.5" },
      });
    }

    return Wpl_y;
  },

  W_y_res_class3: ({ Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.5" },
      });
    }

    return Wel_y;
  },

  W_y_res: ({ section_class, W_y_res_class12, W_y_res_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.5" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.5" },
      });
    }

    const selected = section_class === 3 ? W_y_res_class3 : W_y_res_class12;

    if (!Number.isFinite(selected) || selected <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: selected W_y_res branch must be > 0",
        details: { section_class, selected, sectionRef: "6.2.5" },
      });
    }

    return selected;
  },

  M_c_y_Rd: ({ W_y_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_y_res * fy) / gamma_M0;
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.5" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  bending_y_check: ({ abs_M_y_Ed, M_c_y_Rd }) => {
    if (!Number.isFinite(M_c_y_Rd) || M_c_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: denominator M_c_y_Rd must be > 0 (division by zero)",
        details: { M_c_y_Rd, sectionRef: "6.2.5" },
      });
    }

    return abs_M_y_Ed / M_c_y_Rd;
  },
});

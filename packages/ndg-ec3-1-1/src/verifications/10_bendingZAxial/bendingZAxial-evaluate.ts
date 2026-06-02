import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { assertPositive } from "../../assertions";
import { nodes } from "./bendingZAxial-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_pl_z_Rd_Nmm: ({ Wpl_z_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(Wpl_z_mm3, "bending-z-axial: Wpl_z_mm3 must be > 0");
    assertPositive(fy_MPa, "bending-z-axial: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-axial: gamma_M0 must be > 0");

    return (Wpl_z_mm3 * fy_MPa) / gamma_M0;
  },

  N_pl_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(A_mm2, "bending-z-axial: A_mm2 must be > 0");
    assertPositive(fy_MPa, "bending-z-axial: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-axial: gamma_M0 must be > 0");

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  n: ({ N_Ed_N, N_pl_Rd_N }) => {
    assertPositive(
      N_pl_Rd_N,
      "bending-z-axial: denominator N_pl_Rd_N must be > 0 (division by zero)",
    );

    return Math.abs(N_Ed_N) / N_pl_Rd_N;
  },

  a_f_i: ({ A_mm2, b_mm, tf_mm }) => {
    assertPositive(A_mm2, "bending-z-axial: A_mm2 must be > 0");
    assertPositive(b_mm, "bending-z-axial: b_mm must be > 0");
    assertPositive(tf_mm, "bending-z-axial: tf_mm must be > 0");

    return Math.min((A_mm2 - 2 * b_mm * tf_mm) / A_mm2, 0.5);
  },

  a_f_rhs: ({ A_mm2, h_mm, t_mm }) => {
    assertPositive(A_mm2, "bending-z-axial: A_mm2 must be > 0");
    assertPositive(h_mm, "bending-z-axial: h_mm must be > 0");
    assertPositive(t_mm, "bending-z-axial: t_mm must be > 0");

    return Math.min((A_mm2 - 2 * h_mm * t_mm) / A_mm2, 0.5);
  },

  a_f_chs: () => {
    return 0.5;
  },

  k_z_i: ({ n, a_f }) => {
    if (n <= a_f) return 1;

    const denominator = 1 - a_f;
    assertPositive(
      denominator,
      "bending-z-axial: denominator (1 - a_f) must be > 0 (division by zero)",
    );

    return 1 - ((n - a_f) / denominator) ** 2;
  },

  k_z_rhs_chs: ({ n, a_f }) => {
    const denominator = 1 - 0.5 * a_f;
    assertPositive(
      denominator,
      "bending-z-axial: denominator (1 - 0.5*a_f) must be > 0 (division by zero)",
    );

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_z_Rd_Nmm: ({ M_pl_z_Rd_Nmm, k_z }) => {
    assertPositive(M_pl_z_Rd_Nmm, "bending-z-axial: M_pl_z_Rd_Nmm must be > 0");

    const reducedResistance = M_pl_z_Rd_Nmm * k_z;
    assertPositive(
      reducedResistance,
      "bending-z-axial: denominator M_N_z_Rd_Nmm must be > 0 (division by zero)",
    );

    return reducedResistance;
  },

  utilization_class12: ({ M_z_Ed_Nmm, M_N_z_Rd_Nmm }) => {
    assertPositive(
      M_N_z_Rd_Nmm,
      "bending-z-axial: denominator M_N_z_Rd_Nmm must be > 0 (division by zero)",
    );

    return Math.abs(M_z_Ed_Nmm) / M_N_z_Rd_Nmm;
  },

  sigma_N_MPa: ({ N_Ed_N, A_mm2 }) => {
    assertPositive(A_mm2, "bending-z-axial: A_mm2 must be > 0");

    return Math.abs(N_Ed_N) / A_mm2;
  },

  sigma_M_z_MPa: ({ M_z_Ed_Nmm, Wel_z_mm3 }) => {
    assertPositive(Wel_z_mm3, "bending-z-axial: Wel_z_mm3 must be > 0");

    return Math.abs(M_z_Ed_Nmm) / Wel_z_mm3;
  },

  sigma_x_class3_MPa: ({ sigma_N_MPa, sigma_M_z_MPa }) => {
    return sigma_N_MPa + sigma_M_z_MPa;
  },

  sigma_limit_MPa: ({ fy_MPa, gamma_M0 }) => {
    assertPositive(fy_MPa, "bending-z-axial: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-axial: gamma_M0 must be > 0");

    return fy_MPa / gamma_M0;
  },

  utilization_class3: ({ sigma_x_class3_MPa, sigma_limit_MPa }) => {
    assertPositive(
      sigma_limit_MPa,
      "bending-z-axial: denominator sigma_limit_MPa must be > 0 (division by zero)",
    );

    return sigma_x_class3_MPa / sigma_limit_MPa;
  },

  utilisation: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (typeof utilization_class12 === "number") {
      return utilization_class12;
    }
    if (typeof utilization_class3 === "number") {
      return utilization_class3;
    }

    throw new Ec3VerificationError({
      type: "evaluation-error",
      message: "bending-z-axial: no active utilization branch was selected",
      details: { sectionRef: "6.2.9" },
    });
  },
});

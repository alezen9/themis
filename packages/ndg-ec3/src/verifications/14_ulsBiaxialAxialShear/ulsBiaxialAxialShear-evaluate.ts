import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsBiaxialAxialShear-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes>({
  V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator gamma_M0 must be > 0 (division by zero)",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (Av_z * fy) / (Math.sqrt(3) * gamma_M0);
  },

  V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator gamma_M0 must be > 0 (division by zero)",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (Av_y * fy) / (Math.sqrt(3) * gamma_M0);
  },

  abs_V_z_Ed: ({ V_z_Ed }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.10" },
      });
    }
    return Math.abs(V_z_Ed);
  },

  abs_V_y_Ed: ({ V_y_Ed }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.10" },
      });
    }
    return Math.abs(V_y_Ed);
  },

  rho_z: ({ abs_V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator V_pl_z_Rd must be > 0 (division by zero)",
        details: { V_pl_z_Rd, sectionRef: "6.2.10" },
      });
    }
    const ratio = abs_V_z_Ed / V_pl_z_Rd;
    if (ratio <= 0.5) return 0;
    return (2 * ratio - 1) ** 2;
  },

  rho_y: ({ abs_V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.10" },
      });
    }
    const ratio = abs_V_y_Ed / V_pl_y_Rd;
    if (ratio <= 0.5) return 0;
    return (2 * ratio - 1) ** 2;
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator gamma_M0 must be > 0 (division by zero)",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (A * fy) / gamma_M0;
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.10" },
      });
    }
    return Math.abs(N_Ed);
  },

  n: ({ abs_N_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.10" },
      });
    }
    return abs_N_Ed / N_pl_Rd;
  },

  a_w_raw: ({ section_shape, A, Av_y, Av_z }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (section_shape === "I") return (A - Av_y) / A;
    return Av_z / A;
  },

  a_w: ({ a_w_raw }) => Math.min(a_w_raw, 0.5),

  a_f_raw: ({ section_shape, A, Av_y, Av_z }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (section_shape === "I") return (A - Av_y) / A;
    return Av_z / A;
  },

  a_f: ({ a_f_raw }) => Math.min(a_f_raw, 0.5),

  Wpl_y_eff: ({ section_shape, Wpl_y, b, h, tf, tw, rho_y, rho_z, Av_z }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    const isISection = section_shape === "I";
    if (isISection && (!Number.isFinite(b) || b <= 0 || !Number.isFinite(h) || h <= 0)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: b and h must be > 0",
        details: { b, h, sectionRef: "6.2.10" },
      });
    }
    if (
      isISection &&
      (!Number.isFinite(tf) || tf <= 0 || !Number.isFinite(tw) || tw <= 0)
    ) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tf and tw must be > 0",
        details: { tf, tw, sectionRef: "6.2.10" },
      });
    }

    if (isISection) {
      const tfEff = (1 - rho_y) * tf;
      const twEff = (1 - rho_z) * tw;

      if (!Number.isFinite(tfEff) || tfEff <= 0) {
        throw new Ec3VerificationError({
          type: "invalid-input-domain",
          message: "biaxial-axial-shear: reduced flange thickness must be > 0",
          details: { tfEff, rho_y, sectionRef: "6.2.10" },
        });
      }
      if (!Number.isFinite(twEff) || twEff <= 0) {
        throw new Ec3VerificationError({
          type: "invalid-input-domain",
          message: "biaxial-axial-shear: reduced web thickness must be > 0",
          details: { twEff, rho_z, sectionRef: "6.2.10" },
        });
      }

      const simpleBase = b * tf * (h - tf) + (tw * (h - 2 * tf) ** 2) / 4;
      const simpleReduced =
        b * tfEff * (h - tfEff) + (twEff * (h - 2 * tfEff) ** 2) / 4;
      const rootOffset = Wpl_y - simpleBase;
      const reduced = simpleReduced + rootOffset;

      if (!Number.isFinite(reduced) || reduced <= 0) {
        throw new Ec3VerificationError({
          type: "invalid-input-domain",
          message: "biaxial-axial-shear: reduced Wpl_y_eff must be > 0",
          details: { Wpl_y_eff: reduced, sectionRef: "6.2.10" },
        });
      }

      return reduced;
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }
    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.10" },
      });
    }

    const reduced = Wpl_y - (rho_z * Av_z ** 2) / (4 * tw);
    if (!Number.isFinite(reduced) || reduced <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: reduced Wpl_y_eff must be > 0",
        details: { Wpl_y_eff: reduced, sectionRef: "6.2.10" },
      });
    }
    return reduced;
  },

  M_y_V_Rd: ({ Wpl_y_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.10" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator gamma_M0 must be > 0 (division by zero)",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (Wpl_y_eff * fy) / gamma_M0;
  },

  axial_y_ratio: ({ n, a_w }) => {
    const denom = 1 - 0.5 * a_w;
    if (!Number.isFinite(denom) || denom <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator (1-0.5*a_w) must be > 0 (division by zero)",
        details: { a_w, sectionRef: "6.2.9.1" },
      });
    }
    return (1 - n) / denom;
  },

  axial_y_factor: ({ axial_y_ratio }) => Math.min(1, axial_y_ratio),

  M_NV_y_Rd: ({ M_y_V_Rd, axial_y_factor }) => {
    const reduced = M_y_V_Rd * axial_y_factor;
    if (!Number.isFinite(reduced) || reduced <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_NV_y_Rd must be > 0",
        details: { M_NV_y_Rd: reduced, sectionRef: "6.2.10" },
      });
    }
    return reduced;
  },

  Wpl_z_web: ({ Av_z, tw }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }
    return (Av_z * tw) / 4;
  },

  W_z_res: ({ section_class, Wpl_z, Wel_z }) => {
    const value = section_class === 3 ? Wel_z : Wpl_z;
    if (!Number.isFinite(value) || value <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: W_z_res must be > 0",
        details: { W_z_res: value, sectionRef: "6.2.5" },
      });
    }
    return value;
  },

  Wpl_z_eff: ({ W_z_res, rho_y, Wpl_z_web }) => {
    const reduced = W_z_res - rho_y * (W_z_res - Wpl_z_web);
    if (!Number.isFinite(reduced) || reduced <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: reduced Wpl_z_eff must be > 0",
        details: { Wpl_z_eff: reduced, sectionRef: "6.2.8" },
      });
    }
    return reduced;
  },

  M_z_V_Rd: ({ Wpl_z_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator gamma_M0 must be > 0 (division by zero)",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (Wpl_z_eff * fy) / gamma_M0;
  },

  axial_z_ratio: ({ n, a_f }) => {
    const denom = 1 - a_f;
    if (!Number.isFinite(denom) || denom <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator (1-a_f) must be > 0 (division by zero)",
        details: { a_f, sectionRef: "6.2.9.1" },
      });
    }
    return (n - a_f) / denom;
  },

  axial_z_factor: ({ axial_z_ratio }) => 1 - axial_z_ratio ** 2,

  n_le_af: ({ n, a_f }) => (n <= a_f ? 1 : 0),

  M_NV_z_Rd: ({ M_z_V_Rd, n_le_af, axial_z_factor }) => {
    const reduced = M_z_V_Rd * (n_le_af + (1 - n_le_af) * axial_z_factor);
    if (!Number.isFinite(reduced) || reduced <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_NV_z_Rd must be > 0",
        details: { M_NV_z_Rd: reduced, sectionRef: "6.2.10" },
      });
    }
    return reduced;
  },

  alpha_biax: ({ section_shape, n }) => {
    if (section_shape !== "RHS") return 2;
    const denom = 1 - 1.13 * n ** 2;
    if (!Number.isFinite(denom) || denom <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator (1-1.13*n^2) must be > 0 (division by zero)",
        details: { n, sectionRef: "6.2.9.1" },
      });
    }
    return Math.min(1.66 / denom, 6);
  },

  beta_biax: ({ section_shape, n }) => {
    if (section_shape === "CHS") return 2;
    if (section_shape === "RHS") {
      const denom = 1 - 1.13 * n ** 2;
      if (!Number.isFinite(denom) || denom <= 0) {
        throw new Ec3VerificationError({
          type: "invalid-input-domain",
          message:
            "biaxial-axial-shear: denominator (1-1.13*n^2) must be > 0 (division by zero)",
          details: { n, sectionRef: "6.2.9.1" },
        });
      }
      return Math.min(1.66 / denom, 6);
    }
    return Math.max(1, 5 * n);
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.10" },
      });
    }
    return Math.abs(M_y_Ed);
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.10" },
      });
    }
    return Math.abs(M_z_Ed);
  },

  ratio_y: ({ abs_M_y_Ed, M_NV_y_Rd }) => {
    if (!Number.isFinite(M_NV_y_Rd) || M_NV_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_y_Rd must be > 0 (division by zero)",
        details: { M_NV_y_Rd, sectionRef: "6.2.10" },
      });
    }
    return abs_M_y_Ed / M_NV_y_Rd;
  },

  ratio_z: ({ abs_M_z_Ed, M_NV_z_Rd }) => {
    if (!Number.isFinite(M_NV_z_Rd) || M_NV_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_z_Rd must be > 0 (division by zero)",
        details: { M_NV_z_Rd, sectionRef: "6.2.10" },
      });
    }
    return abs_M_z_Ed / M_NV_z_Rd;
  },

  term_y: ({ ratio_y, alpha_biax }) => ratio_y ** alpha_biax,

  term_z: ({ ratio_z, beta_biax }) => ratio_z ** beta_biax,

  biaxial_axial_shear_check: ({ term_y, term_z }) => term_y + term_z,
});

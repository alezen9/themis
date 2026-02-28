import { describe, expect, it } from "vitest";
import { ec3Verifications } from "../src/verifications";

type RequiredKeySet = {
  checkIndex: number;
  keys: string[];
};

const requiredOperationKeys: RequiredKeySet[] = [
  {
    checkIndex: 1, // tension
    keys: ["abs_N_Ed"],
  },
  {
    checkIndex: 2, // compression
    keys: ["abs_N_Ed"],
  },
  {
    checkIndex: 3, // bending-y
    keys: ["abs_M_y_Ed"],
  },
  {
    checkIndex: 4, // bending-z
    keys: ["abs_M_z_Ed"],
  },
  {
    checkIndex: 5, // shear-z
    keys: ["sqrt3", "V_pl_z_num", "V_pl_z_den", "abs_V_z_Ed"],
  },
  {
    checkIndex: 6, // shear-y
    keys: ["sqrt3", "V_pl_y_num", "V_pl_y_den", "abs_V_y_Ed"],
  },
  {
    checkIndex: 9, // bending-y-axial
    keys: [
      "abs_N_Ed",
      "a_w_raw",
      "axial_num",
      "axial_den",
      "axial_ratio",
      "axial_factor",
      "abs_M_y_Ed",
    ],
  },
  {
    checkIndex: 10, // bending-z-axial
    keys: [
      "abs_N_Ed",
      "a_f_raw",
      "n_minus_af",
      "one_minus_af",
      "axial_ratio",
      "axial_ratio_sq",
      "axial_factor",
      "abs_M_z_Ed",
    ],
  },
  {
    checkIndex: 11, // biaxial-axial
    keys: [
      "rhs_exp_den",
      "rhs_exp_raw",
      "rhs_exp",
      "axial_y_factor",
      "axial_z_factor",
      "ratio_y",
      "ratio_z",
      "term_y",
      "term_z",
    ],
  },
  {
    checkIndex: 15, // buckling-y
    keys: [
      "piSq",
      "Lcr_y_sq",
      "N_cr_y_num",
      "lambda_bar_y_sq",
      "phi_y_alpha_term",
      "chi_y_den",
      "chi_y_base",
      "N_b_y_num",
      "abs_N_Ed",
    ],
  },
  {
    checkIndex: 16, // buckling-z
    keys: [
      "piSq",
      "Lcr_z_sq",
      "N_cr_z_num",
      "lambda_bar_z_sq",
      "phi_z_alpha_term",
      "chi_z_den",
      "chi_z_base",
      "N_b_z_num",
      "abs_N_Ed",
    ],
  },
  {
    checkIndex: 17, // torsional-buckling
    keys: [
      "piSq",
      "Lcr_T_sq",
      "N_cr_T_num",
      "lambda_bar_TF_sq",
      "chi_TF_den",
      "chi_TF_base",
      "N_b_TF_num",
      "abs_N_Ed",
    ],
  },
  {
    checkIndex: 18, // ltb
    keys: [
      "piSq",
      "Lcr_LT_sq",
      "euler_term",
      "torsion_sum",
      "lambda_bar_LT_sq",
      "chi_LT_den",
      "chi_LT_base",
      "M_b_num",
      "abs_M_y_Ed",
    ],
  },
  {
    checkIndex: 19, // beam-column-61-m1
    keys: [
      "piSq",
      "Lcr_y_sq",
      "Lcr_z_sq",
      "Lcr_LT_sq",
      "N_cr_y_num",
      "N_cr_z_num",
      "ncr_t_num",
      "euler_term",
      "torsion_term",
      "lambda_bar_0_num",
      "cm_branch_limit",
      "cm_branch_active",
      "cm_amp",
      "cm_denom",
      "k_yy_denom",
      "k_zz_denom",
      "bc_61_term1_den",
      "bc_61_term2_den",
      "bc_61_term3_den",
      "bc_61_term1",
      "bc_61_term2",
      "bc_61_term3",
    ],
  },
  {
    checkIndex: 20, // beam-column-62-m1
    keys: [
      "piSq",
      "Lcr_y_sq",
      "Lcr_z_sq",
      "Lcr_LT_sq",
      "N_cr_y_num",
      "N_cr_z_num",
      "ncr_t_num",
      "euler_term",
      "torsion_term",
      "lambda_bar_0_num",
      "cm_branch_limit",
      "cm_branch_active",
      "cm_amp",
      "cm_denom",
      "k_yy_denom",
      "k_zz_denom",
      "bc_62_term1_den",
      "bc_62_term2_den",
      "bc_62_term3_den",
      "bc_62_term1",
      "bc_62_term2",
      "bc_62_term3",
    ],
  },
  {
    checkIndex: 21, // beam-column-61-m2
    keys: [
      "piSq",
      "Lcr_y_sq",
      "N_cr_y",
      "lambda_bar_y_sq",
      "chi_y_den",
      "lambda_LT_sq",
      "chi_LT_den",
      "k_yy_branch1",
      "k_zz_aux",
      "bc_61_term1",
      "bc_61_term2",
      "bc_61_term3",
    ],
  },
  {
    checkIndex: 22, // beam-column-62-m2
    keys: [
      "piSq",
      "Lcr_z_sq",
      "N_cr_z",
      "lambda_bar_z_sq",
      "chi_z_den",
      "lambda_LT_sq",
      "chi_LT_den",
      "k_zz_branch1",
      "k_zy_cm_denom",
      "bc_62_term1",
      "bc_62_term2",
      "bc_62_term3",
    ],
  },
];

describe("operation atomization contract", () => {
  it("keeps explicit operation-chain keys on complex checks", () => {
    for (const set of requiredOperationKeys) {
      const def = ec3Verifications[set.checkIndex - 1];
      const keys = new Set(def.nodes.map((node) => node.key));
      for (const key of set.keys) {
        expect(keys.has(key), `${def.nodes.at(-1)?.key}: missing operation key ${key}`).toBe(true);
      }
    }
  });

  it("keeps final check evaluators as pure composition without local branching blocks", () => {
    for (const def of ec3Verifications) {
      const checkNodes = def.nodes.filter((node) => node.type === "check");
      for (const checkNode of checkNodes) {
        const evaluator = def.evaluate[checkNode.key];
        expect(typeof evaluator, `${checkNode.key}: missing evaluator`).toBe("function");
        const src = evaluator.toString();
        expect(src, `${checkNode.key}: final check evaluator should not define local temporaries`).not.toContain("const ");
        expect(src, `${checkNode.key}: final check evaluator should not branch`).not.toContain("if (");
      }
    }
  });

  it("keeps selected operation handlers free of local temporaries", () => {
    const strictKeys: Record<number, string[]> = {
      19: ["N_cr_y", "N_cr_z", "N_cr_T", "M_cr", "Cm_y", "Cm_LT", "k_yy", "k_zz", "k_yz"],
      20: ["N_cr_y", "N_cr_z", "N_cr_T", "M_cr", "Cm_y", "Cm_LT", "k_yy", "k_zz", "k_zy"],
      21: ["N_cr_y", "N_cr_z", "M_cr", "k_yy", "k_zz_aux", "k_yz"],
      22: ["N_cr_y", "N_cr_z", "M_cr", "k_zz", "k_zy"],
    };

    for (const [checkIndexRaw, keys] of Object.entries(strictKeys)) {
      const checkIndex = Number(checkIndexRaw);
      const def = ec3Verifications[checkIndex - 1];
      for (const key of keys) {
        const evaluator = def.evaluate[key];
        expect(typeof evaluator, `${def.id}:${key} evaluator missing`).toBe("function");
        const src = evaluator.toString();
        expect(src, `${def.id}:${key} should avoid local const temporaries`).not.toContain("const ");
      }
    }
  });
});

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
    keys: ["sqrt3", "V_pl_zProduct", "V_pl_zFactor", "abs_V_z_Ed"],
  },
  {
    checkIndex: 6, // shear-y
    keys: ["sqrt3", "V_pl_yProduct", "V_pl_yFactor", "abs_V_y_Ed"],
  },
  {
    checkIndex: 9, // bending-y-axial
    keys: [
      "abs_N_Ed",
      "a_w_raw",
      "axialProduct",
      "axialFactor",
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
      "rhs_expFactor",
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
      "N_cr_yProduct",
      "lambda_bar_y_sq",
      "phi_y_alpha_term",
      "chi_yFactor",
      "chi_y_base",
      "N_b_yProduct",
      "abs_N_Ed",
    ],
  },
  {
    checkIndex: 16, // buckling-z
    keys: [
      "piSq",
      "Lcr_z_sq",
      "N_cr_zProduct",
      "lambda_bar_z_sq",
      "phi_z_alpha_term",
      "chi_zFactor",
      "chi_z_base",
      "N_b_zProduct",
      "abs_N_Ed",
    ],
  },
  {
    checkIndex: 17, // torsional-buckling
    keys: [
      "piSq",
      "Lcr_T_sq",
      "N_cr_TProduct",
      "lambda_bar_TF_sq",
      "chi_TFFactor",
      "chi_TF_base",
      "N_b_TFProduct",
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
      "chi_LTFactor",
      "chi_LT_base",
      "M_bProduct",
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
      "N_cr_yProduct",
      "N_cr_zProduct",
      "ncr_tProduct",
      "euler_term",
      "torsion_term",
      "lambda_bar_0Product",
      "cm_branch_limit",
      "cm_branch_active",
      "cm_amp",
      "cmReserve",
      "k_yyReserve",
      "k_zzReserve",
      "bc_61_term1Factor",
      "bc_61_term2Factor",
      "bc_61_term3Factor",
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
      "N_cr_yProduct",
      "N_cr_zProduct",
      "ncr_tProduct",
      "euler_term",
      "torsion_term",
      "lambda_bar_0Product",
      "cm_branch_limit",
      "cm_branch_active",
      "cm_amp",
      "cmReserve",
      "k_yyReserve",
      "k_zzReserve",
      "bc_62_term1Factor",
      "bc_62_term2Factor",
      "bc_62_term3Factor",
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
      "chi_yFactor",
      "lambda_LT_sq",
      "chi_LTFactor",
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
      "chi_zFactor",
      "lambda_LT_sq",
      "chi_LTFactor",
      "k_zz_branch1",
      "k_zy_cmReserve",
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

import { NationalAnnex } from "@ndg/ndg-core";

export const italianAnnex = {
  id: "italian",
  name: "NTC 2018",
  coefficients: {
    gamma_M0: 1.05,
    gamma_M1: 1.05,
    gamma_M2: 1.25,
    eta: 1.2,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
    f_method: "default-equation",
    interaction_factor_method: "any",
    buckling_curves_LT_policy: "default-rolled-welded",
  },
} as const satisfies NationalAnnex;

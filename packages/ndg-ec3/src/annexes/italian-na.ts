import type { Ec3NationalAnnex } from "./types";

/** Italian National Annex (NTC 2018 / Circolare 2019). */
export const italianAnnex = {
  id: "italian",
  name: "🇮🇹 NTC 2018",
  interactionFactorMethod: "B",
  coefficients: {
    // Partial factors — NTC 2018 §4.2.4.1.2
    gamma_M0: 1.05,
    gamma_M1: 1.05,
    gamma_M2: 1.25,

    // Shear area factor
    eta: 1.2,

    // LTB NDP — same as Eurocode base
    lambda_LT_0: 0.4,
    beta_LT: 0.75,

    f_method: "default-equation",
    interaction_factor_method: "any",
    buckling_curves_LT_policy: "default",
  },
} as const satisfies Ec3NationalAnnex;

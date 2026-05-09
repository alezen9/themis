import type { Ec3NationalAnnex } from "./types";

/** EN1993-1-1 base Eurocode values (no national modifications). */
export const eurocodeAnnex = {
  id: "eurocode",
  name: "Eurocode",
  interactionFactorMethod: "both",
  coefficients: {
    // Partial factors §6.1
    gamma_M0: 1.0,
    gamma_M1: 1.0,
    gamma_M2: 1.25,

    // Shear area factor §6.2.6(3)
    eta: 1.2,

    // LTB NDP §6.3.2.3
    lambda_LT_0: 0.4,
    beta_LT: 0.75,

    f_method: "default-equation",
    interaction_factor_method: "both",
    buckling_curves_LT_policy: "default-rolled-welded",
  },
} as const satisfies Ec3NationalAnnex;

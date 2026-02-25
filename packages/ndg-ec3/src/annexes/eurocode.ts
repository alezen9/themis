import type { Ec3NationalAnnex } from "./types";

/** EN1993-1-1 base Eurocode values (no national modifications). */
export const eurocodeAnnex: Ec3NationalAnnex = {
  id: "eurocode",
  name: "Eurocode (base)",
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

    // LTB correction factor f §6.3.2.3(2)
    k_c_correction: 1, // 1 = apply f correction, 0 = no correction
  },
};

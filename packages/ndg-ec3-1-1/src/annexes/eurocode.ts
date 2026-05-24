export const eurocodeAnnex = {
  id: "eurocode",
  name: "Eurocode",
  coefficients: {
    gamma_M0: 1.0,
    gamma_M1: 1.0,
    gamma_M2: 1.25,
    eta: 1.2,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
    f_method: "default-equation",
    interaction_factor_method: "both",
    buckling_curves_LT_policy: "default-rolled-welded",
  },
} as const;

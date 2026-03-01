import { describe, expect, it } from "vitest";
import { decodeWebsiteCalculationPayload } from "./website-payload-decoder";

const payload: Record<string, string> = {
  "Calculation.SteelClass": "1",
  "Calculation.Profile": "11",
  "Calculation.SectionClass": "0",
  "Calculation.L": "5",
  "Calculation.N": "-100",
  "Calculation.Vy": "5",
  "Calculation.Vz": "10",
  "Calculation.My": "50",
  "Calculation.Mz": "10",
  "Calculation.Lcry_L": "1",
  "Calculation.MomentDiagramMy": "0",
  "Calculation.psiy": "0.5",
  "Calculation.SupportConditionsMy": "0",
  "Calculation.Lcrz_L": "1",
  "Calculation.MomentDiagramMz": "0",
  "Calculation.psiz": "0.5",
  "Calculation.SupportConditionsMz": "0",
  "Calculation.TorsionalDeformations": "0",
  "Calculation.LLT_L": "1",
  "Calculation.MomentDiagramLT": "0",
  "Calculation.psiLT": "0.5",
  "Calculation.SupportConditionsLT": "0",
  "Calculation.LoadLocation": "1",
  "Calculation.LcrT_L": "1",
  "Calculation.gammaM0": "1.05",
  "Calculation.gammaM1": "1.05",
  "Calculation.lamdaBarLT0Rule": "0",
  "Calculation.betaRule": "0",
  "Calculation.BucklingCurvesForLTBucklingRule": "0",
  "Calculation.fFactorMethod": "0",
  "Calculation.InteractionMethod": "0",
};

describe("website payload decoder", () => {
  it("maps EurocodeApplied coded payload into app enums and engineering units", () => {
    const decoded = decodeWebsiteCalculationPayload(payload);

    expect(decoded.sectionId).toBe("IPE300");
    expect(decoded.gradeId).toBe("EN10025-2:S235");

    expect(decoded.editable.section_class_mode).toBe("auto");
    expect(decoded.editable.torsional_deformations).toBe("yes");
    expect(decoded.editable.interaction_factor_method).toBe("both");
    expect(decoded.editable.coefficient_f_method).toBe("default-equation");
    expect(decoded.editable.buckling_curves_LT_policy).toBe("default");

    expect(decoded.editable.moment_shape_y).toBe("uniform");
    expect(decoded.editable.moment_shape_z).toBe("uniform");
    expect(decoded.editable.moment_shape_LT).toBe("uniform");
    expect(decoded.editable.support_condition_y).toBe("pinned-pinned");
    expect(decoded.editable.support_condition_z).toBe("pinned-pinned");
    expect(decoded.editable.support_condition_LT).toBe("pinned-pinned");
    expect(decoded.editable.load_application_LT).toBe("centroid");

    expect(decoded.editable.N_Ed).toBe(-100_000);
    expect(decoded.editable.M_y_Ed).toBe(50_000_000);
    expect(decoded.editable.M_z_Ed).toBe(10_000_000);
    expect(decoded.editable.V_y_Ed).toBe(5_000);
    expect(decoded.editable.V_z_Ed).toBe(10_000);
    expect(decoded.editable.L).toBe(5_000);
    expect(decoded.editable.k_y).toBe(1);
    expect(decoded.editable.k_z).toBe(1);
    expect(decoded.editable.LLT_over_L).toBe(1);
    expect(decoded.editable.LcrT_over_L).toBe(1);

    expect(decoded.annex.gamma_M0).toBe(1.05);
    expect(decoded.annex.gamma_M1).toBe(1.05);
    expect(decoded.annex.lambda_LT_0).toBe(0.4);
    expect(decoded.annex.beta_LT).toBe(0.75);
  });
});

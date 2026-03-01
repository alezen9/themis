import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type InputSpecEntry = {
  id: string;
  engineKey: string;
  status: "implemented-now" | "mapped-internally" | "deferred";
  default?: string | number;
  visibility?: string;
  options?: Array<string | number>;
};

type CalculatorInputSurface = {
  source: string;
  version: string;
  inputs: InputSpecEntry[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parityDir = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity");
const inputSurfacePath = path.join(parityDir, "calculator-input-surface.json");

describe("calculator input surface parity spec", () => {
  const spec = JSON.parse(fs.readFileSync(inputSurfacePath, "utf8")) as CalculatorInputSurface;

  it("contains required parity entries for class mode and stability selectors", () => {
    const byId = new Map(spec.inputs.map((entry) => [entry.id, entry]));
    expect(byId.get("Calculation_SectionClass")?.engineKey).toBe("section_class_mode");
    expect(byId.get("Calculation_SectionClass")?.default).toBe("auto");
    expect(byId.get("Calculation_InteractionFactorMethod")?.engineKey).toBe("interaction_factor_method");
    expect(byId.get("Calculation_CoefficientFMethod")?.engineKey).toBe("coefficient_f_method");
    expect(byId.get("Calculation_BucklingCurvesLT")?.engineKey).toBe("buckling_curves_LT_policy");
    expect(byId.get("Calculation_TorsionalDeformations")?.engineKey).toBe("torsional_deformations");
  });

  it("tracks conditional visibility rules for moment-shape-driven fields", () => {
    const byId = new Map(spec.inputs.map((entry) => [entry.id, entry]));
    expect(byId.get("Calculation_psiy")?.visibility).toContain("moment_shape_y == linear");
    expect(byId.get("Calculation_psiz")?.visibility).toContain("moment_shape_z == linear");
    expect(byId.get("Calculation_psiLT")?.visibility).toContain("moment_shape_LT == linear");
  });

  it("contains deterministic implementation status markers", () => {
    const statusSet = new Set(spec.inputs.map((entry) => entry.status));
    expect(statusSet.has("implemented-now")).toBe(true);
    expect(statusSet.has("mapped-internally")).toBe(true);
    expect(statusSet.has("deferred")).toBe(true);
  });
});


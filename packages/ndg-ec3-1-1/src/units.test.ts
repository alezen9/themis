import { describe, expect, it } from "vitest";

import { applyDisplayUnit, displayUnitOptions, unitLabel } from "./units";

describe("units", () => {
  it("derives the unit label from the key suffix (incl. dotted), unitless otherwise", () => {
    expect(unitLabel("M_y_Ed_Nmm")).toBe("N{\\cdot}mm");
    expect(unitLabel("A_mm2")).toBe("mm^2");
    expect(unitLabel("Iy_mm4")).toBe("mm^4");
    expect(unitLabel("i_geometry.tw_mm")).toBe("mm");
    expect(unitLabel("gamma_M0")).toBeUndefined();
    expect(unitLabel("section_class")).toBeUndefined();
    expect(unitLabel("utilisation")).toBeUndefined();
  });

  it("offers display options only for known units", () => {
    expect(displayUnitOptions("M_c_Rd_Nmm").map(unit => unit.key)).toEqual([
      "Nmm",
      "Nm",
      "kNm",
    ]);
    expect(displayUnitOptions("gamma_M0")).toEqual([]);
  });

  it("converts the value and label for the chosen display unit", () => {
    expect(applyDisplayUnit(8_000_000, "M_c_Rd_Nmm", "kNm")).toEqual({
      value: 8,
      label: "kN{\\cdot}m",
    });
    expect(applyDisplayUnit(1_000_000, "Iy_mm4", "cm4")).toEqual({
      value: 100,
      label: "cm^4",
    });
  });

  it("falls back to the identity unit when displayUnit is missing or unknown", () => {
    expect(applyDisplayUnit(8000, "M_c_Rd_Nmm", undefined)).toEqual({
      value: 8000,
      label: "N{\\cdot}mm",
    });
    expect(applyDisplayUnit(8000, "M_c_Rd_Nmm", "bogus")).toEqual({
      value: 8000,
      label: "N{\\cdot}mm",
    });
  });

  it("returns the raw value with no label for unitless keys", () => {
    expect(applyDisplayUnit(0.5, "utilisation", undefined)).toEqual({
      value: 0.5,
      label: undefined,
    });
  });
});

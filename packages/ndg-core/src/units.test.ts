import { describe, expect, it } from "vitest";

import { getBaseUnit, getUnitOptions, scaleToUnit } from "./units";

describe("units", () => {
  it("derives the base unit from the key suffix (incl. dotted), none otherwise", () => {
    expect(getBaseUnit("M_y_Ed_Nmm")).toEqual({
      key: "Nmm",
      tex: "N{\\cdot}mm",
      factor: 1,
    });
    expect(getBaseUnit("A_mm2")?.tex).toBe("mm^2");
    expect(getBaseUnit("Iy_mm4")?.key).toBe("mm4");
    expect(getBaseUnit("i_geometry.tw_mm")?.tex).toBe("mm");
    expect(getBaseUnit("gamma_M0")).toBeUndefined();
    expect(getBaseUnit("section_class")).toBeUndefined();
    expect(getBaseUnit("utilisation")).toBeUndefined();
  });

  it("offers display options only for known units", () => {
    expect(getUnitOptions("M_c_Rd_Nmm").map(o => o.value)).toEqual([
      "Nmm",
      "Nm",
      "kNm",
    ]);
    expect(getUnitOptions("M_c_Rd_Nmm")[2]).toEqual({
      value: "kNm",
      label: "kNm",
      ctx: { tex: "kN{\\cdot}m" },
    });
    expect(getUnitOptions("gamma_M0")).toEqual([]);
  });

  it("converts the value and tex for the chosen display unit", () => {
    expect(scaleToUnit(8_000_000, "M_c_Rd_Nmm", "kNm")).toEqual({
      value: 8,
      tex: "kN{\\cdot}m",
    });
    expect(scaleToUnit(1_000_000, "Iy_mm4", "cm4")).toEqual({
      value: 100,
      tex: "cm^4",
    });
  });

  it("falls back to the base unit when the unit is missing or unknown", () => {
    expect(scaleToUnit(8000, "M_c_Rd_Nmm", undefined)).toEqual({
      value: 8000,
      tex: "N{\\cdot}mm",
    });
    expect(scaleToUnit(8000, "M_c_Rd_Nmm", "bogus")).toEqual({
      value: 8000,
      tex: "N{\\cdot}mm",
    });
  });

  it("returns the raw value with no tex for unitless keys", () => {
    expect(scaleToUnit(0.5, "utilisation", undefined)).toEqual({
      value: 0.5,
      tex: undefined,
    });
  });
});

import { describe, expect, it } from "vitest";

import { applyDisplayUnit, getDisplayUnitOptionsByKey, unitTex } from "./units";

describe("units", () => {
  it("derives the unit tex from the key suffix (incl. dotted), unitless otherwise", () => {
    expect(unitTex("M_y_Ed_Nmm")).toBe("N{\\cdot}mm");
    expect(unitTex("A_mm2")).toBe("mm^2");
    expect(unitTex("Iy_mm4")).toBe("mm^4");
    expect(unitTex("i_geometry.tw_mm")).toBe("mm");
    expect(unitTex("gamma_M0")).toBeUndefined();
    expect(unitTex("section_class")).toBeUndefined();
    expect(unitTex("utilisation")).toBeUndefined();
  });

  it("offers display options only for known units", () => {
    expect(getDisplayUnitOptionsByKey("M_c_Rd_Nmm").map(o => o.value)).toEqual([
      "Nmm",
      "Nm",
      "kNm",
    ]);
    expect(getDisplayUnitOptionsByKey("M_c_Rd_Nmm")[2]).toEqual({
      value: "kNm",
      label: "kNm",
      ctx: { tex: "kN{\\cdot}m" },
    });
    expect(getDisplayUnitOptionsByKey("gamma_M0")).toEqual([]);
  });

  it("converts the value and tex for the chosen display unit", () => {
    expect(applyDisplayUnit(8_000_000, "M_c_Rd_Nmm", "kNm")).toEqual({
      value: 8,
      tex: "kN{\\cdot}m",
    });
    expect(applyDisplayUnit(1_000_000, "Iy_mm4", "cm4")).toEqual({
      value: 100,
      tex: "cm^4",
    });
  });

  it("falls back to the identity unit when displayUnit is missing or unknown", () => {
    expect(applyDisplayUnit(8000, "M_c_Rd_Nmm", undefined)).toEqual({
      value: 8000,
      tex: "N{\\cdot}mm",
    });
    expect(applyDisplayUnit(8000, "M_c_Rd_Nmm", "bogus")).toEqual({
      value: 8000,
      tex: "N{\\cdot}mm",
    });
  });

  it("returns the raw value with no tex for unitless keys", () => {
    expect(applyDisplayUnit(0.5, "utilisation", undefined)).toEqual({
      value: 0.5,
      tex: undefined,
    });
  });
});

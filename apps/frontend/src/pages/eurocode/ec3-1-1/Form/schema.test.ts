import { describe, expect, it } from "vitest";

import { defaultValues } from "./defaultValues";
import { schema } from "./schema";

const parseErrorPaths = (values: unknown) => {
  const result = schema.safeParse(values);
  if (result.success) return [];

  return result.error.issues.map((issue) => issue.path.join("."));
};

describe("schema", () => {
  it("requires I-section dimensions", () => {
    const paths = parseErrorPaths({
      ...defaultValues,
      i_geometry: { ...defaultValues.i_geometry, h_mm: undefined },
    });

    expect(paths).toContain("i_geometry.h_mm");
  });

  it("rejects impossible I-section geometry", () => {
    const paths = parseErrorPaths({
      ...defaultValues,
      i_geometry: { h_mm: 100, b_mm: 20, tw_mm: 10, tf_mm: 40, r_mm: 12 },
    });

    expect(paths).toEqual(
      expect.arrayContaining([
        "i_geometry.h_mm",
        "i_geometry.b_mm",
        "i_geometry.r_mm",
      ]),
    );
  });

  it("rejects oversized dimensions", () => {
    const paths = parseErrorPaths({
      ...defaultValues,
      i_geometry: { ...defaultValues.i_geometry, h_mm: 2001 },
      L_m: 501,
    });

    expect(paths).toEqual(expect.arrayContaining(["i_geometry.h_mm", "L_m"]));
  });

  it("rejects impossible RHS geometry", () => {
    const paths = parseErrorPaths({
      ...defaultValues,
      rhs_geometry: { h_mm: 100, b_mm: 20, tw_mm: 12, ro_mm: 18, ri_mm: 20 },
    });

    expect(paths).toEqual(
      expect.arrayContaining([
        "rhs_geometry.b_mm",
        "rhs_geometry.ro_mm",
        "rhs_geometry.ri_mm",
      ]),
    );
  });

  it("rejects impossible CHS geometry", () => {
    const paths = parseErrorPaths({
      ...defaultValues,
      chs_geometry: { d_mm: 20, t_mm: 10 },
    });

    expect(paths).toContain("chs_geometry.d_mm");
  });
});

import type { RefinementCtx } from "zod";
import type { Ec3FormValues } from "./schema";

const addIssue = (
  ctx: RefinementCtx<Ec3FormValues>,
  path: string,
  message: string,
) => {
  ctx.addIssue({ code: "custom", path: path.split("."), message });
};

export const schemaRefiner = (
  values: Ec3FormValues,
  ctx: RefinementCtx<Ec3FormValues>,
) => {
  const { i_geometry, rhs_geometry, chs_geometry } = values;

  if (i_geometry.h_mm <= 2 * (i_geometry.tf_mm + i_geometry.r_mm))
    addIssue(ctx, "i_geometry.h_mm", "Height too small");
  if (i_geometry.b_mm <= i_geometry.tw_mm + 2 * i_geometry.r_mm)
    addIssue(ctx, "i_geometry.b_mm", "Width too small");
  if (i_geometry.r_mm >= i_geometry.h_mm / 2 - i_geometry.tf_mm)
    addIssue(ctx, "i_geometry.r_mm", "Radius too large");
  if (i_geometry.r_mm >= (i_geometry.b_mm - i_geometry.tw_mm) / 2)
    addIssue(ctx, "i_geometry.r_mm", "Radius too large");

  if (rhs_geometry.ro_mm < rhs_geometry.ri_mm + rhs_geometry.tw_mm)
    addIssue(ctx, "rhs_geometry.ro_mm", "Outer radius too small");
  if (rhs_geometry.ro_mm >= rhs_geometry.h_mm / 2)
    addIssue(ctx, "rhs_geometry.ro_mm", "Outer radius too large");
  if (rhs_geometry.ro_mm >= rhs_geometry.b_mm / 2)
    addIssue(ctx, "rhs_geometry.ro_mm", "Outer radius too large");
  if (rhs_geometry.ri_mm >= rhs_geometry.h_mm / 2 - rhs_geometry.tw_mm)
    addIssue(ctx, "rhs_geometry.ri_mm", "Inner radius too large");
  if (rhs_geometry.ri_mm >= rhs_geometry.b_mm / 2 - rhs_geometry.tw_mm)
    addIssue(ctx, "rhs_geometry.ri_mm", "Inner radius too large");
  if (
    rhs_geometry.h_mm <= 2 * rhs_geometry.ro_mm ||
    rhs_geometry.h_mm <= 2 * (rhs_geometry.tw_mm + rhs_geometry.ri_mm)
  )
    addIssue(ctx, "rhs_geometry.h_mm", "Height too small");
  if (
    rhs_geometry.b_mm <= 2 * rhs_geometry.ro_mm ||
    rhs_geometry.b_mm <= 2 * (rhs_geometry.tw_mm + rhs_geometry.ri_mm)
  )
    addIssue(ctx, "rhs_geometry.b_mm", "Width too small");

  if (chs_geometry.d_mm <= 2 * chs_geometry.t_mm)
    addIssue(ctx, "chs_geometry.d_mm", "Diameter too small");
};

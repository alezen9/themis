import { z } from "zod";

import {
  MAX_VALUE_MESSAGE,
  NON_NEGATIVE_NUMBER_MESSAGE,
  POSITIVE_NUMBER_MESSAGE,
  REQUIRED_NUMBER_MESSAGE,
} from "./constants";

const addIssue = (ctx: z.RefinementCtx, path: string, message: string) => {
  ctx.addIssue({ code: "custom", path: path.split("."), message });
};

export const iGeometrySchema = z
  .strictObject({
    h_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(2000, MAX_VALUE_MESSAGE),
    b_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(2000, MAX_VALUE_MESSAGE),
    tw_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(200, MAX_VALUE_MESSAGE),
    tf_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(200, MAX_VALUE_MESSAGE),
    r_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .min(0, NON_NEGATIVE_NUMBER_MESSAGE)
      .max(500, MAX_VALUE_MESSAGE),
  })
  .superRefine((geometry, ctx) => {
    const { h_mm, b_mm, tf_mm, tw_mm, r_mm } = geometry;
    if (h_mm <= 2 * (tf_mm + r_mm)) {
      addIssue(ctx, "h_mm", "Height too small");
      addIssue(ctx, "tf_mm", "Flange thickness too large");
      addIssue(ctx, "r_mm", "Radius too large");
    }
    if (b_mm <= tw_mm + 2 * r_mm) {
      addIssue(ctx, "b_mm", "Width too small");
      addIssue(ctx, "tw_mm", "Web thickness too large");
      addIssue(ctx, "r_mm", "Radius too large");
    }
    if (r_mm >= h_mm / 2 - tf_mm) {
      addIssue(ctx, "r_mm", "Radius too large");
      addIssue(ctx, "h_mm", "Height too small");
      addIssue(ctx, "tf_mm", "Flange thickness too large");
    }
    if (r_mm >= (b_mm - tw_mm) / 2) {
      addIssue(ctx, "r_mm", "Radius too large");
      addIssue(ctx, "b_mm", "Width too small");
      addIssue(ctx, "tw_mm", "Web thickness too large");
    }
  });

export const rhsGeometrySchema = z
  .strictObject({
    h_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(2000, MAX_VALUE_MESSAGE),
    b_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(2000, MAX_VALUE_MESSAGE),
    tw_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(200, MAX_VALUE_MESSAGE),
    ro_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(500, MAX_VALUE_MESSAGE),
    ri_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(500, MAX_VALUE_MESSAGE),
  })
  .superRefine((geometry, ctx) => {
    const { h_mm, b_mm, tw_mm, ro_mm, ri_mm } = geometry;
    if (ro_mm <= ri_mm) {
      addIssue(ctx, "ro_mm", "Outer radius too small");
      addIssue(ctx, "ri_mm", "Inner radius too large");
    }
    if (ro_mm > ri_mm + tw_mm) {
      addIssue(ctx, "ro_mm", "Outer radius too large");
      addIssue(ctx, "ri_mm", "Inner radius too small");
      addIssue(ctx, "tw_mm", "Wall thickness too small");
    }
    if (ro_mm >= h_mm / 2) {
      addIssue(ctx, "ro_mm", "Outer radius too large");
      addIssue(ctx, "h_mm", "Height too small");
    }
    if (ro_mm >= b_mm / 2) {
      addIssue(ctx, "ro_mm", "Outer radius too large");
      addIssue(ctx, "b_mm", "Width too small");
    }
    if (h_mm <= 2 * tw_mm) {
      addIssue(ctx, "h_mm", "Height too small");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
    }
    if (b_mm <= 2 * tw_mm) {
      addIssue(ctx, "b_mm", "Width too small");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
    }
    if (ri_mm >= h_mm / 2 - tw_mm) {
      addIssue(ctx, "ri_mm", "Inner radius too large");
      addIssue(ctx, "h_mm", "Height too small");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
    }
    if (ri_mm >= b_mm / 2 - tw_mm) {
      addIssue(ctx, "ri_mm", "Inner radius too large");
      addIssue(ctx, "b_mm", "Width too small");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
    }
    if (h_mm <= 2 * ro_mm || h_mm <= 2 * (tw_mm + ri_mm)) {
      addIssue(ctx, "h_mm", "Height too small");
      addIssue(ctx, "ro_mm", "Outer radius too large");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
      addIssue(ctx, "ri_mm", "Inner radius too large");
    }
    if (b_mm <= 2 * ro_mm || b_mm <= 2 * (tw_mm + ri_mm)) {
      addIssue(ctx, "b_mm", "Width too small");
      addIssue(ctx, "ro_mm", "Outer radius too large");
      addIssue(ctx, "tw_mm", "Wall thickness too large");
      addIssue(ctx, "ri_mm", "Inner radius too large");
    }
  });

export const chsGeometrySchema = z
  .strictObject({
    d_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(2000, MAX_VALUE_MESSAGE),
    t_mm: z
      .number(REQUIRED_NUMBER_MESSAGE)
      .positive(POSITIVE_NUMBER_MESSAGE)
      .max(200, MAX_VALUE_MESSAGE),
  })
  .superRefine((geometry, ctx) => {
    const { d_mm, t_mm } = geometry;
    if (d_mm <= 2 * t_mm) {
      addIssue(ctx, "d_mm", "Diameter too small");
      addIssue(ctx, "t_mm", "Wall thickness too large");
    }
  });

export const geometrySchema = z.strictObject({
  i_geometry: iGeometrySchema,
  rhs_geometry: rhsGeometrySchema,
  chs_geometry: chsGeometrySchema,
  L_m: z
    .number(REQUIRED_NUMBER_MESSAGE)
    .positive(POSITIVE_NUMBER_MESSAGE)
    .max(500, MAX_VALUE_MESSAGE),
});

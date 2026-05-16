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
    if (geometry.h_mm <= 2 * (geometry.tf_mm + geometry.r_mm))
      addIssue(ctx, "h_mm", "Height too small");
    if (geometry.b_mm <= geometry.tw_mm + 2 * geometry.r_mm)
      addIssue(ctx, "b_mm", "Width too small");
    if (geometry.r_mm >= geometry.h_mm / 2 - geometry.tf_mm)
      addIssue(ctx, "r_mm", "Radius too large");
    if (geometry.r_mm >= (geometry.b_mm - geometry.tw_mm) / 2)
      addIssue(ctx, "r_mm", "Radius too large");
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
    if (geometry.ro_mm <= geometry.ri_mm)
      addIssue(ctx, "ro_mm", "Outer radius too small");
    if (geometry.ro_mm > geometry.ri_mm + geometry.tw_mm)
      addIssue(ctx, "ro_mm", "Outer radius too large");
    if (geometry.ro_mm >= geometry.h_mm / 2)
      addIssue(ctx, "ro_mm", "Outer radius too large");
    if (geometry.ro_mm >= geometry.b_mm / 2)
      addIssue(ctx, "ro_mm", "Outer radius too large");
    if (geometry.h_mm <= 2 * geometry.tw_mm)
      addIssue(ctx, "h_mm", "Height too small");
    if (geometry.b_mm <= 2 * geometry.tw_mm)
      addIssue(ctx, "b_mm", "Width too small");
    if (geometry.ri_mm >= geometry.h_mm / 2 - geometry.tw_mm)
      addIssue(ctx, "ri_mm", "Inner radius too large");
    if (geometry.ri_mm >= geometry.b_mm / 2 - geometry.tw_mm)
      addIssue(ctx, "ri_mm", "Inner radius too large");
    if (
      geometry.h_mm <= 2 * geometry.ro_mm ||
      geometry.h_mm <= 2 * (geometry.tw_mm + geometry.ri_mm)
    )
      addIssue(ctx, "h_mm", "Height too small");
    if (
      geometry.b_mm <= 2 * geometry.ro_mm ||
      geometry.b_mm <= 2 * (geometry.tw_mm + geometry.ri_mm)
    )
      addIssue(ctx, "b_mm", "Width too small");
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
    if (geometry.d_mm <= 2 * geometry.t_mm)
      addIssue(ctx, "d_mm", "Diameter too small");
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

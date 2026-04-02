import { z } from "zod";
import { SHAPE_OPTIONS } from "../options";

const BUCKLING_CURVE_OPTIONS = ["a0", "a", "b", "c", "d"] as const;

const computedSectionClassSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

const computedMaterialPropertiesShape = { fy: z.number().positive() };

const computedGeometryPropertiesShape = {
  A: z.number().positive(),
  Iy: z.number().positive(),
  Iz: z.number().positive(),
  Wel_y: z.number().positive(),
  Wel_z: z.number().positive(),
  Wpl_y: z.number().positive(),
  Wpl_z: z.number().positive(),
  Av_y: z.number().positive(),
  Av_z: z.number().positive(),
  It: z.number().positive(),
  Iw: z.number().nonnegative(),
  tw: z.number().nonnegative(),
  hw: z.number().nonnegative(),
  h: z.number().nonnegative(),
  b: z.number().nonnegative(),
  tf: z.number().nonnegative(),
  t: z.number().nonnegative(),
  d: z.number().nonnegative(),
};

const computedBucklingPropertiesShape = {
  section_shape: z.enum(SHAPE_OPTIONS),
  buckling_curve_y: z.enum(BUCKLING_CURVE_OPTIONS),
  buckling_curve_z: z.enum(BUCKLING_CURVE_OPTIONS),
  buckling_curve_LT: z.enum(BUCKLING_CURVE_OPTIONS),
  alpha_y: z.number().positive(),
  alpha_z: z.number().positive(),
  alpha_LT: z.number().positive(),
};

const computedClassificationPropertiesShape = {
  section_class: computedSectionClassSchema,
};

export const additionalPropertiesSchema = z.strictObject({
  ...computedMaterialPropertiesShape,
  ...computedGeometryPropertiesShape,
  ...computedBucklingPropertiesShape,
  ...computedClassificationPropertiesShape,
});

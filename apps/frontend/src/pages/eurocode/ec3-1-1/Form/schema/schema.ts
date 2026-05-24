import { z } from "zod";

import { actionsSchema } from "./actionsSchema";
import { classificationSchema } from "./classificationSchema";
import { flexuralBucklingSchema } from "./flexuralBucklingSchema";
import { geometrySchema } from "./geometrySchema";
import { lateralTorsionalBucklingSchema } from "./lateralTorsionalBucklingSchema";
import { materialSchema } from "./materialSchema";
import { nationalAnnexSchema } from "./nationalAnnexSchema";
import { shapeAndCrossSectionSchema } from "./shapeAndCrossSectionSchema";

export const schema = shapeAndCrossSectionSchema
  .and(materialSchema)
  .and(classificationSchema)
  .and(geometrySchema)
  .and(actionsSchema)
  .and(flexuralBucklingSchema)
  .and(lateralTorsionalBucklingSchema)
  .and(nationalAnnexSchema);

export type Ec3FormValues = z.input<typeof schema>;
export type Ec3ValidFormValues = z.output<typeof schema>;

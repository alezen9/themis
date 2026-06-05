import { z } from "zod";

import { actionsSchema } from "./actionsSchema";
import { classificationSchema } from "./classificationSchema";
import { crossSectionSchema } from "./crossSectionSchema";
import { flexuralBucklingSchema } from "./flexuralBucklingSchema";
import { geometrySchema } from "./geometrySchema";
import { lateralTorsionalBucklingSchema } from "./lateralTorsionalBucklingSchema";
import { materialSchema } from "./materialSchema";
import { nationalAnnexSchema } from "./nationalAnnexSchema";
import { shapeSchema } from "./shapeSchema";

export const schema = shapeSchema
  .and(crossSectionSchema)
  .and(materialSchema)
  .and(classificationSchema)
  .and(geometrySchema)
  .and(actionsSchema)
  .and(flexuralBucklingSchema)
  .and(lateralTorsionalBucklingSchema)
  .and(nationalAnnexSchema);

export type Ec3FormValues = z.input<typeof schema>;
export type Ec3ValidFormValues = z.output<typeof schema>;

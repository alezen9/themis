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

export type Ec3FormValues = z.input<typeof shapeSchema> &
  z.input<typeof crossSectionSchema> &
  z.input<typeof materialSchema> &
  z.input<typeof classificationSchema> &
  z.input<typeof geometrySchema> &
  z.input<typeof actionsSchema> &
  z.input<typeof flexuralBucklingSchema> &
  z.input<typeof lateralTorsionalBucklingSchema> &
  z.input<typeof nationalAnnexSchema>;

export type Ec3ValidFormValues = z.output<typeof shapeSchema> &
  z.output<typeof crossSectionSchema> &
  z.output<typeof materialSchema> &
  z.output<typeof classificationSchema> &
  z.output<typeof geometrySchema> &
  z.output<typeof actionsSchema> &
  z.output<typeof flexuralBucklingSchema> &
  z.output<typeof lateralTorsionalBucklingSchema> &
  z.output<typeof nationalAnnexSchema>;

import { z } from "zod";

import { sectionClassValues } from "../options";

export const classificationSchema = z.strictObject({
  section_class: z.literal(sectionClassValues),
});

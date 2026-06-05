import {
  CheckNodeSchema,
  CoefficientNodeSchema,
  ConstantNodeSchema,
  FormulaNodeSchema,
  TableNodeSchema,
  UserInputNodeSchema,
} from "@ndg/ndg-core";
import { z } from "zod";

export const editorNodeSchema = z.discriminatedUnion("type", [
  CheckNodeSchema.omit({ id: true, children: true }),
  UserInputNodeSchema.omit({ id: true, children: true }),
  FormulaNodeSchema.omit({ id: true, children: true }),
  CoefficientNodeSchema.omit({ id: true, children: true }),
  ConstantNodeSchema.omit({ id: true, children: true }),
  TableNodeSchema.omit({ id: true, children: true }),
]);

export type EditorNodeInput = z.infer<typeof editorNodeSchema>;

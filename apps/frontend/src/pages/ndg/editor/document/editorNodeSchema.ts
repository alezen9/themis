import { NodeMetaSchema } from "@ndg/ndg-core";
import { z } from "zod";

const valueType = z.discriminatedUnion("type", [
  z.object({ type: z.literal("number") }),
  z.object({ type: z.literal("string") }),
  z.object({ type: z.literal("boolean") }),
]);

const identity = {
  symbol: z.string().optional(),
  description: z.string().optional(),
};

const variant = z.enum(["compute", "select"]);

const requireTemplateForCompute = (
  node: { variant: "compute" | "select"; template?: string },
  ctx: z.RefinementCtx,
) => {
  if (node.variant === "compute" && !node.template?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["template"],
      message: "Template is required for compute nodes",
    });
  }
};

export const checkNodeSchema = z.object({
  ...identity,
  type: z.literal("check"),
  variant,
  key: z.literal("utilisation"),
  name: z.string().min(1, "Value is required"),
  valueType,
  meta: NodeMetaSchema.optional(),
  template: z.string().optional(),
});

export const formulaNodeSchema = z.object({
  ...identity,
  type: z.literal("formula"),
  variant,
  key: z.string().min(1, "Value is required"),
  valueType,
  meta: NodeMetaSchema.optional(),
  displayUnit: z.string().optional(),
  template: z.string().optional(),
});

export const userInputNodeSchema = z.object({
  ...identity,
  type: z.literal("user-input"),
  key: z.string().min(1, "Value is required"),
  valueType,
  displayUnit: z.string().optional(),
});

export const coefficientNodeSchema = z.object({
  ...identity,
  type: z.literal("coefficient"),
  key: z.string().min(1, "Value is required"),
  valueType,
  meta: NodeMetaSchema.optional(),
  displayUnit: z.string().optional(),
});

export const constantNodeSchema = z.object({
  ...identity,
  type: z.literal("constant"),
  key: z.string().min(1, "Value is required"),
  valueType,
  displayUnit: z.string().optional(),
  value: z.number("Value is required").optional(),
});

export const tableNodeSchema = z.object({
  ...identity,
  type: z.literal("table"),
  key: z.string().min(1, "Value is required"),
  valueType,
  meta: NodeMetaSchema.optional(),
  source: z.string().min(1, "Value is required"),
  displayUnit: z.string().optional(),
});

export const checkFormSchema = checkNodeSchema.superRefine(
  requireTemplateForCompute,
);
export const formulaFormSchema = formulaNodeSchema.superRefine(
  requireTemplateForCompute,
);

export const editorNodeSchema = z
  .discriminatedUnion("type", [
    checkNodeSchema,
    formulaNodeSchema,
    userInputNodeSchema,
    coefficientNodeSchema,
    constantNodeSchema,
    tableNodeSchema,
  ])
  .superRefine((node, ctx) => {
    if (node.type === "check" || node.type === "formula")
      requireTemplateForCompute(node, ctx);
  });

export type EditorNodeInput = z.infer<typeof editorNodeSchema>;
export type CheckNode = z.infer<typeof checkNodeSchema>;
export type FormulaNode = z.infer<typeof formulaNodeSchema>;
export type UserInputNode = z.infer<typeof userInputNodeSchema>;
export type CoefficientNode = z.infer<typeof coefficientNodeSchema>;
export type ConstantNode = z.infer<typeof constantNodeSchema>;
export type TableNode = z.infer<typeof tableNodeSchema>;

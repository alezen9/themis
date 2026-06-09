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

export const editorNodeSchema = z
  .discriminatedUnion("type", [
    z.object({
      ...identity,
      type: z.literal("check"),
      variant,
      key: z.literal("utilisation"),
      name: z.string().min(1),
      valueType,
      meta: NodeMetaSchema.optional(),
      template: z.string().optional(),
    }),
    z.object({
      ...identity,
      type: z.literal("formula"),
      variant,
      key: z.string().min(1),
      valueType,
      meta: NodeMetaSchema.optional(),
      unit: z.string().optional(),
      template: z.string().optional(),
    }),
    z.object({
      ...identity,
      type: z.literal("user-input"),
      key: z.string().min(1),
      valueType,
      unit: z.string().optional(),
    }),
    z.object({
      ...identity,
      type: z.literal("coefficient"),
      key: z.string().min(1),
      valueType,
      meta: NodeMetaSchema.optional(),
      unit: z.string().optional(),
    }),
    z.object({
      ...identity,
      type: z.literal("constant"),
      key: z.string().min(1),
      valueType,
      unit: z.string().optional(),
      value: z.number().optional(),
    }),
    z.object({
      ...identity,
      type: z.literal("table"),
      key: z.string().min(1),
      valueType,
      meta: NodeMetaSchema.optional(),
      source: z.string().min(1),
      unit: z.string().optional(),
    }),
  ])
  .superRefine((node, ctx) => {
    const isComputed = node.type === "check" || node.type === "formula";
    if (isComputed && node.variant === "compute" && !node.template?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["template"],
        message: "Template is required for compute nodes",
      });
    }
  });

export type EditorNodeInput = z.infer<typeof editorNodeSchema>;

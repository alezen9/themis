import { collectConditionKeys, type Condition } from "@ndg/ndg-core";

export const findUnknownConditionKeys = (
  condition: Condition | undefined,
  availableKeys: Set<string>,
) => {
  if (!condition) return [];
  const referencedKeys = new Set(collectConditionKeys(condition));
  return [...referencedKeys].filter(key => !availableKeys.has(key));
};

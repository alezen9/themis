import { collectConditionKeys, type Condition } from "@ndg/ndg-core";

export const findUnknownConditionKeys = (
  condition: Condition,
  availableKeys: Set<string>,
) => {
  const referencedKeys = new Set(collectConditionKeys(condition));
  return [...referencedKeys].filter(key => !availableKeys.has(key));
};

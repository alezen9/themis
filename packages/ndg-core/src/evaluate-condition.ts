import type { Condition } from "./schemas";

/**
 * Evaluate a condition against a cache of resolved values.
 * Conditions reference cache keys for comparison.
 */
export function evaluateCondition(
  condition: Condition,
  cache: Record<string, number | string>,
): boolean {
  if ("eq" in condition) {
    const [key, expected] = condition.eq;
    return cache[key] === expected;
  }
  if ("lt" in condition) {
    const [key, threshold] = condition.lt;
    return (cache[key] as number) < threshold;
  }
  if ("lte" in condition) {
    const [key, threshold] = condition.lte;
    return (cache[key] as number) <= threshold;
  }
  if ("gt" in condition) {
    const [key, threshold] = condition.gt;
    return (cache[key] as number) > threshold;
  }
  if ("gte" in condition) {
    const [key, threshold] = condition.gte;
    return (cache[key] as number) >= threshold;
  }
  if ("and" in condition) {
    return condition.and.every((c) => evaluateCondition(c, cache));
  }
  if ("or" in condition) {
    return condition.or.some((c) => evaluateCondition(c, cache));
  }
  throw new Error(`Unknown condition: ${JSON.stringify(condition)}`);
}

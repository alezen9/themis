import type { Condition } from "./schemas";

function assertCacheKey(key: string, cache: Record<string, number | string>): void {
  if (cache[key] === undefined) {
    throw new Error(`Condition references undefined cache key: "${key}"`);
  }
}

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
    assertCacheKey(key, cache);
    return cache[key] === expected;
  }
  if ("lt" in condition) {
    const [key, threshold] = condition.lt;
    assertCacheKey(key, cache);
    return (cache[key] as number) < threshold;
  }
  if ("lte" in condition) {
    const [key, threshold] = condition.lte;
    assertCacheKey(key, cache);
    return (cache[key] as number) <= threshold;
  }
  if ("gt" in condition) {
    const [key, threshold] = condition.gt;
    assertCacheKey(key, cache);
    return (cache[key] as number) > threshold;
  }
  if ("gte" in condition) {
    const [key, threshold] = condition.gte;
    assertCacheKey(key, cache);
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

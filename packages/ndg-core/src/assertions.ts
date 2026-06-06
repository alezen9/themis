import type { NDGValue } from "./types";

export function assertDefined<T>(
  value: T | undefined,
  message: string,
): asserts value is T {
  if (value === undefined) throw new Error(message);
}

export function assertUndefined<T>(
  value: T | undefined,
  message: string,
): asserts value is undefined {
  if (value !== undefined) throw new Error(message);
}

export function assertNumber(
  value: unknown | undefined,
  message: string,
): asserts value is number {
  if (typeof value !== "number") throw new Error(message);
}

export function assertNDGValue(
  value: unknown,
  key: string,
): asserts value is NDGValue {
  if (
    typeof value !== "number" &&
    typeof value !== "string" &&
    typeof value !== "boolean"
  ) {
    throw new Error(
      `Value for "${key}" must be a number, string, or boolean, got ${typeof value}`,
    );
  }
}

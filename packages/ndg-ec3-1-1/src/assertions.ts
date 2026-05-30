import { Ec3VerificationError } from "./errors";

export const assertFinite = (
  value: number,
  message: string,
  details?: Record<string, unknown>,
) => {
  if (!Number.isFinite(value))
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message,
      details,
    });
  return value;
};

export const assertPositive = (
  value: number,
  message: string,
  details?: Record<string, unknown>,
) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message,
      details,
    });
  return value;
};

export const assertNonNegative = (
  value: number,
  message: string,
  details?: Record<string, unknown>,
) => {
  if (!Number.isFinite(value) || value < 0)
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message,
      details,
    });
  return value;
};

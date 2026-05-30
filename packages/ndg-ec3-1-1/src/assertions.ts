import { Ec3VerificationError } from "./errors";

export const assertFinite = (value: number, message: string) => {
  if (!Number.isFinite(value))
    throw new Ec3VerificationError({ type: "invalid-input-domain", message });
  return value;
};

export const assertPositive = (value: number, message: string) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new Ec3VerificationError({ type: "invalid-input-domain", message });
  return value;
};

export const assertNonNegative = (value: number, message: string) => {
  if (!Number.isFinite(value) || value < 0)
    throw new Ec3VerificationError({ type: "invalid-input-domain", message });
  return value;
};

export const assertApplicable = (condition: boolean, message: string) => {
  if (!condition)
    throw new Ec3VerificationError({
      type: "not-applicable-load-case",
      message,
    });
};

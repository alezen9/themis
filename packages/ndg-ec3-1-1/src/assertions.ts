import { Ec3VerificationError } from "./errors";

export const assertFinite = (value: number, message?: string) => {
  if (Number.isFinite(value)) return value;
  throw new Ec3VerificationError({
    type: "invalid-input-domain",
    message: message ?? "Number has to be a valid finite value",
  });
};

export const assertPositive = (value: number, message: string) => {
  assertFinite(value);
  if (value >= 0) return value;
  throw new Ec3VerificationError({ type: "invalid-input-domain", message });
};

export const assertNegative = (value: number, message: string) => {
  assertFinite(value);
  if (value < 0) return value;
  throw new Ec3VerificationError({ type: "invalid-input-domain", message });
};

export const assertApplicable = (condition: boolean, message: string) => {
  if (condition) return true;
  throw new Ec3VerificationError({ type: "not-applicable", message });
};

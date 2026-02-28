export type Ec3FailureType =
  | "NOT_APPLICABLE_SECTION_SHAPE"
  | "NOT_APPLICABLE_SECTION_CLASS"
  | "NOT_APPLICABLE_LOAD_CASE"
  | "INVALID_INPUT_DOMAIN"
  | "MISSING_INPUT"
  | "EVALUATION_ERROR";

export type Ec3VerificationFailure = {
  type: Ec3FailureType | string;
  message?: string;
  details?: Record<string, unknown>;
};

export class Ec3VerificationError extends Error {
  readonly type: Ec3VerificationFailure["type"];
  readonly details?: Record<string, unknown>;

  constructor(failure: Ec3VerificationFailure) {
    super(failure.message ?? String(failure.type));
    this.name = "Ec3VerificationError";
    this.type = failure.type;
    this.details = failure.details;
  }
}

export const throwEc3VerificationError = (failure: Ec3VerificationFailure): never => {
  throw new Ec3VerificationError(failure);
};

export const throwInvalidInput = (
  message: string,
  details?: Record<string, unknown>,
): never =>
  throwEc3VerificationError({
    type: "INVALID_INPUT_DOMAIN",
    message,
    details,
  });

export const throwNotApplicableSectionClass = (
  message: string,
  details?: Record<string, unknown>,
): never =>
  throwEc3VerificationError({
    type: "NOT_APPLICABLE_SECTION_CLASS",
    message,
    details,
  });

export const throwNotApplicableSectionShape = (
  message: string,
  details?: Record<string, unknown>,
): never =>
  throwEc3VerificationError({
    type: "NOT_APPLICABLE_SECTION_SHAPE",
    message,
    details,
  });

export const throwNotApplicableLoadCase = (
  message: string,
  details?: Record<string, unknown>,
): never =>
  throwEc3VerificationError({
    type: "NOT_APPLICABLE_LOAD_CASE",
    message,
    details,
  });

const classifyMessage = (message: string): Ec3FailureType => {
  if (message.includes("implemented only")) return "NOT_APPLICABLE_SECTION_SHAPE";
  if (message.includes("class 4") || message.includes("section class")) return "NOT_APPLICABLE_SECTION_CLASS";
  if (message.includes("Missing input")) return "MISSING_INPUT";
  if (
    message.includes("must be > 0")
    || message.includes("invalid")
    || message.includes("division by zero")
  ) {
    return "INVALID_INPUT_DOMAIN";
  }
  return "EVALUATION_ERROR";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const toEc3VerificationFailure = (error: unknown): Ec3VerificationFailure => {
  if (error instanceof Ec3VerificationError) {
    return {
      type: error.type,
      message: error.message,
      details: error.details,
    };
  }

  if (isRecord(error) && typeof error.type === "string") {
    return {
      type: error.type,
      message: typeof error.message === "string" ? error.message : String(error.type),
      details: isRecord(error.details) ? error.details : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      type: classifyMessage(error.message),
      message: error.message,
    };
  }

  return {
    type: "EVALUATION_ERROR",
    message: String(error),
  };
};

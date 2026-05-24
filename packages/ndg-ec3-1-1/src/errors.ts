type Ec3FailureType =
  | "not-applicable-section-shape"
  | "not-applicable-section-class"
  | "not-applicable-load-case"
  | "invalid-input-domain"
  | "missing-input"
  | "evaluation-error";

type Ec3VerificationFailure = {
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

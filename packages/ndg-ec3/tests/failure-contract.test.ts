import { describe, expect, it } from "vitest";
import {
  Ec3VerificationError,
  toEc3VerificationFailure,
  throwEc3VerificationError,
} from "../src/errors";

describe("failure contract", () => {
  it("preserves structured EC3 verification failures", () => {
    try {
      throwEc3VerificationError({
        type: "NOT_APPLICABLE_SECTION_SHAPE",
        message: "shape not supported",
        details: { section_shape: "RHS" },
      });
    } catch (error) {
      const failure = toEc3VerificationFailure(error);
      expect(failure.type).toBe("NOT_APPLICABLE_SECTION_SHAPE");
      expect(failure.message).toBe("shape not supported");
      expect(failure.details).toEqual({ section_shape: "RHS" });
      expect(error).toBeInstanceOf(Ec3VerificationError);
    }
  });

  it("maps generic errors to deterministic failure types", () => {
    const failure = toEc3VerificationFailure(new Error("foo: value must be > 0"));
    expect(failure.type).toBe("INVALID_INPUT_DOMAIN");
    expect(failure.message).toContain("must be > 0");
  });

  it("preserves plain thrown failure objects", () => {
    const failure = toEc3VerificationFailure({
      type: "NOT_APPLICABLE_SECTION_SHAPE",
      message: "out of scope",
      details: { section_shape: "RHS" },
    });
    expect(failure.type).toBe("NOT_APPLICABLE_SECTION_SHAPE");
    expect(failure.message).toBe("out of scope");
    expect(failure.details).toEqual({ section_shape: "RHS" });
  });
});

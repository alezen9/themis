import { describe, expect, it } from "vitest";
import { decodeEc3DebugSession, encodeEc3DebugSession } from "./ec3-debug-session";
import { createDefaultEc3WorkbenchSessionState } from "./use-ec3-workbench";

describe("ec3 debug session", () => {
  it("round-trips the EC3 workbench session payload", () => {
    const session = createDefaultEc3WorkbenchSessionState();
    session.shape = "RHS";
    session.selectedSectionId = "custom";
    session.customFabricationType = "welded";
    session.editableInputs.N_Ed = -420_000;
    session.annex.beta_LT = 0.75;

    const encoded = encodeEc3DebugSession(session);
    const decoded = decodeEc3DebugSession(encoded);

    expect(decoded).toEqual(session);
  });

  it("returns null for malformed payloads", () => {
    expect(decodeEc3DebugSession("not-a-valid-session")).toBeNull();
  });
});

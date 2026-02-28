import { describe, expect, it } from "vitest";
import { ec3Verifications } from "../src/verifications";

const literalFormulaRef = /^\(\d+\.\d+\)$/;

describe("traceability contract (C1/C2)", () => {
  it("keeps formulaRef only on formula nodes", () => {
    for (const def of ec3Verifications) {
      for (const node of def.nodes) {
        if (node.type === "formula") {
          expect(node.meta.formulaRef).toMatch(literalFormulaRef);
        } else {
          expect(node.meta?.formulaRef, `${def.id}:${node.key}`).toBeUndefined();
        }
      }
    }
  });

  it("uses verificationRef only on check nodes", () => {
    for (const def of ec3Verifications) {
      for (const node of def.nodes) {
        if (node.type === "check") continue;
        expect(node.meta?.verificationRef, `${def.id}:${node.key}`).toBeUndefined();
      }
    }
  });
});

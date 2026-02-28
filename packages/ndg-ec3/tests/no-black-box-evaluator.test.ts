import { describe, expect, it } from "vitest";
import { ec3Verifications } from "../src/verifications";

const bannedCalls = [
  "computeChi",
  "computeChiLT",
  "computeNcrT",
  "computeMcrSn003b",
  "computeKyy",
  "computeKzz",
  "computeKyzMethod2",
  "computeKzyMethod2",
  "computeKyyMethod1",
  "computeKzzMethod1",
  "computeKyzMethod1",
  "computeKzyMethod1",
  "computeMethod1Class12CFactors",
  "computeMethod1Class12KFactors",
  "getCmMethod1",
  "getCmMethod2",
  "resolveCmMethod1",
];

describe("no black-box evaluator contract", () => {
  it("does not call banned compositional helpers from verification evaluators", () => {
    for (const verification of ec3Verifications) {
      for (const [key, evaluator] of Object.entries(verification.evaluate)) {
        const src = evaluator.toString();
        for (const banned of bannedCalls) {
          expect(src, `${verification.nodes.at(-1)?.key}:${key} uses ${banned}`).not.toContain(`${banned}(`);
        }
      }
    }
  });
});


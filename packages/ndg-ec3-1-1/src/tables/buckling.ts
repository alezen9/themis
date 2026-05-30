import { Ec3VerificationError } from "../errors";

const imperfectionFactors = new Map<string, number>();
imperfectionFactors.set("a0", 0.13);
imperfectionFactors.set("a", 0.21);
imperfectionFactors.set("b", 0.34);
imperfectionFactors.set("c", 0.49);
imperfectionFactors.set("d", 0.76);

export const getImperfectionFactor = (bucklingCurve: string) => {
  if (!imperfectionFactors.has(bucklingCurve))
    throw new Ec3VerificationError({
      type: "invalid-input-domain",
      message: `Unknown buckling curve: "${bucklingCurve}"`,
    });

  return imperfectionFactors.get(bucklingCurve);
};

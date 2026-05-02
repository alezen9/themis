import type { Ec3FormValues } from "../../Form/schema";

type ComputedSectionClass = 1 | 2 | 3 | 4;

type ChsSectionClassificationInput = Pick<
  Extract<Ec3FormValues, { shape: "CHS" }>,
  "shape" | "d" | "t"
> &
  Partial<Pick<Ec3FormValues, "N_Ed" | "M_y_Ed" | "M_z_Ed">> & { fy: number };

export const computeChsSectionClassification = (
  input: ChsSectionClassificationInput,
): ComputedSectionClass => {
  const { fy, d, t } = input;

  const epsilonSquared = 235 / fy;
  const shellSlenderness = d / t;
  if (!Number.isFinite(shellSlenderness) || shellSlenderness <= 0) return 4;

  const class1Limit = 50 * epsilonSquared;
  if (shellSlenderness <= class1Limit) return 1;

  const class2Limit = 70 * epsilonSquared;
  if (shellSlenderness <= class2Limit) return 2;

  const class3Limit = 90 * epsilonSquared;
  if (shellSlenderness <= class3Limit) return 3;

  return 4;
};

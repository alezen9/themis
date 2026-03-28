import type {
  Ec3InputValues,
  ResolvedSectionClass,
  SectionInput,
} from "../inputsSchema";

type ChsSectionClassificationInput = Pick<
  Extract<SectionInput, { shape: "CHS" }>,
  "shape" | "d" | "t"
> &
  Pick<Ec3InputValues, "fy"> & {
    N_Ed?: Ec3InputValues["N_Ed"];
    M_y_Ed?: Ec3InputValues["M_y_Ed"];
    M_z_Ed?: Ec3InputValues["M_z_Ed"];
  };

export const computeChsSectionClassification = (
  input: ChsSectionClassificationInput,
): ResolvedSectionClass => {
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

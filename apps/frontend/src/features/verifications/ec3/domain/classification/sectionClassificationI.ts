import type {
  Ec3InputValues,
  FabricationType,
  ResolvedSectionClass,
  SectionInput,
} from "../inputsSchema";
import type { SectionProperties } from "../geometry/sectionProperties";
import { resolveInternalPartClass } from "./internalPartClassification";

type ISectionClassificationInput = Pick<
  Extract<SectionInput, { shape: "I" }>,
  "shape" | "h" | "b" | "tw" | "tf" | "r"
> & { fabricationType?: FabricationType } & Pick<
    Ec3InputValues,
    "fy" | "N_Ed" | "M_y_Ed" | "M_z_Ed"
  >;

const maxSectionClass = (
  ...classes: ResolvedSectionClass[]
): ResolvedSectionClass => Math.max(...classes) as ResolvedSectionClass;

const resolveRolledOutstandClass = (
  flangeSlenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
): ResolvedSectionClass => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;
  if (flangeSlenderness <= 9 * epsilon) return 1;
  if (flangeSlenderness <= 10 * epsilon) return 2;
  if (flangeSlenderness <= 14 * epsilon) return 3;
  return 4;
};

const computeWeldedOutstandKSigma = (webStress: number, tipStress: number) => {
  const isTipInCompression = tipStress > 0 && tipStress >= webStress;
  if (isTipInCompression) {
    const stressRatio = webStress / tipStress;
    if (stressRatio >= 1) return 0.43;
    if (stressRatio > 0) return 0.578 / (stressRatio + 0.34);
    if (stressRatio > -1)
      return 1.7 - 5 * stressRatio + 17.1 * stressRatio ** 2;
    return 23.8;
  }

  if (webStress <= 0) return 0.43;

  const stressRatio = tipStress / webStress;
  const clampedStressRatio = Math.max(-3, Math.min(1, stressRatio));
  return 0.57 - 0.21 * clampedStressRatio + 0.07 * clampedStressRatio ** 2;
};

const resolveWeldedOutstandClass = (
  flangeSlenderness: number,
  epsilon: number,
  webStress: number,
  tipStress: number,
): ResolvedSectionClass => {
  const maxCompressionStress = Math.max(webStress, tipStress);
  if (maxCompressionStress <= 0) return 1;

  const minCompressionStress = Math.min(webStress, tipStress);
  const alpha =
    minCompressionStress >= 0
      ? 1
      : maxCompressionStress / (maxCompressionStress - minCompressionStress);

  if (!Number.isFinite(alpha) || alpha <= 0) return 4;

  const class1Limit = (9 * epsilon) / alpha;
  if (flangeSlenderness <= class1Limit) return 1;

  const class2Limit = (10 * epsilon) / alpha;
  if (flangeSlenderness <= class2Limit) return 2;

  const kSigma = computeWeldedOutstandKSigma(webStress, tipStress);
  if (!Number.isFinite(kSigma) || kSigma <= 0) return 4;

  const class3Limit = 21 * epsilon * Math.sqrt(kSigma);
  if (flangeSlenderness <= class3Limit) return 3;
  return 4;
};

export const computeISectionClassification = (
  input: ISectionClassificationInput,
  sectionProperties: Pick<SectionProperties, "A" | "Wel_y" | "Wel_z">,
): ResolvedSectionClass => {
  const { fabricationType, fy, h, b, tw, tf, r, N_Ed, M_y_Ed, M_z_Ed } = input;
  const { A, Wel_y, Wel_z } = sectionProperties;

  const epsilon = Math.sqrt(235 / fy);
  const flangeOutstand = Math.max((b - tw - 2 * r) / 2, 0);
  const flangeSlenderness = flangeOutstand / tf;

  const webHeight = Math.max(h - 2 * tf - 2 * r, 0);
  const webSlenderness = webHeight / tw;

  const compressionFromAxialForce = A > 0 ? -N_Ed / A : 0;
  const compressionFromBendingY = Wel_y > 0 ? -M_y_Ed / Wel_y : 0;
  const tipCompressionFromBendingZ = Wel_z > 0 ? -M_z_Ed / Wel_z : 0;
  const tipDistanceFromCentroid = b / 2;
  const webDistanceFromCentroid = tw / 2 + r;
  const webToTipDistanceRatio =
    tipDistanceFromCentroid > 0
      ? Math.min(webDistanceFromCentroid / tipDistanceFromCentroid, 1)
      : 0;
  const webCompressionFromBendingZ =
    tipCompressionFromBendingZ * webToTipDistanceRatio;

  const topStress = compressionFromAxialForce + compressionFromBendingY;
  const bottomStress = compressionFromAxialForce - compressionFromBendingY;
  const webClass = resolveInternalPartClass(
    webSlenderness,
    epsilon,
    fy,
    topStress,
    bottomStress,
  );

  const resolveOutstandClass =
    fabricationType === "welded"
      ? resolveWeldedOutstandClass
      : resolveRolledOutstandClass;

  const flangeClass = maxSectionClass(
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      topStress - webCompressionFromBendingZ,
      topStress - tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      topStress + webCompressionFromBendingZ,
      topStress + tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      bottomStress - webCompressionFromBendingZ,
      bottomStress - tipCompressionFromBendingZ,
    ),
    resolveOutstandClass(
      flangeSlenderness,
      epsilon,
      bottomStress + webCompressionFromBendingZ,
      bottomStress + tipCompressionFromBendingZ,
    ),
  );

  return maxSectionClass(webClass, flangeClass);
};

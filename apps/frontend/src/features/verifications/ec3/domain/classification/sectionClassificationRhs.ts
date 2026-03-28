import type {
  Ec3InputValues,
  ResolvedSectionClass,
  SectionInput,
} from "../inputsSchema";
import type { SectionProperties } from "../geometry/sectionProperties";
import { resolveInternalPartClass } from "./internalPartClassification";

type RhsSectionClassificationInput = Pick<
  Extract<SectionInput, { shape: "RHS" }>,
  "shape" | "h" | "b" | "tw" | "ri"
> &
  Pick<Ec3InputValues, "fy" | "N_Ed" | "M_y_Ed" | "M_z_Ed">;

const maxSectionClass = (
  ...classes: ResolvedSectionClass[]
): ResolvedSectionClass => Math.max(...classes) as ResolvedSectionClass;

export const computeRhsSectionClassification = (
  input: RhsSectionClassificationInput,
  sectionProperties: Pick<SectionProperties, "A" | "Wel_y" | "Wel_z">,
): ResolvedSectionClass => {
  const { fy, h, b, tw, ri, N_Ed, M_y_Ed, M_z_Ed } = input;
  const { A, Wel_y, Wel_z } = sectionProperties;

  const epsilon = Math.sqrt(235 / fy);
  const wallDepth = Math.max(h - 2 * (ri + tw), 0);
  const wallWidth = Math.max(b - 2 * (ri + tw), 0);
  const depthSlenderness = wallDepth / tw;
  const widthSlenderness = wallWidth / tw;

  const compressionFromAxialForce = A > 0 ? -N_Ed / A : 0;
  const compressionFromBendingY = Wel_y > 0 ? -M_y_Ed / Wel_y : 0;
  const compressionFromBendingZ = Wel_z > 0 ? -M_z_Ed / Wel_z : 0;

  const topLeftStress =
    compressionFromAxialForce +
    compressionFromBendingY -
    compressionFromBendingZ;
  const topRightStress =
    compressionFromAxialForce +
    compressionFromBendingY +
    compressionFromBendingZ;
  const bottomLeftStress =
    compressionFromAxialForce -
    compressionFromBendingY -
    compressionFromBendingZ;
  const bottomRightStress =
    compressionFromAxialForce -
    compressionFromBendingY +
    compressionFromBendingZ;

  return maxSectionClass(
    resolveInternalPartClass(
      widthSlenderness,
      epsilon,
      fy,
      topLeftStress,
      topRightStress,
    ),
    resolveInternalPartClass(
      widthSlenderness,
      epsilon,
      fy,
      bottomLeftStress,
      bottomRightStress,
    ),
    resolveInternalPartClass(
      depthSlenderness,
      epsilon,
      fy,
      topLeftStress,
      bottomLeftStress,
    ),
    resolveInternalPartClass(
      depthSlenderness,
      epsilon,
      fy,
      topRightStress,
      bottomRightStress,
    ),
  );
};

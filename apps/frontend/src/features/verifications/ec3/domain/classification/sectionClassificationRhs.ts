import type { Ec3FormValues } from "../formSchema";
import { computeInternalPartClass } from "./internalPartClassification";

type ComputedSectionClass = 1 | 2 | 3 | 4;

type RhsSectionClassificationInput = Pick<
  Extract<Ec3FormValues, { shape: "RHS" }>,
  "shape" | "h" | "b" | "tw" | "ri"
> &
  Pick<Ec3FormValues, "N_Ed" | "M_y_Ed" | "M_z_Ed"> & { fy: number };

const computeMaxSectionClass = (
  ...classes: ComputedSectionClass[]
): ComputedSectionClass => Math.max(...classes) as ComputedSectionClass;

export const computeRhsSectionClassification = (
  input: RhsSectionClassificationInput,
  sectionProperties: { A: number; Wel_y: number; Wel_z: number },
): ComputedSectionClass => {
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

  return computeMaxSectionClass(
    computeInternalPartClass(
      widthSlenderness,
      epsilon,
      fy,
      topLeftStress,
      topRightStress,
    ),
    computeInternalPartClass(
      widthSlenderness,
      epsilon,
      fy,
      bottomLeftStress,
      bottomRightStress,
    ),
    computeInternalPartClass(
      depthSlenderness,
      epsilon,
      fy,
      topLeftStress,
      bottomLeftStress,
    ),
    computeInternalPartClass(
      depthSlenderness,
      epsilon,
      fy,
      topRightStress,
      bottomRightStress,
    ),
  );
};

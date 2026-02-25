import type { VerificationDefinition, InferableNode } from "@ndg/ndg-core";

// §6.2 basic (checks 1–6)
export { ulsTension } from "./uls-tension";
export { ulsCompression } from "./uls-compression";
export { ulsBendingY } from "./uls-bending-y";
export { ulsBendingZ } from "./uls-bending-z";
export { ulsShearZ } from "./uls-shear-z";
export { ulsShearY } from "./uls-shear-y";

// §6.2 combined (checks 7–14)
export { ulsBendingYShear } from "./uls-bending-y-shear";
export { ulsBendingZShear } from "./uls-bending-z-shear";
export { ulsBendingYAxial } from "./uls-bending-y-axial";
export { ulsBendingZAxial } from "./uls-bending-z-axial";
export { ulsBiaxialAxial } from "./uls-biaxial-axial";
export { ulsBendingYAxialShear } from "./uls-bending-y-axial-shear";
export { ulsBendingZAxialShear } from "./uls-bending-z-axial-shear";
export { ulsBiaxialAxialShear } from "./uls-biaxial-axial-shear";

// §6.3 member buckling (checks 15–18)
export { ulsBucklingY } from "./uls-buckling-y";
export { ulsBucklingZ } from "./uls-buckling-z";
export { ulsTorsionalBuckling } from "./uls-torsional-buckling";
export { ulsLtb } from "./uls-ltb";

// §6.3.3 beam-column (checks 19–22)
export { ulsBeamColumn61M1 } from "./uls-beam-column-61-m1";
export { ulsBeamColumn62M1 } from "./uls-beam-column-62-m1";
export { ulsBeamColumn61M2 } from "./uls-beam-column-61-m2";
export { ulsBeamColumn62M2 } from "./uls-beam-column-62-m2";

import { ulsTension } from "./uls-tension";
import { ulsCompression } from "./uls-compression";
import { ulsBendingY } from "./uls-bending-y";
import { ulsBendingZ } from "./uls-bending-z";
import { ulsShearZ } from "./uls-shear-z";
import { ulsShearY } from "./uls-shear-y";
import { ulsBendingYShear } from "./uls-bending-y-shear";
import { ulsBendingZShear } from "./uls-bending-z-shear";
import { ulsBendingYAxial } from "./uls-bending-y-axial";
import { ulsBendingZAxial } from "./uls-bending-z-axial";
import { ulsBiaxialAxial } from "./uls-biaxial-axial";
import { ulsBendingYAxialShear } from "./uls-bending-y-axial-shear";
import { ulsBendingZAxialShear } from "./uls-bending-z-axial-shear";
import { ulsBiaxialAxialShear } from "./uls-biaxial-axial-shear";
import { ulsBucklingY } from "./uls-buckling-y";
import { ulsBucklingZ } from "./uls-buckling-z";
import { ulsTorsionalBuckling } from "./uls-torsional-buckling";
import { ulsLtb } from "./uls-ltb";
import { ulsBeamColumn61M1 } from "./uls-beam-column-61-m1";
import { ulsBeamColumn62M1 } from "./uls-beam-column-62-m1";
import { ulsBeamColumn61M2 } from "./uls-beam-column-61-m2";
import { ulsBeamColumn62M2 } from "./uls-beam-column-62-m2";

/** §6.2 basic cross-section verifications (checks 1–6). */
export const basicVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsTension, ulsCompression, ulsBendingY, ulsBendingZ, ulsShearZ, ulsShearY,
];

/** §6.2 combined verifications (checks 7–14). */
export const combinedVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsBendingYShear, ulsBendingZShear,
  ulsBendingYAxial, ulsBendingZAxial, ulsBiaxialAxial,
  ulsBendingYAxialShear, ulsBendingZAxialShear, ulsBiaxialAxialShear,
];

/** §6.3 member buckling verifications (checks 15–18). */
export const bucklingVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsBucklingY, ulsBucklingZ, ulsTorsionalBuckling, ulsLtb,
];

/** §6.3.3 beam-column interaction verifications (checks 19–22). */
export const beamColumnVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsBeamColumn61M1, ulsBeamColumn62M1, ulsBeamColumn61M2, ulsBeamColumn62M2,
];

/** All 22 EC3 verifications. */
export const ec3Verifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ...basicVerifications,
  ...combinedVerifications,
  ...bucklingVerifications,
  ...beamColumnVerifications,
];

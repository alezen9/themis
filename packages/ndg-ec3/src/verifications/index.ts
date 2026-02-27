import type { VerificationDefinition, InferableNode } from "@ndg/ndg-core";

// §6.2 basic (checks 1--6)
export { ulsTension } from "./tension";
export { ulsCompression } from "./compression";
export { ulsBendingY } from "./bending-y";
export { ulsBendingZ } from "./bending-z";
export { ulsShearZ } from "./shear-z";
export { ulsShearY } from "./shear-y";

// §6.2 combined (checks 7--14)
export { ulsBendingYShear } from "./bending-y-shear";
export { ulsBendingZShear } from "./bending-z-shear";
export { ulsBendingYAxial } from "./bending-y-axial";
export { ulsBendingZAxial } from "./bending-z-axial";
export { ulsBiaxialAxial } from "./biaxial-axial";
export { ulsBendingYAxialShear } from "./bending-y-axial-shear";
export { ulsBendingZAxialShear } from "./bending-z-axial-shear";
export { ulsBiaxialAxialShear } from "./biaxial-axial-shear";

// §6.3 member buckling (checks 15--18)
export { ulsBucklingY } from "./buckling-y";
export { ulsBucklingZ } from "./buckling-z";
export { ulsTorsionalBuckling } from "./torsional-buckling";
export { ulsLtb } from "./ltb";

// §6.3.3 beam-column (checks 19--22)
export { ulsBeamColumn61M1 } from "./beam-column-61-m1";
export { ulsBeamColumn62M1 } from "./beam-column-62-m1";
export { ulsBeamColumn61M2 } from "./beam-column-61-m2";
export { ulsBeamColumn62M2 } from "./beam-column-62-m2";

import { ulsTension } from "./tension";
import { ulsCompression } from "./compression";
import { ulsBendingY } from "./bending-y";
import { ulsBendingZ } from "./bending-z";
import { ulsShearZ } from "./shear-z";
import { ulsShearY } from "./shear-y";
import { ulsBendingYShear } from "./bending-y-shear";
import { ulsBendingZShear } from "./bending-z-shear";
import { ulsBendingYAxial } from "./bending-y-axial";
import { ulsBendingZAxial } from "./bending-z-axial";
import { ulsBiaxialAxial } from "./biaxial-axial";
import { ulsBendingYAxialShear } from "./bending-y-axial-shear";
import { ulsBendingZAxialShear } from "./bending-z-axial-shear";
import { ulsBiaxialAxialShear } from "./biaxial-axial-shear";
import { ulsBucklingY } from "./buckling-y";
import { ulsBucklingZ } from "./buckling-z";
import { ulsTorsionalBuckling } from "./torsional-buckling";
import { ulsLtb } from "./ltb";
import { ulsBeamColumn61M1 } from "./beam-column-61-m1";
import { ulsBeamColumn62M1 } from "./beam-column-62-m1";
import { ulsBeamColumn61M2 } from "./beam-column-61-m2";
import { ulsBeamColumn62M2 } from "./beam-column-62-m2";

/** §6.2 basic cross-section verifications (checks 1--6). */
export const basicVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsTension, ulsCompression, ulsBendingY, ulsBendingZ, ulsShearZ, ulsShearY,
];

/** §6.2 combined verifications (checks 7--14). */
export const combinedVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsBendingYShear, ulsBendingZShear,
  ulsBendingYAxial, ulsBendingZAxial, ulsBiaxialAxial,
  ulsBendingYAxialShear, ulsBendingZAxialShear, ulsBiaxialAxialShear,
];

/** §6.3 member buckling verifications (checks 15--18). */
export const bucklingVerifications: VerificationDefinition<readonly InferableNode[]>[] = [
  ulsBucklingY, ulsBucklingZ, ulsTorsionalBuckling, ulsLtb,
];

/** §6.3.3 beam-column interaction verifications (checks 19--22). */
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

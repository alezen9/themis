import { evaluate, VerificationSchema } from "@ndg/ndg-core";
import type {
  EvaluationContext,
  EvaluationResult,
  InferCache,
  VerificationDefinition,
} from "@ndg/ndg-core";
import v01_ulsTension from "./verifications/01_ulsTension/ulsTension";
import v02_ulsCompression from "./verifications/02_ulsCompression/ulsCompression";
import v03_ulsBendingY from "./verifications/03_ulsBendingY/ulsBendingY";
import v04_ulsBendingZ from "./verifications/04_ulsBendingZ/ulsBendingZ";
import v05_ulsShearZ from "./verifications/05_ulsShearZ/ulsShearZ";
import v06_ulsShearY from "./verifications/06_ulsShearY/ulsShearY";
import v07_ulsBendingYShear from "./verifications/07_ulsBendingYShear/ulsBendingYShear";
import v08_ulsBendingZShear from "./verifications/08_ulsBendingZShear/ulsBendingZShear";
import v09_ulsBendingYAxial from "./verifications/09_ulsBendingYAxial/ulsBendingYAxial";
import v10_ulsBendingZAxial from "./verifications/10_ulsBendingZAxial/ulsBendingZAxial";
import v11_ulsBiaxialAxial from "./verifications/11_ulsBiaxialAxial/ulsBiaxialAxial";
import v12_ulsBendingYAxialShear from "./verifications/12_ulsBendingYAxialShear/ulsBendingYAxialShear";
import v13_ulsBendingZAxialShear from "./verifications/13_ulsBendingZAxialShear/ulsBendingZAxialShear";
import v14_ulsBiaxialAxialShear from "./verifications/14_ulsBiaxialAxialShear/ulsBiaxialAxialShear";
import v15_ulsBucklingY from "./verifications/15_ulsBucklingY/ulsBucklingY";
import v16_ulsBucklingZ from "./verifications/16_ulsBucklingZ/ulsBucklingZ";
import v17_ulsTorsionalBuckling from "./verifications/17_ulsTorsionalBuckling/ulsTorsionalBuckling";
import v18_ulsLtb from "./verifications/18_ulsLtb/ulsLtb";
import v19_ulsBeamColumn61M1 from "./verifications/19_ulsBeamColumn61M1/ulsBeamColumn61M1";
import v20_ulsBeamColumn62M1 from "./verifications/20_ulsBeamColumn62M1/ulsBeamColumn62M1";
import v21_ulsBeamColumn61M2 from "./verifications/21_ulsBeamColumn61M2/ulsBeamColumn61M2";
import v22_ulsBeamColumn62M2 from "./verifications/22_ulsBeamColumn62M2/ulsBeamColumn62M2";
import { eurocodeAnnex } from "./annexes/eurocode";
import { Ec3VerificationError } from "./errors";

export { VerificationSchema };
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
// Deprecated transitional exports; scheduled for removal after table logic is embedded in check nodes.
export { getImperfectionFactor } from "./tables/ec3-table-6.1";
export { getBucklingCurves } from "./tables/ec3-table-6.2";

const verifications = [
  v01_ulsTension,
  v02_ulsCompression,
  v03_ulsBendingY,
  v04_ulsBendingZ,
  v05_ulsShearZ,
  v06_ulsShearY,
  v07_ulsBendingYShear,
  v08_ulsBendingZShear,
  v09_ulsBendingYAxial,
  v10_ulsBendingZAxial,
  v11_ulsBiaxialAxial,
  v12_ulsBendingYAxialShear,
  v13_ulsBendingZAxialShear,
  v14_ulsBiaxialAxialShear,
  v15_ulsBucklingY,
  v16_ulsBucklingZ,
  v17_ulsTorsionalBuckling,
  v18_ulsLtb,
  v19_ulsBeamColumn61M1,
  v20_ulsBeamColumn62M1,
  v21_ulsBeamColumn61M2,
  v22_ulsBeamColumn62M2,
] as const;

type Nodes = (typeof verifications)[number]["nodes"];
type UserInputKeys = Extract<Nodes[number], { type: "user-input" }>["key"];
export type Ec3Inputs = Pick<InferCache<Nodes>, UserInputKeys>;

type VerificationPayload =
  | { data: EvaluationResult; error?: undefined }
  | { data?: undefined; error: Ec3VerificationError };

export type VerificationRow = {
  checkId: number;
  name: string;
  payload: VerificationPayload;
};

const toVerificationRow = <
  TNodes extends readonly import("@ndg/ndg-core").Node[],
>(
  checkId: number,
  verification: VerificationDefinition<TNodes>,
  context: EvaluationContext,
): VerificationRow => {
  const checkNode = [...verification.nodes]
    .reverse()
    .find((node) => node.type === "check");
  const name =
    checkNode?.name ?? verification.nodes[verification.nodes.length - 1].key;

  try {
    const data = evaluate(verification, context);
    return { checkId, name, payload: { data } };
  } catch (error) {
    const failure =
      error instanceof Ec3VerificationError
        ? error
        : new Ec3VerificationError({
            type: "evaluation-error",
            message: error instanceof Error ? error.message : String(error),
          });
    return { checkId, name, payload: { error: failure } };
  }
};

const verify = (
  inputs: Ec3Inputs,
  annex: EvaluationContext["annex"] = eurocodeAnnex,
): VerificationRow[] => {
  const context: EvaluationContext = { inputs, annex };

  if (verifications.length !== 22) {
    throw new Error(
      `Unexpected verification registry size: ${verifications.length}`,
    );
  }

  return [
    toVerificationRow(1, v01_ulsTension, context),
    toVerificationRow(2, v02_ulsCompression, context),
    toVerificationRow(3, v03_ulsBendingY, context),
    toVerificationRow(4, v04_ulsBendingZ, context),
    toVerificationRow(5, v05_ulsShearZ, context),
    toVerificationRow(6, v06_ulsShearY, context),
    toVerificationRow(7, v07_ulsBendingYShear, context),
    toVerificationRow(8, v08_ulsBendingZShear, context),
    toVerificationRow(9, v09_ulsBendingYAxial, context),
    toVerificationRow(10, v10_ulsBendingZAxial, context),
    toVerificationRow(11, v11_ulsBiaxialAxial, context),
    toVerificationRow(12, v12_ulsBendingYAxialShear, context),
    toVerificationRow(13, v13_ulsBendingZAxialShear, context),
    toVerificationRow(14, v14_ulsBiaxialAxialShear, context),
    toVerificationRow(15, v15_ulsBucklingY, context),
    toVerificationRow(16, v16_ulsBucklingZ, context),
    toVerificationRow(17, v17_ulsTorsionalBuckling, context),
    toVerificationRow(18, v18_ulsLtb, context),
    toVerificationRow(19, v19_ulsBeamColumn61M1, context),
    toVerificationRow(20, v20_ulsBeamColumn62M1, context),
    toVerificationRow(21, v21_ulsBeamColumn61M2, context),
    toVerificationRow(22, v22_ulsBeamColumn62M2, context),
  ];
};

export default verify;

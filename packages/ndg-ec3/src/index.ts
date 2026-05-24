import { evaluate } from "@ndg/ndg-core";
import type {
  Condition,
  ConditionOperand,
  EvaluationContext,
  EvaluationResult,
  InferCache,
  Node,
  TraceEntry,
  VerificationDefinition,
} from "@ndg/ndg-core";
import v01_tension from "./verifications/01_tension/tension";
import v02_compression from "./verifications/02_compression/compression";
import v03_ulsBendingY from "./verifications/03_ulsBendingY/ulsBendingY";
import v04_ulsBendingZ from "./verifications/04_ulsBendingZ/ulsBendingZ";
import v05_ulsShearZ from "./verifications/05_ulsShearZ/ulsShearZ";
import v06_ulsShearY from "./verifications/06_ulsShearY/ulsShearY";
import v07_ulsBendingYShear from "./verifications/07_ulsBendingYShear/ulsBendingYShear";
import v08_ulsBendingZShear from "./verifications/08_ulsBendingZShear/ulsBendingZShear";
import v09_ulsBendingYAxial from "./verifications/09_ulsBendingYAxial/ulsBendingYAxial";
import v10_ulsBendingZAxial from "./verifications/10_ulsBendingZAxial/ulsBendingZAxial";
import { Ec3VerificationError } from "./errors";
import {
  createEc3Annex,
  createEc3RuntimeInputs,
  type Ec3EvaluatorInputs,
  type Ec3VerifyPayload,
} from "./ec3-evaluator-inputs";

export { evaluateCondition } from "@ndg/ndg-core";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, EvaluationResult, Node, TraceEntry };
export type { Ec3VerifyPayload } from "./ec3-evaluator-inputs";

const verificationRegistry = [
  { checkId: 1, verification: v01_tension },
  { checkId: 2, verification: v02_compression },
  { checkId: 3, verification: v03_ulsBendingY },
  { checkId: 4, verification: v04_ulsBendingZ },
  { checkId: 5, verification: v05_ulsShearZ },
  { checkId: 6, verification: v06_ulsShearY },
  { checkId: 7, verification: v07_ulsBendingYShear },
  { checkId: 8, verification: v08_ulsBendingZShear },
  { checkId: 9, verification: v09_ulsBendingYAxial },
  { checkId: 10, verification: v10_ulsBendingZAxial },
];

type Nodes = (typeof verificationRegistry)[number]["verification"]["nodes"];
type UserInputKeys = Extract<Nodes[number], { type: "user-input" }>["key"];
export type Ec3NodeInputs = Pick<InferCache<Nodes>, UserInputKeys>;

type VerificationPayload =
  | { data: EvaluationResult; error?: undefined }
  | { data?: undefined; error: Ec3VerificationError };

export type VerificationRow = {
  checkId: number;
  name: string;
  payload: VerificationPayload;
};

const toVerificationRow = (
  checkId: number,
  verification: VerificationDefinition<readonly Node[], Ec3EvaluatorInputs>,
  context: EvaluationContext,
): VerificationRow => {
  const checkNode = verification.nodes.find((node) => node.type === "check");
  if (!checkNode)
    throw new Error(`Missing check node for verification n.${checkId}`);
  const { name } = checkNode;

  try {
    const data = evaluate(verification, context);
    return { checkId, name, payload: { data } };
  } catch (error) {
    let failure = new Ec3VerificationError({
      type: "evaluation-error",
      message: error instanceof Error ? error.message : String(error),
    });
    const isEc3VerificationError = error instanceof Ec3VerificationError;
    if (isEc3VerificationError) failure = error;
    return { checkId, name, payload: { error: failure } };
  }
};

const toTypedVerification = (verification: unknown) =>
  verification as VerificationDefinition<readonly Node[], Ec3EvaluatorInputs>;

const verify = (payload: Ec3VerifyPayload): VerificationRow[] => {
  const inputs = createEc3RuntimeInputs(payload);
  const annex = createEc3Annex(payload);
  const context: EvaluationContext = { inputs, annex };

  return verificationRegistry.map(({ checkId, verification }) => {
    const typedVerification = toTypedVerification(verification);
    return toVerificationRow(checkId, typedVerification, context);
  });
};

export default verify;

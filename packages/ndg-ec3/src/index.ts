import { evaluate, VerificationSchema } from "@ndg/ndg-core";
import type {
  CheckNode,
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
// import v03_ulsBendingY from "./verifications/03_ulsBendingY/ulsBendingY";
// import v04_ulsBendingZ from "./verifications/04_ulsBendingZ/ulsBendingZ";
// import v05_ulsShearZ from "./verifications/05_ulsShearZ/ulsShearZ";
// import v06_ulsShearY from "./verifications/06_ulsShearY/ulsShearY";
// import v07_ulsBendingYShear from "./verifications/07_ulsBendingYShear/ulsBendingYShear";
// import v08_ulsBendingZShear from "./verifications/08_ulsBendingZShear/ulsBendingZShear";
// import v09_ulsBendingYAxial from "./verifications/09_ulsBendingYAxial/ulsBendingYAxial";
// import v10_ulsBendingZAxial from "./verifications/10_ulsBendingZAxial/ulsBendingZAxial";
// import v11_ulsBiaxialAxial from "./verifications/11_ulsBiaxialAxial/ulsBiaxialAxial";
// import v12_ulsBendingYAxialShear from "./verifications/12_ulsBendingYAxialShear/ulsBendingYAxialShear";
// import v13_ulsBendingZAxialShear from "./verifications/13_ulsBendingZAxialShear/ulsBendingZAxialShear";
// import v14_ulsBiaxialAxialShear from "./verifications/14_ulsBiaxialAxialShear/ulsBiaxialAxialShear";
// import v15_ulsBucklingY from "./verifications/15_ulsBucklingY/ulsBucklingY";
// import v16_ulsBucklingZ from "./verifications/16_ulsBucklingZ/ulsBucklingZ";
// import v17_ulsTorsionalBuckling from "./verifications/17_ulsTorsionalBuckling/ulsTorsionalBuckling";
// import v18_ulsLtb from "./verifications/18_ulsLtb/ulsLtb";
// import v19_ulsBeamColumn61M1 from "./verifications/19_ulsBeamColumn61M1/ulsBeamColumn61M1";
// import v20_ulsBeamColumn62M1 from "./verifications/20_ulsBeamColumn62M1/ulsBeamColumn62M1";
// import v21_ulsBeamColumn61M2 from "./verifications/21_ulsBeamColumn61M2/ulsBeamColumn61M2";
// import v22_ulsBeamColumn62M2 from "./verifications/22_ulsBeamColumn62M2/ulsBeamColumn62M2";
import { Ec3VerificationError } from "./errors";
import {
  createEc3RuntimeInputs,
  type Ec3EvaluatorInputs,
  type Ec3VerifyPayload,
} from "./ec3-evaluator-inputs";

export { VerificationSchema };
export { evaluateCondition } from "@ndg/ndg-core";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, EvaluationResult, Node, TraceEntry };
export type {
  Ec3BucklingCurve,
  Ec3DerivedGeometricProperties,
  Ec3EvaluatorInputs,
  Ec3SectionClass,
  Ec3Shape,
  Ec3VerifyInputs,
  Ec3VerifyPayload,
} from "./ec3-evaluator-inputs";
// Deprecated transitional exports; scheduled for removal after table logic is embedded in check nodes.
export { getImperfectionFactor } from "./tables/buckling";

const verificationRegistry = [
  { checkId: 1, verification: v01_tension },
  { checkId: 2, verification: v02_compression },
  // { checkId: 3, verification: toRegistryDefinition(v03_ulsBendingY) },
  // { checkId: 4, verification: toRegistryDefinition(v04_ulsBendingZ) },
  // { checkId: 5, verification: toRegistryDefinition(v05_ulsShearZ) },
  // { checkId: 6, verification: toRegistryDefinition(v06_ulsShearY) },
  // { checkId: 7, verification: toRegistryDefinition(v07_ulsBendingYShear) },
  // { checkId: 8, verification: toRegistryDefinition(v08_ulsBendingZShear) },
  // { checkId: 9, verification: toRegistryDefinition(v09_ulsBendingYAxial) },
  // { checkId: 10, verification: toRegistryDefinition(v10_ulsBendingZAxial) },
  // { checkId: 11, verification: toRegistryDefinition(v11_ulsBiaxialAxial) },
  // {
  //   checkId: 12,
  //   verification: toRegistryDefinition(v12_ulsBendingYAxialShear),
  // },
  // {
  //   checkId: 13,
  //   verification: toRegistryDefinition(v13_ulsBendingZAxialShear),
  // },
  // { checkId: 14, verification: toRegistryDefinition(v14_ulsBiaxialAxialShear) },
  // { checkId: 15, verification: toRegistryDefinition(v15_ulsBucklingY) },
  // { checkId: 16, verification: toRegistryDefinition(v16_ulsBucklingZ) },
  // { checkId: 17, verification: toRegistryDefinition(v17_ulsTorsionalBuckling) },
  // { checkId: 18, verification: toRegistryDefinition(v18_ulsLtb) },
  // { checkId: 19, verification: toRegistryDefinition(v19_ulsBeamColumn61M1) },
  // { checkId: 20, verification: toRegistryDefinition(v20_ulsBeamColumn62M1) },
  // { checkId: 21, verification: toRegistryDefinition(v21_ulsBeamColumn61M2) },
  // { checkId: 22, verification: toRegistryDefinition(v22_ulsBeamColumn62M2) },
];

type Nodes = (typeof verificationRegistry)[number]["verification"]["nodes"];
type UserInputKeys = Extract<Nodes[number], { type: "user-input" }>["key"];
export type Ec3NodeInputs = Pick<InferCache<Nodes>, UserInputKeys>;

export type Ec3VerificationCatalogEntry = {
  checkId: number;
  name: string;
  check: {
    id: CheckNode["id"];
    key: CheckNode["key"];
    name: CheckNode["name"];
    verificationExpression: CheckNode["verificationExpression"];
    meta?: CheckNode["meta"];
  };
  nodes: readonly Node[];
};

type VerificationPayload =
  | { data: EvaluationResult; error?: undefined }
  | { data?: undefined; error: Ec3VerificationError };

export type VerificationRow = {
  checkId: number;
  name: string;
  payload: VerificationPayload;
};

const getCheckDetails = (verification: { nodes: readonly Node[] }) => {
  const checkNode = [...verification.nodes]
    .reverse()
    .find((node): node is CheckNode => node.type === "check");
  if (!checkNode) {
    throw new Error(
      `Verification "${verification.nodes[verification.nodes.length - 1]?.key ?? "unknown"}" is missing a check node`,
    );
  }

  return {
    name: checkNode.name,
    check: {
      id: checkNode.id,
      key: checkNode.key,
      name: checkNode.name,
      verificationExpression: checkNode.verificationExpression,
      meta: checkNode.meta,
    },
  };
};

export const ec3VerificationDefinitions: readonly Ec3VerificationCatalogEntry[] =
  verificationRegistry.map(({ checkId, verification }) => {
    const { name, check } = getCheckDetails(verification);
    return { checkId, name, check, nodes: verification.nodes };
  });

const toVerificationRow = <TNodes extends readonly Node[]>(
  checkId: number,
  verification: VerificationDefinition<TNodes, Ec3EvaluatorInputs>,
  context: EvaluationContext,
): VerificationRow => {
  const { name } = getCheckDetails(verification);

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

const toRunnableVerification = (
  verification: unknown,
): VerificationDefinition<readonly Node[], Ec3EvaluatorInputs> =>
  verification as VerificationDefinition<readonly Node[], Ec3EvaluatorInputs>;

const verify = (payload: Ec3VerifyPayload): VerificationRow[] => {
  const runtimeInputs = createEc3RuntimeInputs(payload);
  const annex: EvaluationContext["annex"] = {
    id: payload.annex_id,
    name: payload.annex_id,
    coefficients: {
      gamma_M0: payload.gamma_M0,
      gamma_M1: payload.gamma_M1,
      lambda_LT_0: payload.lambda_LT_0,
      beta_LT: payload.beta_LT,
      f_method:
        typeof payload.f_method === "number" ||
        typeof payload.f_method === "string"
          ? payload.f_method
          : "default-equation",
      interaction_factor_method: payload.interaction_factor_method,
      buckling_curves_LT_policy: payload.buckling_curves_LT_policy,
    },
  };
  const context: EvaluationContext = { inputs: runtimeInputs, annex };

  return verificationRegistry.map(({ checkId, verification }) =>
    toVerificationRow(checkId, toRunnableVerification(verification), context),
  );
};

export default verify;

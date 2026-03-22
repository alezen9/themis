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
export { evaluateCondition } from "@ndg/ndg-core";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, EvaluationResult, Node, TraceEntry };
// Deprecated transitional exports; scheduled for removal after table logic is embedded in check nodes.
export { getImperfectionFactor } from "./tables/ec3-table-6.1";
export { getBucklingCurves } from "./tables/ec3-table-6.2";

const toRegistryDefinition = (
  verification: unknown,
): VerificationDefinition<readonly Node[]> =>
  verification as VerificationDefinition<readonly Node[]>;

const verificationRegistry: readonly {
  checkId: number;
  verification: VerificationDefinition<readonly Node[]>;
}[] = [
  { checkId: 1, verification: toRegistryDefinition(v01_ulsTension) },
  { checkId: 2, verification: toRegistryDefinition(v02_ulsCompression) },
  { checkId: 3, verification: toRegistryDefinition(v03_ulsBendingY) },
  { checkId: 4, verification: toRegistryDefinition(v04_ulsBendingZ) },
  { checkId: 5, verification: toRegistryDefinition(v05_ulsShearZ) },
  { checkId: 6, verification: toRegistryDefinition(v06_ulsShearY) },
  { checkId: 7, verification: toRegistryDefinition(v07_ulsBendingYShear) },
  { checkId: 8, verification: toRegistryDefinition(v08_ulsBendingZShear) },
  { checkId: 9, verification: toRegistryDefinition(v09_ulsBendingYAxial) },
  { checkId: 10, verification: toRegistryDefinition(v10_ulsBendingZAxial) },
  { checkId: 11, verification: toRegistryDefinition(v11_ulsBiaxialAxial) },
  {
    checkId: 12,
    verification: toRegistryDefinition(v12_ulsBendingYAxialShear),
  },
  {
    checkId: 13,
    verification: toRegistryDefinition(v13_ulsBendingZAxialShear),
  },
  { checkId: 14, verification: toRegistryDefinition(v14_ulsBiaxialAxialShear) },
  { checkId: 15, verification: toRegistryDefinition(v15_ulsBucklingY) },
  { checkId: 16, verification: toRegistryDefinition(v16_ulsBucklingZ) },
  { checkId: 17, verification: toRegistryDefinition(v17_ulsTorsionalBuckling) },
  { checkId: 18, verification: toRegistryDefinition(v18_ulsLtb) },
  { checkId: 19, verification: toRegistryDefinition(v19_ulsBeamColumn61M1) },
  { checkId: 20, verification: toRegistryDefinition(v20_ulsBeamColumn62M1) },
  { checkId: 21, verification: toRegistryDefinition(v21_ulsBeamColumn61M2) },
  { checkId: 22, verification: toRegistryDefinition(v22_ulsBeamColumn62M2) },
];

type Nodes = (typeof verificationRegistry)[number]["verification"]["nodes"];
type UserInputKeys = Extract<Nodes[number], { type: "user-input" }>["key"];
export type Ec3Inputs = Pick<InferCache<Nodes>, UserInputKeys>;

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

const getCheckDetails = (
  verification: VerificationDefinition<readonly Node[]>,
) => {
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

const toVerificationRow = (
  checkId: number,
  verification: VerificationDefinition<readonly Node[]>,
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

const verify = (
  inputs: Ec3Inputs,
  annex: EvaluationContext["annex"] = eurocodeAnnex,
): VerificationRow[] => {
  const context: EvaluationContext = { inputs, annex };

  if (verificationRegistry.length !== 22) {
    throw new Error(
      `Unexpected verification registry size: ${verificationRegistry.length}`,
    );
  }

  return verificationRegistry.map(({ checkId, verification }) =>
    toVerificationRow(checkId, verification, context),
  );
};

export default verify;

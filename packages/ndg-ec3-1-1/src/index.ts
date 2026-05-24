import {
  defineNDGSuite,
  runNDGSuite,
  type Condition,
  type ConditionOperand,
  type NDGSuiteRunRow,
  type NDGRunResult,
  type NDGTraceEntry,
  type Node,
} from "@ndg/ndg-core";
import type { Ec311Inputs } from "./ec311-inputs";
import v01_tension from "./verifications/01_tension/tension";
import v02_compression from "./verifications/02_compression/compression";
import v03_bendingY from "./verifications/03_bendingY/bendingY";
import v04_bendingZ from "./verifications/04_bendingZ/bendingZ";
import v05_shearZ from "./verifications/05_shearZ/shearZ";
import v06_shearY from "./verifications/06_shearY/shearY";
import v07_bendingYShear from "./verifications/07_bendingYShear/bendingYShear";
import v08_bendingZShear from "./verifications/08_bendingZShear/bendingZShear";
import v09_bendingYAxial from "./verifications/09_bendingYAxial/bendingYAxial";
import v10_bendingZAxial from "./verifications/10_bendingZAxial/bendingZAxial";

export { evaluateCondition } from "@ndg/ndg-core";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, NDGRunResult, NDGTraceEntry, Node };
export type { Ec311Inputs } from "./ec311-inputs";

const suite = defineNDGSuite([
  { id: 1, ndg: v01_tension },
  { id: 2, ndg: v02_compression },
  { id: 3, ndg: v03_bendingY },
  { id: 4, ndg: v04_bendingZ },
  { id: 5, ndg: v05_shearZ },
  { id: 6, ndg: v06_shearY },
  { id: 7, ndg: v07_bendingYShear },
  { id: 8, ndg: v08_bendingZShear },
  { id: 9, ndg: v09_bendingYAxial },
  { id: 10, ndg: v10_bendingZAxial },
]);

export type VerificationRow = NDGSuiteRunRow;

const verify = (inputs: Ec311Inputs): readonly VerificationRow[] =>
  runNDGSuite(suite, { values: inputs });

export default verify;

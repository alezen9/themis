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
import v03_bending_moment_yy from "./verifications/03_bending_moment_yy/bending-moment-yy";
import v04_bending_moment_zz from "./verifications/04_bending_moment_zz/bending-moment-zz";

export { evaluateCondition } from "@ndg/ndg-core";
export {
  userInputCatalog,
  userInputKeys,
  tableKeyValues,
  tableKeys,
  coefficientCatalog,
  coefficientKeys,
} from "./catalog";
export { unitLabel, displayUnitOptions, applyDisplayUnit } from "./units";
export { eurocodeAnnex } from "./annexes/eurocode";
export { italianAnnex } from "./annexes/italian-na";
export type { Condition, ConditionOperand, NDGRunResult, NDGTraceEntry, Node };
export type { Ec311Inputs } from "./ec311-inputs";

const suite = defineNDGSuite([
  { id: 1, ndg: v01_tension },
  { id: 2, ndg: v02_compression },
  { id: 3, ndg: v03_bending_moment_yy },
  { id: 4, ndg: v04_bending_moment_zz },
]);

export type VerificationRow = NDGSuiteRunRow;

const verify = (inputs: Ec311Inputs): readonly VerificationRow[] =>
  runNDGSuite(suite, { values: inputs });

export default verify;

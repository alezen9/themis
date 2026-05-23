import type { VerificationDefinition } from "@ndg/ndg-core";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";
import { evaluate } from "./compression-evaluate";
import { nodes, type Nodes } from "./compression-nodes";

type Verification = VerificationDefinition<Nodes, Ec3EvaluatorInputs>;

const verification: Verification = { nodes, evaluate };

export default verification;

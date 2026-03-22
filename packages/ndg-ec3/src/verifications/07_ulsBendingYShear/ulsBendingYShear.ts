import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingYShear-evaluate";
import { nodes, type Nodes } from "./ulsBendingYShear-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingYAxial-evaluate";
import { nodes, type Nodes } from "./ulsBendingYAxial-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

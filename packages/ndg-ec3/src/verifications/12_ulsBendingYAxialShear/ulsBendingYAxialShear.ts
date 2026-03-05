import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingYAxialShear-evaluate";
import { nodes, type Nodes } from "./ulsBendingYAxialShear-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

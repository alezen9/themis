import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingZAxial-evaluate";
import { nodes, type Nodes } from "./ulsBendingZAxial-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

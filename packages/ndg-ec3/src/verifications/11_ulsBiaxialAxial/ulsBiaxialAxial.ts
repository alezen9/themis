import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBiaxialAxial-evaluate";
import { nodes, type Nodes } from "./ulsBiaxialAxial-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

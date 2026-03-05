import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsShearZ-evaluate";
import { nodes, type Nodes } from "./ulsShearZ-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBeamColumn61M2-evaluate";
import { nodes, type Nodes } from "./ulsBeamColumn61M2-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

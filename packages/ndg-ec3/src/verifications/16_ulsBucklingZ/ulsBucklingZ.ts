import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBucklingZ-evaluate";
import { nodes, type Nodes } from "./ulsBucklingZ-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = {
  nodes,
  evaluate,
};

export default verification;

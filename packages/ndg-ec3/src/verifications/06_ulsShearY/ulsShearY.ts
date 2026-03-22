import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsShearY-evaluate";
import { nodes, type Nodes } from "./ulsShearY-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

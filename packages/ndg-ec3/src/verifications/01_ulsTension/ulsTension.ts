import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsTension-evaluate";
import { nodes, type Nodes } from "./ulsTension-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

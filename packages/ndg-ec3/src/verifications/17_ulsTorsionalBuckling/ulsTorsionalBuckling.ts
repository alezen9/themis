import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsTorsionalBuckling-evaluate";
import { nodes, type Nodes } from "./ulsTorsionalBuckling-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsCompression-evaluate";
import { nodes, type Nodes } from "./ulsCompression-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

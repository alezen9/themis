import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingY-evaluate";
import { nodes, type Nodes } from "./ulsBendingY-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

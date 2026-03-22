import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBucklingY-evaluate";
import { nodes, type Nodes } from "./ulsBucklingY-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

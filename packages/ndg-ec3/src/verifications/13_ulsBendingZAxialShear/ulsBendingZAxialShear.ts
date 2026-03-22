import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingZAxialShear-evaluate";
import { nodes, type Nodes } from "./ulsBendingZAxialShear-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

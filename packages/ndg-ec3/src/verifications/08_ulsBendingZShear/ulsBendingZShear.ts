import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBendingZShear-evaluate";
import { nodes, type Nodes } from "./ulsBendingZShear-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

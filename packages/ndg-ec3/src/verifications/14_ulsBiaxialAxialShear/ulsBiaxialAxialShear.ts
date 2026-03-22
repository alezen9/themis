import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBiaxialAxialShear-evaluate";
import { nodes, type Nodes } from "./ulsBiaxialAxialShear-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

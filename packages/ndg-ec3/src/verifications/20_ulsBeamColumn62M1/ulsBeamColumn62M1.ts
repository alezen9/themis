import type { VerificationDefinition } from "@ndg/ndg-core";
import { evaluate } from "./ulsBeamColumn62M1-evaluate";
import { nodes, type Nodes } from "./ulsBeamColumn62M1-nodes";

type Verification = VerificationDefinition<Nodes>;

const verification: Verification = { nodes, evaluate };

export default verification;

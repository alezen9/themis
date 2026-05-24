import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingZAxialShear-evaluate";
import { nodes } from "./bendingZAxialShear-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

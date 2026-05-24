import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./biaxialAxialShear-evaluate";
import { nodes } from "./biaxialAxialShear-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

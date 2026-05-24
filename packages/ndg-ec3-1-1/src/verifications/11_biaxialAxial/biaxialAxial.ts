import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./biaxialAxial-evaluate";
import { nodes } from "./biaxialAxial-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingYAxialShear-evaluate";
import { nodes } from "./bendingYAxialShear-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

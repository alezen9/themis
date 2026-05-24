import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingYShear-evaluate";
import { nodes } from "./bendingYShear-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingZ-evaluate";
import { nodes } from "./bendingZ-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

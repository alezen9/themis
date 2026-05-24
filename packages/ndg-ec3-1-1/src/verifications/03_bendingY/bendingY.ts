import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingY-evaluate";
import { nodes } from "./bendingY-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

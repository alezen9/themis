import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./shearY-evaluate";
import { nodes } from "./shearY-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./shearZ-evaluate";
import { nodes } from "./shearZ-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

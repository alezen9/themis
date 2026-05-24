import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./compression-evaluate";
import { nodes } from "./compression-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./tension-evaluate";
import { nodes } from "./tension-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./ltb-evaluate";
import { nodes } from "./ltb-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

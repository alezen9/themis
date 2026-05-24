import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingYAxial-evaluate";
import { nodes } from "./bendingYAxial-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

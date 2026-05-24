import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bucklingY-evaluate";
import { nodes } from "./bucklingY-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

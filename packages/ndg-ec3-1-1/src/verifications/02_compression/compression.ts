import { defineNDG } from "../../define";
import { evaluate } from "./compression-evaluate";
import { nodes } from "./compression-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

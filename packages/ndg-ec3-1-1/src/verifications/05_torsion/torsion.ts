import { defineNDG } from "../../define";
import { evaluate } from "./torsion-evaluate";
import { nodes } from "./torsion-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

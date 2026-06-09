import { defineNDG } from "../../define";
import { evaluate } from "./shear-torsion-yy-evaluate";
import { nodes } from "./shear-torsion-yy-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

import { defineNDG } from "../../define";
import { evaluate } from "./shear-torsion-zz-evaluate";
import { nodes } from "./shear-torsion-zz-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

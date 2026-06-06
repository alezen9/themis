import { defineNDG } from "../../define";
import { evaluate } from "./bending-moment-zz-evaluate";
import { nodes } from "./bending-moment-zz-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

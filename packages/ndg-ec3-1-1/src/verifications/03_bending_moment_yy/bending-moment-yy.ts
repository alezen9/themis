import { defineNDG } from "../../define";
import { evaluate } from "./bending-moment-yy-evaluate";
import { nodes } from "./bending-moment-yy-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

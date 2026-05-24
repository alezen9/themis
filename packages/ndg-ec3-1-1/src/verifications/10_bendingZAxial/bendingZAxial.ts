import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingZAxial-evaluate";
import { nodes } from "./bendingZAxial-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

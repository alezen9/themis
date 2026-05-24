import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bendingZShear-evaluate";
import { nodes } from "./bendingZShear-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

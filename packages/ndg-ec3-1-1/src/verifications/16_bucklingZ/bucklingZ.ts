import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./bucklingZ-evaluate";
import { nodes } from "./bucklingZ-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

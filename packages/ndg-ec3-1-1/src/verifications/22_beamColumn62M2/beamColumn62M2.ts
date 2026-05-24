import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./beamColumn62M2-evaluate";
import { nodes } from "./beamColumn62M2-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

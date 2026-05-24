import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./beamColumn62M1-evaluate";
import { nodes } from "./beamColumn62M1-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

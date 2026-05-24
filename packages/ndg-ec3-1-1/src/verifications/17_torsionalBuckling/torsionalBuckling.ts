import { defineNDG } from "@ndg/ndg-core";
import { evaluate } from "./torsionalBuckling-evaluate";
import { nodes } from "./torsionalBuckling-nodes";

const ndg = defineNDG({ nodes, evaluate });

export default ndg;

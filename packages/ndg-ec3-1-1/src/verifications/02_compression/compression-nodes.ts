import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "02480d3f-b178-48dd-a39b-b85309a61b3d",
    children: [
      { nodeId: "a77f73f6-5d19-4d12-9ff2-35260f63f393" },
      { nodeId: "5217f3d1-f584-4fb9-a193-810d95c1f743" },
    ],
    type: "check",
    variant: "compute",
    key: "utilisation",
    name: "Compression",
    symbol: "u_r",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.2.4",
      paragraphRef: "(1)",
      subParagraphRef: "",
      formulaRef: "(6.9)",
      tableRef: "",
      verificationRef: "",
    },
    template: "\\frac{|\\key{N_Ed_N}|}{\\key{N_c_Rd_N}} \\leq 1.0",
  },
  {
    id: "a77f73f6-5d19-4d12-9ff2-35260f63f393",
    symbol: "N_{Ed}",
    children: [],
    type: "user-input",
    key: "N_Ed_N",
    valueType: { type: "number" },
  },
  {
    id: "5217f3d1-f584-4fb9-a193-810d95c1f743",
    symbol: "N_{c,Rd}",
    children: [
      { nodeId: "13e0cff4-8097-463b-8ff5-5364e9089fe9" },
      { nodeId: "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf" },
      { nodeId: "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8" },
    ],
    type: "formula",
    variant: "compute",
    key: "N_c_Rd_N",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.2.4",
      paragraphRef: "(2)",
      subParagraphRef: "",
      formulaRef: "(6.10)",
      tableRef: "",
      verificationRef: "",
    },
    template: "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
  },
  {
    id: "13e0cff4-8097-463b-8ff5-5364e9089fe9",
    symbol: "A",
    children: [],
    type: "user-input",
    key: "A_mm2",
    valueType: { type: "number" },
  },
  {
    id: "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf",
    symbol: "f_y",
    children: [],
    type: "user-input",
    key: "fy_MPa",
    valueType: { type: "number" },
  },
  {
    id: "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8",
    symbol: "\\gamma_{M0}",
    children: [],
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.1",
      paragraphRef: "(1)",
      subParagraphRef: "NOTE 2B",
    },
  },
]);

export type Nodes = typeof nodes;

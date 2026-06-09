import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "02480d3f-b178-48dd-a39b-b85309a61b3d",
    symbol: "u_r",
    children: [
      { nodeId: "ba59afe4-45d3-4822-aff4-101b7a760c7b" },
      { nodeId: "7c1914fc-af3d-4d61-b59b-86cffdbf5e47" },
    ],
    type: "check",
    variant: "compute",
    key: "utilisation",
    name: "Torsion",
    valueType: { type: "number" },
    meta: { sectionRef: "6.2.7", paragraphRef: "(1)", formulaRef: "(6.23)" },
    template: "\\frac{|\\key{T_Ed_Nmm}|}{\\key{T_Rd_Nmm}} \\leq 1.0",
  },
  {
    id: "ba59afe4-45d3-4822-aff4-101b7a760c7b",
    symbol: "T_{Ed}",
    children: [],
    type: "user-input",
    key: "T_Ed_Nmm",
    valueType: { type: "number" },
    displayUnit: "kNm",
  },
  {
    id: "7c1914fc-af3d-4d61-b59b-86cffdbf5e47",
    symbol: "T_{Rd}",
    children: [
      { nodeId: "da0414d7-9a8a-421b-8b90-fc68bee51719" },
      { nodeId: "b69915e2-c406-4c04-8cb6-d48c6f5c9d6e" },
      { nodeId: "5cbdf33a-bf23-4eb2-8a95-1621191633b6" },
    ],
    type: "formula",
    variant: "compute",
    key: "T_Rd_Nmm",
    valueType: { type: "number" },
    meta: {
      sectionRef: "",
      paragraphRef: "",
      subParagraphRef: "",
      formulaRef: "",
      tableRef: "",
      verificationRef: "",
    },
    displayUnit: "kNm",
    template:
      "\\frac{\\key{Wt_mm3} \\cdot \\key{fy_MPa}}{\\sqrt{3} \\cdot \\key{gamma_M0}}",
  },
  {
    id: "da0414d7-9a8a-421b-8b90-fc68bee51719",
    symbol: "f_y",
    children: [],
    type: "user-input",
    key: "fy_MPa",
    valueType: { type: "number" },
  },
  {
    id: "b69915e2-c406-4c04-8cb6-d48c6f5c9d6e",
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
  {
    id: "5cbdf33a-bf23-4eb2-8a95-1621191633b6",
    symbol: "W_t",
    children: [],
    type: "user-input",
    key: "Wt_mm3",
    valueType: { type: "number" },
  },
]);

export type Nodes = typeof nodes;

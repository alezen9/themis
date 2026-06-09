import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "02480d3f-b178-48dd-a39b-b85309a61b3d",
    symbol: "u_r",
    children: [
      { nodeId: "a77f73f6-5d19-4d12-9ff2-35260f63f393" },
      { nodeId: "1252c6ad-2b65-4bb8-a844-89bc4fad9c6f" },
    ],
    type: "check",
    variant: "compute",
    key: "utilisation",
    name: "Bending moment z-z",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.2.5",
      paragraphRef: "(1)",
      formulaRef: "(6.12)",
    },
    template: "\\frac{|\\key{M_z_Ed_Nmm}|}{\\key{M_c_Rd_Nmm}} \\leq 1.0",
  },
  {
    id: "a77f73f6-5d19-4d12-9ff2-35260f63f393",
    symbol: "M_{z,Ed}",
    children: [],
    type: "user-input",
    key: "M_z_Ed_Nmm",
    valueType: { type: "number" },
    unit: "N{\\cdot}mm",
  },
  {
    id: "1252c6ad-2b65-4bb8-a844-89bc4fad9c6f",
    children: [
      {
        nodeId: "534220da-67ad-4584-8d1c-1b9deb304962",
        when: { eq: ["section_class", { value: 3 }] },
      },
      {
        nodeId: "5217f3d1-f584-4fb9-a193-810d95c1f743",
        when: {
          or: [
            { eq: ["section_class", { value: 1 }] },
            { eq: ["section_class", { value: 2 }] },
          ],
        },
      },
    ],
    type: "formula",
    variant: "select",
    key: "M_c_Rd_Nmm",
    valueType: { type: "number" },
  },
  {
    id: "534220da-67ad-4584-8d1c-1b9deb304962",
    symbol: "M_{el,z,Rd}",
    children: [
      { nodeId: "2bdfed5e-53f9-4fd1-b8d1-61d02638f454" },
      { nodeId: "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8" },
      { nodeId: "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf" },
    ],
    type: "formula",
    variant: "compute",
    key: "M_el_z_Rd_Nmm",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.2.5",
      paragraphRef: "(2)",
      formulaRef: "(6.14)",
    },
    template: "\\frac{\\key{Wel_z_mm3} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
    unit: "Nmm",
  },
  {
    id: "5217f3d1-f584-4fb9-a193-810d95c1f743",
    symbol: "M_{pl,z,Rd}",
    children: [
      { nodeId: "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf" },
      { nodeId: "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8" },
      { nodeId: "eda41236-344e-4143-a8cb-d15cfb1c64ec" },
    ],
    type: "formula",
    variant: "compute",
    key: "M_pl_z_Rd_Nmm",
    valueType: { type: "number" },
    meta: {
      sectionRef: "6.2.5",
      paragraphRef: "(2)",
      formulaRef: "(6.13)",
    },
    template: "\\frac{\\key{Wpl_z_mm3} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
    unit: "Nmm",
  },
  {
    id: "2bdfed5e-53f9-4fd1-b8d1-61d02638f454",
    symbol: "W_{el,z}",
    children: [],
    type: "user-input",
    key: "Wel_z_mm3",
    valueType: { type: "number" },
    unit: "mm^3",
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
  {
    id: "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf",
    symbol: "f_y",
    children: [],
    type: "user-input",
    key: "fy_MPa",
    valueType: { type: "number" },
    unit: "\\mathrm{MPa}",
  },
  {
    id: "eda41236-344e-4143-a8cb-d15cfb1c64ec",
    symbol: "W_{pl,z}",
    children: [],
    type: "user-input",
    key: "Wpl_z_mm3",
    valueType: { type: "number" },
    unit: "mm^3",
  },
]);

export type Nodes = typeof nodes;

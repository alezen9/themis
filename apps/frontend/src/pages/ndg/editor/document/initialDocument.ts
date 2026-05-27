import { createEdgeId } from "./ids";
import { EDITOR_DOCUMENT_VERSION, type EditorDocument } from "./types";

const ratioId = "02480d3f-b178-48dd-a39b-b85309a61b3d";
const designForceId = "a77f73f6-5d19-4d12-9ff2-35260f63f393";
const plasticResistanceId = "5217f3d1-f584-4fb9-a193-810d95c1f743";
const areaId = "13e0cff4-8097-463b-8ff5-5364e9089fe9";
const yieldStrengthId = "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf";
const safetyFactorId = "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8";

export const initialDocument: EditorDocument = {
  version: EDITOR_DOCUMENT_VERSION,
  nodes: [
    {
      id: ratioId,
      position: { x: 0, y: 0 },
      type: "check",
      data: {
        key: "ratio",
        valueType: { type: "number" },
        name: "Tension check",
        verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
      },
    },
    {
      id: designForceId,
      position: { x: -220, y: 170 },
      type: "user-input",
      data: {
        key: "N_Ed_N",
        valueType: { type: "number" },
        name: "Design force",
        symbol: "N_{Ed}",
        unit: "N",
      },
    },
    {
      id: plasticResistanceId,
      position: { x: 220, y: 170 },
      type: "formula",
      data: {
        key: "N_pl_Rd_N",
        valueType: { type: "number" },
        symbol: "N_{pl,Rd}",
        name: "Plastic resistance",
        expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
      },
    },
    {
      id: areaId,
      position: { x: 0, y: 340 },
      type: "user-input",
      data: {
        key: "A_mm2",
        valueType: { type: "number" },
        name: "Area",
        symbol: "A",
        unit: "mm^{2}",
      },
    },
    {
      id: yieldStrengthId,
      position: { x: 220, y: 340 },
      type: "user-input",
      data: {
        key: "fy_MPa",
        valueType: { type: "number" },
        name: "Yield strength",
        symbol: "f_y",
        unit: "MPa",
      },
    },
    {
      id: safetyFactorId,
      position: { x: 440, y: 340 },
      type: "coefficient",
      data: {
        key: "gamma_M0",
        symbol: "\\gamma_{M0}",
        valueType: { type: "number" },
        name: "Safety factor",
        meta: { sectionRef: "6.1" },
      },
    },
  ],
  edges: [
    {
      id: createEdgeId(ratioId, designForceId),
      source: ratioId,
      target: designForceId,
    },
    {
      id: createEdgeId(ratioId, plasticResistanceId),
      source: ratioId,
      target: plasticResistanceId,
    },
    {
      id: createEdgeId(plasticResistanceId, areaId),
      source: plasticResistanceId,
      target: areaId,
    },
    {
      id: createEdgeId(plasticResistanceId, yieldStrengthId),
      source: plasticResistanceId,
      target: yieldStrengthId,
    },
    {
      id: createEdgeId(plasticResistanceId, safetyFactorId),
      source: plasticResistanceId,
      target: safetyFactorId,
    },
  ],
};

import { createEdgeId } from "./ids";
import type { EditorDocument } from "./types";

const ratioId = "02480d3f-b178-48dd-a39b-b85309a61b3d";
const designForceId = "a77f73f6-5d19-4d12-9ff2-35260f63f393";
const plasticResistanceId = "5217f3d1-f584-4fb9-a193-810d95c1f743";
const areaId = "13e0cff4-8097-463b-8ff5-5364e9089fe9";
const yieldStrengthId = "a6233bbd-8ad1-46b2-a325-fcd0164c8aaf";
const safetyFactorId = "7ff50833-8392-4e44-a6a7-c0fd8d5cd1c8";

export const exampleDocument: EditorDocument = {
  version: 1,
  nodes: [
    {
      id: ratioId,
      position: { x: 0, y: 0 },
      data: {
        type: "check",
        key: "ratio",
        valueType: { type: "number" },
        name: "Tension check",
        verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
      },
    },
    {
      id: designForceId,
      position: { x: -220, y: 170 },
      data: {
        type: "user-input",
        key: "N_Ed_N",
        valueType: { type: "number" },
        name: "Design force",
      },
    },
    {
      id: plasticResistanceId,
      position: { x: 220, y: 170 },
      data: {
        type: "formula",
        key: "N_pl_Rd_N",
        valueType: { type: "number" },
        name: "Plastic resistance",
        expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
      },
    },
    {
      id: areaId,
      position: { x: 0, y: 340 },
      data: {
        type: "user-input",
        key: "A_mm2",
        valueType: { type: "number" },
        name: "Area",
      },
    },
    {
      id: yieldStrengthId,
      position: { x: 220, y: 340 },
      data: {
        type: "user-input",
        key: "fy_MPa",
        valueType: { type: "number" },
        name: "Yield strength",
      },
    },
    {
      id: safetyFactorId,
      position: { x: 440, y: 340 },
      data: {
        type: "coefficient",
        key: "gamma_M0",
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

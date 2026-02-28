import { describe, expect, it } from "vitest";
import { ec3Verifications } from "../src/verifications";

const leafTypes = new Set(["user-input", "coefficient", "constant"]);
const computedTypes = new Set(["formula", "derived", "table", "check"]);

describe("leaf-node completeness contract", () => {
  it("keeps node ids unique and child references closed per verification", () => {
    for (const def of ec3Verifications) {
      const ids = def.nodes.map((node) => node.id);
      expect(new Set(ids).size, `${def.id} has duplicate node ids`).toBe(ids.length);

      const idSet = new Set(ids);
      for (const node of def.nodes) {
        for (const child of node.children) {
          expect(
            idSet.has(child.nodeId),
            `${def.id}:${node.key} references missing child ${child.nodeId}`,
          ).toBe(true);
        }
      }
    }
  });

  it("keeps leaf/computed dependency contracts explicit", () => {
    for (const def of ec3Verifications) {
      for (const node of def.nodes) {
        if (leafTypes.has(node.type)) {
          expect(node.children.length, `${def.id}:${node.key} leaf node must not have children`).toBe(0);
        }
        if (computedTypes.has(node.type)) {
          expect(node.children.length, `${def.id}:${node.key} computed node must have children`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps evaluator map aligned with computed node keys", () => {
    for (const def of ec3Verifications) {
      const evalKeys = new Set(Object.keys(def.evaluate));
      const nodeKeys = new Set(def.nodes.map((n) => n.key).filter(Boolean) as string[]);

      for (const key of evalKeys) {
        expect(nodeKeys.has(key), `${def.id}: evaluate key ${key} has no node`).toBe(true);
      }

      for (const node of def.nodes) {
        if (!node.key) continue;
        if (leafTypes.has(node.type)) {
          expect(evalKeys.has(node.key), `${def.id}:${node.key} leaf must not be in evaluate map`).toBe(false);
        }
        if (computedTypes.has(node.type)) {
          expect(evalKeys.has(node.key), `${def.id}:${node.key} computed node missing evaluate handler`).toBe(true);
        }
      }
    }
  });
});

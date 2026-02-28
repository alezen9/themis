import { describe, expect, it } from "vitest";
import { ec3Verifications } from "../src/verifications";

describe("table-node contract (C3)", () => {
  it("uses table nodes for all tableRef metadata", () => {
    for (const def of ec3Verifications) {
      for (const node of def.nodes) {
        if (node.meta?.tableRef) {
          expect(node.type, `${def.id}:${node.key}`).toBe("table");
        }
      }
    }
  });

  it("requires source on each table node", () => {
    const tableNodes = ec3Verifications.flatMap((v) => v.nodes.filter((n) => n.type === "table"));
    expect(tableNodes.length).toBeGreaterThan(0);
    for (const node of tableNodes) {
      expect(node.source.length).toBeGreaterThan(0);
    }
  });
});

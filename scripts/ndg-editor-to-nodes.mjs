#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const fail = msg => {
  console.error(`Error: ${msg}`);
  process.exit(1);
};

const parseArgs = () => {
  const get = flag => {
    const i = process.argv.indexOf(flag);
    return i >= 0 ? (process.argv[i + 1] ?? "") : "";
  };
  const inPath = path.resolve(get("--in"));
  const outPath = path.resolve(get("--out"));
  if (!inPath || !outPath)
    fail(
      "Usage: pnpm ndg:editor-to-nodes --in <input.ndg.json> --out <output-nodes.ts>",
    );
  return { inPath, outPath };
};

const loadNDGSchema = async () => {
  try {
    return (await import("../packages/ndg-core/dist/index.js")).NDGSchema;
  } catch {
    fail(
      'Could not load ndg-core. Run "pnpm --filter @ndg/ndg-core build" first',
    );
  }
};

// BFS from the root check node so defineNodes output reads top-down.
const sortBfs = nodes => {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const hasParent = new Set(nodes.flatMap(n => n.children.map(c => c.nodeId)));
  const root = nodes.find(n => n.type === "check" && !hasParent.has(n.id));
  if (!root) fail("Could not find root check node");

  const ordered = [];
  const seen = new Set();
  const queue = [root.id];
  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    const node = byId.get(id);
    if (!node) continue;
    ordered.push(node);
    for (const c of node.children) queue.push(c.nodeId);
  }

  return [
    ...ordered,
    ...nodes
      .filter(n => !seen.has(n.id))
      .sort((a, b) => a.id.localeCompare(b.id)),
  ];
};

// editor edges → NDG children; edge.data.condition maps to child.when (NDG core field).
const toNdgNodes = doc => {
  const edgesBySource = new Map();
  for (const edge of doc.edges) {
    const list = edgesBySource.get(edge.source) ?? [];
    list.push(edge);
    edgesBySource.set(edge.source, list);
  }
  return doc.nodes.map(n => ({
    id: n.id,
    type: n.type,
    ...n.data,
    children: (edgesBySource.get(n.id) ?? []).map(e => ({
      nodeId: e.target,
      ...(e.data?.condition !== undefined ? { when: e.data.condition } : {}),
    })),
  }));
};

const main = async () => {
  const { inPath, outPath } = parseArgs();
  const NDGSchema = await loadNDGSchema();

  let doc;
  try {
    doc = JSON.parse(await fs.readFile(inPath, "utf8"));
  } catch {
    fail(`Could not parse JSON from "${inPath}"`);
  }

  if (
    doc?.version !== 2 ||
    !Array.isArray(doc.nodes) ||
    !Array.isArray(doc.edges)
  )
    fail("Input must be an EditorDocument (version: 2, nodes: [], edges: [])");

  const result = NDGSchema.safeParse(toNdgNodes(doc));
  if (!result.success) {
    const { path: p, message } = result.error.issues[0];
    fail(`Invalid nodes — ${p.length ? p.join(".") : "<root>"}: ${message}`);
  }

  const nodes = sortBfs(result.data);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(
    outPath,
    'import { defineNodes } from "@ndg/ndg-core";\n\n' +
      `export const nodes = defineNodes(${JSON.stringify(nodes, null, 2)});\n\n` +
      "export type Nodes = typeof nodes;\n",
    "utf8",
  );
  console.log(`Wrote ${nodes.length} nodes to "${outPath}"`);
};

main().catch(e => fail(e instanceof Error ? e.message : String(e)));

#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const HORIZONTAL_GAP = 320;
const VERTICAL_GAP = 220;
const DRAFT_FORMAT = "ndg-editor-draft";
const DRAFT_VERSION = 1;

const fail = (message) => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const usage = () =>
  [
    "Usage:",
    "  pnpm ndg:draft-to-nodes --in <input.ndg.json> --out <output-nodes.ts>",
  ].join("\n");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = { inPath: "", outPath: "" };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--in") {
      out.inPath = args[i + 1] ?? "";
      i += 1;
      continue;
    }

    if (arg === "--out") {
      out.outPath = args[i + 1] ?? "";
      i += 1;
      continue;
    }
  }

  if (!out.inPath || !out.outPath) {
    fail(usage());
  }

  return out;
};

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const isLayoutPosition = (value) =>
  isRecord(value) && isFiniteNumber(value.x) && isFiniteNumber(value.y);

const formatSchemaIssue = (issue) => {
  const pathLabel =
    issue.path.length > 0
      ? issue.path.map((segment) => String(segment)).join(".")
      : "<root>";
  return `${pathLabel}: ${issue.message}`;
};

const loadVerificationSchema = async () => {
  try {
    const module = await import("../packages/ndg-core/dist/index.js");
    return module.VerificationSchema;
  } catch {
    fail(
      'Could not load "@ndg/ndg-core" runtime schema. Run "pnpm --filter @ndg/ndg-core build" first',
    );
  }
};

const orderNodesRootFirstBfs = (nodes) => {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const parentById = new Map();

  for (const node of nodes) {
    for (const child of node.children) {
      parentById.set(child.nodeId, node.id);
    }
  }

  const rootNode = nodes.find(
    (node) => node.type === "check" && !parentById.has(node.id),
  );
  if (!rootNode) {
    fail("Could not determine root check node for BFS ordering");
  }

  const orderedNodes = [];
  const visited = new Set();
  const queue = [rootNode.id];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId || visited.has(nodeId)) {
      continue;
    }

    const node = nodesById.get(nodeId);
    if (!node) {
      continue;
    }

    visited.add(nodeId);
    orderedNodes.push(node);

    for (const child of node.children) {
      queue.push(child.nodeId);
    }
  }

  const unvisitedNodes = nodes
    .filter((node) => !visited.has(node.id))
    .sort((left, right) => left.id.localeCompare(right.id));

  return [...orderedNodes, ...unvisitedNodes];
};

const buildLayoutById = (nodes) => {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const parentById = new Map();

  for (const node of nodes) {
    for (const child of node.children) {
      parentById.set(child.nodeId, node.id);
    }
  }

  const rootNode = nodes.find(
    (node) => node.type === "check" && !parentById.has(node.id),
  );
  if (!rootNode) {
    return {};
  }

  const nodesByDepth = new Map();
  const visited = new Set();
  const queue = [{ nodeId: rootNode.id, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.nodeId)) {
      continue;
    }

    visited.add(current.nodeId);
    const row = nodesByDepth.get(current.depth) ?? [];
    row.push(current.nodeId);
    nodesByDepth.set(current.depth, row);

    const node = nodesById.get(current.nodeId);
    if (!node) {
      continue;
    }

    for (const child of node.children) {
      queue.push({
        nodeId: child.nodeId,
        depth: current.depth + 1,
      });
    }
  }

  const layoutById = {};

  for (const [depth, nodeIds] of nodesByDepth.entries()) {
    nodeIds.forEach((nodeId, index) => {
      layoutById[nodeId] = {
        x: index * HORIZONTAL_GAP,
        y: depth * VERTICAL_GAP,
      };
    });
  }

  return layoutById;
};

const main = async () => {
  const { inPath, outPath } = parseArgs();
  const VerificationSchema = await loadVerificationSchema();
  const absoluteInPath = path.resolve(inPath);
  const absoluteOutPath = path.resolve(outPath);

  const rawText = await fs.readFile(absoluteInPath, "utf8");
  let parsedJson;

  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    fail(`Could not parse JSON from "${absoluteInPath}"`);
  }

  if (!isRecord(parsedJson)) {
    fail("Draft must be a JSON object");
  }

  if (parsedJson.format !== DRAFT_FORMAT) {
    fail(`Draft format must be "${DRAFT_FORMAT}"`);
  }

  if (parsedJson.version !== DRAFT_VERSION) {
    fail(`Draft version must be ${DRAFT_VERSION}`);
  }

  if (!isRecord(parsedJson.nodesById)) {
    fail("Draft nodesById must be an object");
  }

  if (!isRecord(parsedJson.layoutById)) {
    fail("Draft layoutById must be an object");
  }

  const nodes = [];
  for (const [nodeId, nodeValue] of Object.entries(parsedJson.nodesById)) {
    if (!isRecord(nodeValue)) {
      fail(`Draft node "${nodeId}" must be an object`);
    }

    if (nodeValue.id !== nodeId) {
      fail(`Draft node key "${nodeId}" must match node.id`);
    }

    nodes.push(nodeValue);
  }

  const validatedNodes = VerificationSchema.safeParse(nodes);
  if (!validatedNodes.success) {
    fail(`Draft nodes are invalid: ${formatSchemaIssue(validatedNodes.error.issues[0])}`);
  }

  const orderedNodes = orderNodesRootFirstBfs(validatedNodes.data);
  const normalizedLayoutById = buildLayoutById(orderedNodes);

  for (const node of orderedNodes) {
    const rawPosition = parsedJson.layoutById[node.id];
    if (!isLayoutPosition(rawPosition)) {
      continue;
    }

    normalizedLayoutById[node.id] = {
      x: rawPosition.x,
      y: rawPosition.y,
    };
  }

  const outputSource =
    'import { defineNodes } from "@ndg/ndg-core";\n\n' +
    `export const nodes = defineNodes(${JSON.stringify(orderedNodes, null, 2)});\n\n` +
    "export type Nodes = typeof nodes;\n";

  await fs.mkdir(path.dirname(absoluteOutPath), { recursive: true });
  await fs.writeFile(absoluteOutPath, outputSource, "utf8");

  console.log(
    `Wrote ${orderedNodes.length} nodes to "${absoluteOutPath}" from "${absoluteInPath}"`,
  );
};

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Unknown CLI failure");
});

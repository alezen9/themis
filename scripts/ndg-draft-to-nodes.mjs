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

const buildWeakAdjacency = (nodesById) => {
  const adjacency = new Map();

  for (const nodeId of nodesById.keys()) {
    adjacency.set(nodeId, new Set());
  }

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      if (!nodesById.has(child.nodeId)) continue;

      adjacency.get(node.id)?.add(child.nodeId);
      adjacency.get(child.nodeId)?.add(node.id);
    }
  }

  return adjacency;
};

const collectWeakComponents = (nodeIds, adjacency, preferredFirstId) => {
  const visited = new Set();
  const orderedSeeds = [...nodeIds].sort((left, right) =>
    left.localeCompare(right),
  );

  if (preferredFirstId) {
    const preferredIndex = orderedSeeds.indexOf(preferredFirstId);
    if (preferredIndex >= 0) {
      orderedSeeds.splice(preferredIndex, 1);
      orderedSeeds.unshift(preferredFirstId);
    }
  }

  const components = [];

  for (const seedNodeId of orderedSeeds) {
    if (visited.has(seedNodeId)) continue;

    const queue = [seedNodeId];
    const component = [];

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId || visited.has(nodeId)) continue;

      visited.add(nodeId);
      component.push(nodeId);

      const neighbors = adjacency.get(nodeId);
      if (!neighbors) continue;

      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) continue;
        queue.push(neighborId);
      }
    }

    components.push(component);
  }

  return components;
};

const buildLayoutById = (nodes) => {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const layoutById = {};
  const checkNode = nodes.find((node) => node.type === "check");
  const components = collectWeakComponents(
    [...nodesById.keys()],
    buildWeakAdjacency(nodesById),
    checkNode?.id ?? null,
  );
  let componentOffsetX = 0;

  for (const componentNodeIds of components) {
    const componentNodeIdSet = new Set(componentNodeIds);
    const indegreeById = new Map(componentNodeIds.map((nodeId) => [nodeId, 0]));

    for (const nodeId of componentNodeIds) {
      const node = nodesById.get(nodeId);
      if (!node) continue;

      for (const child of node.children) {
        if (!componentNodeIdSet.has(child.nodeId)) continue;
        indegreeById.set(
          child.nodeId,
          (indegreeById.get(child.nodeId) ?? 0) + 1,
        );
      }
    }

    const roots = componentNodeIds.filter(
      (nodeId) => (indegreeById.get(nodeId) ?? 0) === 0,
    );
    const queue = roots.length > 0 ? [...roots] : [componentNodeIds[0]];
    const visited = new Set();
    const depthById = new Map();
    const nodeIdsByDepth = new Map();

    for (const rootId of queue) {
      depthById.set(rootId, 0);
    }

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId || visited.has(nodeId)) continue;

      visited.add(nodeId);
      const depth = depthById.get(nodeId) ?? 0;
      const row = nodeIdsByDepth.get(depth) ?? [];
      row.push(nodeId);
      nodeIdsByDepth.set(depth, row);

      const node = nodesById.get(nodeId);
      if (!node) continue;

      for (const child of node.children) {
        if (!componentNodeIdSet.has(child.nodeId)) continue;

        const nextDepth = depth + 1;
        const currentDepth =
          depthById.get(child.nodeId) ?? Number.NEGATIVE_INFINITY;
        if (nextDepth > currentDepth) depthById.set(child.nodeId, nextDepth);

        queue.push(child.nodeId);
      }
    }

    for (const nodeId of componentNodeIds) {
      if (visited.has(nodeId)) continue;

      const row = nodeIdsByDepth.get(0) ?? [];
      row.push(nodeId);
      nodeIdsByDepth.set(0, row);
    }

    const sortedDepths = [...nodeIdsByDepth.keys()].sort(
      (left, right) => left - right,
    );
    let maxRowLength = 0;

    for (const depth of sortedDepths) {
      const row = nodeIdsByDepth.get(depth) ?? [];
      if (row.length > maxRowLength) maxRowLength = row.length;

      row.forEach((nodeId, index) => {
        layoutById[nodeId] = {
          x: componentOffsetX + index * HORIZONTAL_GAP,
          y: depth * VERTICAL_GAP,
        };
      });
    }

    componentOffsetX +=
      Math.max(1, maxRowLength) * HORIZONTAL_GAP + HORIZONTAL_GAP;
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
    fail(
      `Draft nodes are invalid: ${formatSchemaIssue(validatedNodes.error.issues[0])}`,
    );
  }

  const orderedNodes = orderNodesRootFirstBfs(validatedNodes.data);
  const normalizedLayoutById = buildLayoutById(orderedNodes);

  for (const node of orderedNodes) {
    const rawPosition = parsedJson.layoutById[node.id];
    if (!isLayoutPosition(rawPosition)) {
      continue;
    }

    normalizedLayoutById[node.id] = { x: rawPosition.x, y: rawPosition.y };
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

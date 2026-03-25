#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

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
    "  pnpm ndg:nodes-to-draft --in <input-nodes.ts> --out <output.ndg.json>",
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

const formatNodeLocation = (sourceFile, node) => {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile),
  );
  return `${sourceFile.fileName}:${line + 1}:${character + 1}`;
};

const failAtNode = (sourceFile, node, message) => {
  fail(`${message} (${formatNodeLocation(sourceFile, node)})`);
};

const unwrapExpression = (expression) => {
  let current = expression;

  while (true) {
    if (ts.isParenthesizedExpression(current)) {
      current = current.expression;
      continue;
    }

    if (ts.isAsExpression(current) || ts.isSatisfiesExpression(current)) {
      current = current.expression;
      continue;
    }

    if (ts.isNonNullExpression(current)) {
      current = current.expression;
      continue;
    }

    return current;
  }
};

const parsePropertyName = (sourceFile, nameNode) => {
  if (ts.isIdentifier(nameNode)) {
    return nameNode.text;
  }

  if (
    ts.isStringLiteral(nameNode) ||
    ts.isNoSubstitutionTemplateLiteral(nameNode) ||
    ts.isNumericLiteral(nameNode)
  ) {
    return nameNode.text;
  }

  failAtNode(
    sourceFile,
    nameNode,
    "Unsupported object key in defineNodes literal parser",
  );
};

const parseLiteralExpression = (sourceFile, expression) => {
  const node = unwrapExpression(expression);

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }

  if (ts.isArrayLiteralExpression(node)) {
    const values = [];

    for (const element of node.elements) {
      if (ts.isSpreadElement(element)) {
        failAtNode(
          sourceFile,
          element,
          "Spread elements are not supported in defineNodes literal parser",
        );
      }

      values.push(parseLiteralExpression(sourceFile, element));
    }

    return values;
  }

  if (ts.isObjectLiteralExpression(node)) {
    const objectValue = {};

    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        failAtNode(
          sourceFile,
          property,
          "Spread properties are not supported in defineNodes literal parser",
        );
      }

      if (ts.isShorthandPropertyAssignment(property)) {
        failAtNode(
          sourceFile,
          property,
          "Shorthand properties are not supported in defineNodes literal parser",
        );
      }

      if (!ts.isPropertyAssignment(property)) {
        failAtNode(
          sourceFile,
          property,
          "Only plain property assignments are supported in defineNodes literal parser",
        );
      }

      const key = parsePropertyName(sourceFile, property.name);
      objectValue[key] = parseLiteralExpression(sourceFile, property.initializer);
    }

    return objectValue;
  }

  failAtNode(
    sourceFile,
    node,
    "Unsupported expression in defineNodes literal parser",
  );
};

const findDefineNodesArrayLiteral = (sourceFile) => {
  let foundArrayLiteral = null;

  const visit = (node) => {
    if (foundArrayLiteral) {
      return;
    }

    const currentNode = unwrapExpression(node);
    if (!ts.isCallExpression(currentNode)) {
      ts.forEachChild(node, visit);
      return;
    }

    const callee = unwrapExpression(currentNode.expression);
    if (!ts.isIdentifier(callee) || callee.text !== "defineNodes") {
      ts.forEachChild(node, visit);
      return;
    }

    const firstArg = currentNode.arguments[0];
    if (!firstArg) {
      failAtNode(sourceFile, currentNode, "defineNodes(...) requires an array argument");
    }

    const arg = unwrapExpression(firstArg);
    if (!ts.isArrayLiteralExpression(arg)) {
      failAtNode(
        sourceFile,
        firstArg,
        "defineNodes argument must be a literal array in this converter",
      );
    }

    foundArrayLiteral = arg;
  };

  ts.forEachChild(sourceFile, visit);

  if (!foundArrayLiteral) {
    fail('Could not find a "defineNodes([...])" call in the input file');
  }

  return foundArrayLiteral;
};

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
        indegreeById.set(child.nodeId, (indegreeById.get(child.nodeId) ?? 0) + 1);
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
        const currentDepth = depthById.get(child.nodeId) ?? Number.NEGATIVE_INFINITY;
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

    const sortedDepths = [...nodeIdsByDepth.keys()].sort((left, right) => left - right);
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

    componentOffsetX += Math.max(1, maxRowLength) * HORIZONTAL_GAP + HORIZONTAL_GAP;
  }

  return layoutById;
};

const main = async () => {
  const { inPath, outPath } = parseArgs();
  const VerificationSchema = await loadVerificationSchema();
  const absoluteInPath = path.resolve(inPath);
  const absoluteOutPath = path.resolve(outPath);

  const sourceText = await fs.readFile(absoluteInPath, "utf8");
  const sourceFile = ts.createSourceFile(
    absoluteInPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const nodesArrayLiteral = findDefineNodesArrayLiteral(sourceFile);
  const parsedNodesValue = parseLiteralExpression(sourceFile, nodesArrayLiteral);

  if (!Array.isArray(parsedNodesValue)) {
    fail("defineNodes argument must resolve to an array literal");
  }

  const validatedNodes = VerificationSchema.safeParse(parsedNodesValue);
  if (!validatedNodes.success) {
    fail(`Input nodes are invalid: ${formatSchemaIssue(validatedNodes.error.issues[0])}`);
  }

  const nodesById = Object.fromEntries(
    validatedNodes.data.map((node) => [node.id, node]),
  );

  const draft = {
    format: DRAFT_FORMAT,
    version: DRAFT_VERSION,
    nodesById,
    layoutById: buildLayoutById(validatedNodes.data),
  };

  await fs.mkdir(path.dirname(absoluteOutPath), { recursive: true });
  await fs.writeFile(
    absoluteOutPath,
    `${JSON.stringify(draft, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Wrote draft with ${validatedNodes.data.length} nodes to "${absoluteOutPath}" from "${absoluteInPath}"`,
  );
};

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Unknown CLI failure");
});

#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

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
      "Usage: pnpm ndg:nodes-to-editor --in <input-nodes.ts> --out <output.ndg.json>",
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

// --- TypeScript AST ---

const failAt = (sf, node, msg) => {
  const { line, character } = sf.getLineAndCharacterOfPosition(
    node.getStart(sf),
  );
  fail(`${msg} (${sf.fileName}:${line + 1}:${character + 1})`);
};

const unwrap = expr => {
  let n = expr;
  while (
    ts.isParenthesizedExpression(n) ||
    ts.isAsExpression(n) ||
    ts.isSatisfiesExpression(n) ||
    ts.isNonNullExpression(n)
  )
    n = n.expression;
  return n;
};

const parseLiteral = (sf, expr) => {
  const n = unwrap(expr);
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n))
    return n.text;
  if (ts.isNumericLiteral(n)) return Number(n.text);
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (n.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isPrefixUnaryExpression(n) &&
    n.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(n.operand)
  )
    return -Number(n.operand.text);
  if (ts.isArrayLiteralExpression(n))
    return n.elements.map(el => {
      if (ts.isSpreadElement(el))
        failAt(sf, el, "Spread not supported in defineNodes");
      return parseLiteral(sf, el);
    });
  if (ts.isObjectLiteralExpression(n))
    return Object.fromEntries(
      n.properties.map(prop => {
        if (!ts.isPropertyAssignment(prop))
          failAt(sf, prop, "Only plain properties supported in defineNodes");
        const { name } = prop;
        const key =
          ts.isIdentifier(name) ||
          ts.isStringLiteral(name) ||
          ts.isNumericLiteral(name)
            ? name.text
            : failAt(sf, name, "Unsupported property key in defineNodes");
        return [key, parseLiteral(sf, prop.initializer)];
      }),
    );
  failAt(sf, n, "Unsupported expression in defineNodes");
};

const findDefineNodesArg = sf => {
  let found = null;
  const visit = node => {
    if (found) return;
    const n = unwrap(node);
    if (ts.isCallExpression(n)) {
      const callee = unwrap(n.expression);
      if (ts.isIdentifier(callee) && callee.text === "defineNodes") {
        const arg = n.arguments[0];
        if (!arg) failAt(sf, n, "defineNodes() requires an argument");
        const inner = unwrap(arg);
        if (!ts.isArrayLiteralExpression(inner))
          failAt(sf, arg, "defineNodes argument must be a literal array");
        found = inner;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sf, visit);
  if (!found) fail('Could not find "defineNodes([...])" in the input file');
  return found;
};

// --- Layout ---

// BFS depth from check root; unreachable nodes placed below the graph.
const buildLayout = nodes => {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const depth = new Map();
  const root = nodes.find(n => n.type === "check");

  if (root) {
    const queue = [root.id];
    depth.set(root.id, 0);
    while (queue.length) {
      const id = queue.shift();
      for (const { nodeId } of byId.get(id)?.children ?? []) {
        const d = (depth.get(id) ?? 0) + 1;
        if (d > (depth.get(nodeId) ?? -1)) {
          depth.set(nodeId, d);
          queue.push(nodeId);
        }
      }
    }
  }

  const maxDepth = depth.size ? Math.max(...depth.values()) : 0;
  for (const n of nodes) if (!depth.has(n.id)) depth.set(n.id, maxDepth + 2);

  const rows = new Map();
  for (const [id, d] of depth) {
    const row = rows.get(d) ?? [];
    row.push(id);
    rows.set(d, row);
  }

  const layout = {};
  for (const [d, ids] of rows)
    ids.forEach((id, i) => {
      layout[id] = { x: i * 320, y: d * 220 };
    });
  return layout;
};

// --- Conversion ---

// NDG children → editor edges; child.when maps to edge.data.condition.
const toEditorDoc = (nodes, layout) => ({
  version: 2,
  nodes: nodes.map(({ id, type, children: _, ...data }) => ({
    id,
    position: layout[id] ?? { x: 0, y: 0 },
    type,
    data,
  })),
  edges: nodes.flatMap(n =>
    n.children.map(c => ({
      id: `${n.id}__to__${c.nodeId}`,
      source: n.id,
      target: c.nodeId,
      ...(c.when !== undefined ? { data: { condition: c.when } } : {}),
    })),
  ),
});

// --- Main ---

const main = async () => {
  const { inPath, outPath } = parseArgs();
  const NDGSchema = await loadNDGSchema();

  const sf = ts.createSourceFile(
    inPath,
    await fs.readFile(inPath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const parsed = parseLiteral(sf, findDefineNodesArg(sf));
  if (!Array.isArray(parsed))
    fail("defineNodes argument must be an array literal");

  const result = NDGSchema.safeParse(parsed);
  if (!result.success) {
    const { path: p, message } = result.error.issues[0];
    fail(`Invalid nodes — ${p.length ? p.join(".") : "<root>"}: ${message}`);
  }

  const editorDoc = toEditorDoc(result.data, buildLayout(result.data));
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(
    outPath,
    `${JSON.stringify(editorDoc, null, 2)}\n`,
    "utf8",
  );
  console.log(
    `Wrote editor document with ${result.data.length} nodes to "${outPath}"`,
  );
};

main().catch(e => fail(e instanceof Error ? e.message : String(e)));

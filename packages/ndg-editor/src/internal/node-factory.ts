import type { Node, NodeMeta, NodeType } from "@ndg/ndg-core";

export type EditorNode = Node;

export type NodeDraft = {
  nodeType: NodeType;
  name: string;
  key: string;
  symbol: string;
  description: string;
  unit: string;
  valueType: "number" | "string";
  allowedValues: string;
  expression: string;
  verificationExpression: string;
  source: string;
  sectionRef: string;
  paragraphRef: string;
  subParagraphRef: string;
  formulaRef: string;
  tableRef: string;
  verificationRef: string;
};

type BuildNodeResult =
  | { error: string; node: null }
  | { error: null; node: Node };

const nodeTypeLabels: Record<NodeType, string> = {
  check: "Check",
  coefficient: "Coefficient",
  constant: "Constant",
  derived: "Derived",
  formula: "Formula",
  table: "Table",
  "user-input": "User input",
};

const numericOnlyNodeTypes: readonly NodeType[] = [
  "check",
  "coefficient",
  "constant",
  "formula",
];

export const nodeTypeOptions = [
  { label: "Check", value: "check" },
  { label: "Formula", value: "formula" },
  { label: "Derived", value: "derived" },
  { label: "Table", value: "table" },
  { label: "Coefficient", value: "coefficient" },
  { label: "User input", value: "user-input" },
  { label: "Constant", value: "constant" },
] as const;

const trimText = (value: string) => value.trim();
const normalizeInlineExpression = (value: string) =>
  trimText(value.replace(/\s*[\r\n]+\s*/g, " "));

const getOptionalText = (value: string) => {
  const trimmed = trimText(value);
  return trimmed ? trimmed : undefined;
};

const getKeyPrefix = (nodeType: NodeType) => nodeType.replace(/-/g, "_");

const getUniqueKey = (
  nodesById: Map<string, EditorNode>,
  nodeType: NodeType,
  ignoredNodeId?: string,
) => {
  const existingKeys = new Set(
    [...nodesById.values()]
      .filter((node) => node.id !== ignoredNodeId)
      .map((node) => trimText(node.key))
      .filter(Boolean),
  );

  const prefix = getKeyPrefix(nodeType);
  let index = 1;

  while (existingKeys.has(`${prefix}_${index}`)) {
    index += 1;
  }

  return `${prefix}_${index}`;
};

const formatAllowedValues = (
  oneOf: readonly string[] | readonly number[] | undefined,
) => (oneOf ? oneOf.join(", ") : "");

const parseNumberAllowedValues = (allowedValues: string) => {
  const trimmed = trimText(allowedValues);
  if (!trimmed) {
    return {
      error: null,
      oneOf: undefined,
    } as const;
  }

  const parts = trimmed
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const parsedValues = parts.map((value) => Number(value));
  if (parsedValues.some((value) => Number.isNaN(value))) {
    return {
      error: "Allowed values must be a comma-separated list of numbers.",
      oneOf: undefined,
    } as const;
  }

  return {
    error: null,
    oneOf: parsedValues,
  } as const;
};

const parseStringAllowedValues = (allowedValues: string) => {
  const trimmed = trimText(allowedValues);
  if (!trimmed) {
    return {
      error: null,
      oneOf: undefined,
    } as const;
  }

  return {
    error: null,
    oneOf: trimmed
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  } as const;
};

const buildOptionalMeta = (draft: NodeDraft): NodeMeta | undefined => {
  const meta: NodeMeta = {
    formulaRef: getOptionalText(draft.formulaRef),
    paragraphRef: getOptionalText(draft.paragraphRef),
    sectionRef: getOptionalText(draft.sectionRef),
    subParagraphRef: getOptionalText(draft.subParagraphRef),
    tableRef: getOptionalText(draft.tableRef),
    verificationRef: getOptionalText(draft.verificationRef),
  };

  return Object.values(meta).some(Boolean) ? meta : undefined;
};

const buildCoefficientMeta = (draft: NodeDraft): NodeMeta => ({
  formulaRef: getOptionalText(draft.formulaRef),
  paragraphRef: getOptionalText(draft.paragraphRef),
  sectionRef: getOptionalText(draft.sectionRef),
  subParagraphRef: getOptionalText(draft.subParagraphRef),
  tableRef: getOptionalText(draft.tableRef),
  verificationRef: getOptionalText(draft.verificationRef),
});

const buildFormulaMeta = (draft: NodeDraft) => ({
  formulaRef: trimText(draft.formulaRef),
  paragraphRef: getOptionalText(draft.paragraphRef),
  sectionRef: getOptionalText(draft.sectionRef),
  subParagraphRef: getOptionalText(draft.subParagraphRef),
  tableRef: getOptionalText(draft.tableRef),
  verificationRef: getOptionalText(draft.verificationRef),
});

const getDraftCompletenessError = (draft: NodeDraft) => {
  if (draft.nodeType === "check" && !normalizeInlineExpression(draft.verificationExpression)) {
    return "Check nodes require a verification formula";
  }

  if (
    (draft.nodeType === "formula" || draft.nodeType === "derived") &&
    !normalizeInlineExpression(draft.expression)
  ) {
    return "Formula and derived nodes require a formula";
  }

  if (draft.nodeType === "table" && !trimText(draft.source)) {
    return "Table nodes require a source";
  }

  return null;
};

const buildNumberValueType = (allowedValues: string) => {
  const parsedValues = parseNumberAllowedValues(allowedValues);
  if (parsedValues.error) {
    return {
      error: parsedValues.error,
      valueType: null,
    } as const;
  }

  return {
    error: null,
    valueType: parsedValues.oneOf
      ? ({ type: "number", oneOf: parsedValues.oneOf } as const)
      : ({ type: "number" } as const),
  } as const;
};

const buildStringValueType = (allowedValues: string) => {
  const parsedValues = parseStringAllowedValues(allowedValues);
  if (parsedValues.error) {
    return {
      error: parsedValues.error,
      valueType: null,
    } as const;
  }

  return {
    error: null,
    valueType: parsedValues.oneOf
      ? ({ type: "string", oneOf: parsedValues.oneOf } as const)
      : ({ type: "string" } as const),
  } as const;
};

const buildBaseNode = (
  currentNode: EditorNode,
  draft: NodeDraft,
  nodesById: Map<string, EditorNode>,
  nodeType: NodeType,
) => ({
  id: currentNode.id,
  type: nodeType,
  name: trimText(draft.name) || nodeTypeLabels[nodeType],
  key: trimText(draft.key) || getUniqueKey(nodesById, nodeType, currentNode.id),
  symbol: getOptionalText(draft.symbol),
  description: getOptionalText(draft.description),
  children: nodeType === "user-input" ? [] : [...currentNode.children],
});

export const isNumericOnlyNodeType = (nodeType: NodeType) =>
  numericOnlyNodeTypes.includes(nodeType);

export const canNodeHaveChildren = (node: EditorNode) =>
  node.type !== "user-input";

export const createDefaultRootNode = (): Node => ({
  id: globalThis.crypto.randomUUID(),
  type: "check",
  key: "check_1",
  name: "Check",
  children: [],
  valueType: { type: "number" },
  verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
});

export const createDefaultChildNode = (
  nodesById: Map<string, EditorNode>,
): Node => ({
  id: globalThis.crypto.randomUUID(),
  type: "user-input",
  key: getUniqueKey(nodesById, "user-input"),
  name: nodeTypeLabels["user-input"],
  children: [],
  valueType: { type: "number" },
});

export const createNodeDraft = (node: EditorNode): NodeDraft => {
  const meta = "meta" in node ? node.meta : undefined;

  const commonDraft = {
    nodeType: node.type,
    name: node.name,
    key: node.key,
    symbol: node.symbol ?? "",
    description: node.description ?? "",
    unit: "unit" in node ? node.unit ?? "" : "",
    valueType: node.valueType.type,
    allowedValues: formatAllowedValues(node.valueType.oneOf),
    expression: "",
    verificationExpression: "",
    source: "",
    sectionRef: meta?.sectionRef ?? "",
    paragraphRef: meta?.paragraphRef ?? "",
    subParagraphRef: meta?.subParagraphRef ?? "",
    formulaRef: meta?.formulaRef ?? "",
    tableRef: meta?.tableRef ?? "",
    verificationRef: meta?.verificationRef ?? "",
  } satisfies NodeDraft;

  switch (node.type) {
    case "check":
      return {
        ...commonDraft,
        verificationExpression: node.verificationExpression,
      };
    case "formula":
      return {
        ...commonDraft,
        expression: node.expression,
      };
    case "derived":
      return {
        ...commonDraft,
        expression: node.expression ?? "",
      };
    case "table":
      return {
        ...commonDraft,
        source: node.source,
      };
    case "coefficient":
    case "user-input":
    case "constant":
      return commonDraft;
  }
};

export const buildNodeFromDraft = ({
  currentNode,
  draft,
  nodesById,
}: {
  currentNode: EditorNode;
  draft: NodeDraft;
  nodesById: Map<string, EditorNode>;
}): BuildNodeResult => {
  const nodeType = draft.nodeType;
  const draftCompletenessError = getDraftCompletenessError(draft);
  if (draftCompletenessError) {
    return {
      error: draftCompletenessError,
      node: null,
    };
  }

  const baseNode = buildBaseNode(currentNode, draft, nodesById, nodeType);

  switch (nodeType) {
    case "check": {
      const numberValueType = buildNumberValueType(draft.allowedValues);
      if (numberValueType.error) {
        return {
          error: numberValueType.error,
          node: null,
        };
      }

      return {
        error: null,
        node: {
          ...baseNode,
          type: "check",
          valueType: numberValueType.valueType,
          meta: buildOptionalMeta(draft),
          verificationExpression: normalizeInlineExpression(
            draft.verificationExpression,
          ),
        },
      };
    }
    case "formula": {
      const numberValueType = buildNumberValueType(draft.allowedValues);
      if (numberValueType.error) {
        return {
          error: numberValueType.error,
          node: null,
        };
      }

      const unit = getOptionalText(draft.unit);

      return {
        error: null,
        node: {
          ...baseNode,
          type: "formula",
          valueType: numberValueType.valueType,
          meta: buildFormulaMeta(draft),
          expression: normalizeInlineExpression(draft.expression),
          ...(unit ? { unit } : {}),
        },
      };
    }
    case "derived": {
      const valueType =
        draft.valueType === "number"
          ? buildNumberValueType(draft.allowedValues)
          : buildStringValueType(draft.allowedValues);

      if (valueType.error) {
        return {
          error: valueType.error,
          node: null,
        };
      }

      const expression = getOptionalText(
        normalizeInlineExpression(draft.expression),
      );
      const unit = getOptionalText(draft.unit);

      return {
        error: null,
        node: {
          ...baseNode,
          type: "derived",
          valueType: valueType.valueType,
          meta: buildOptionalMeta(draft),
          ...(expression ? { expression } : {}),
          ...(unit ? { unit } : {}),
        },
      };
    }
    case "table": {
      const valueType =
        draft.valueType === "number"
          ? buildNumberValueType(draft.allowedValues)
          : buildStringValueType(draft.allowedValues);

      if (valueType.error) {
        return {
          error: valueType.error,
          node: null,
        };
      }

      const unit = getOptionalText(draft.unit);

      return {
        error: null,
        node: {
          ...baseNode,
          type: "table",
          valueType: valueType.valueType,
          meta: buildOptionalMeta(draft),
          source: trimText(draft.source),
          ...(unit ? { unit } : {}),
        },
      };
    }
    case "coefficient": {
      const numberValueType = buildNumberValueType(draft.allowedValues);
      if (numberValueType.error) {
        return {
          error: numberValueType.error,
          node: null,
        };
      }

      const unit = getOptionalText(draft.unit);

      return {
        error: null,
        node: {
          ...baseNode,
          type: "coefficient",
          valueType: numberValueType.valueType,
          meta: buildCoefficientMeta(draft),
          ...(unit ? { unit } : {}),
        },
      };
    }
    case "user-input": {
      const valueType =
        draft.valueType === "number"
          ? buildNumberValueType(draft.allowedValues)
          : buildStringValueType(draft.allowedValues);

      if (valueType.error) {
        return {
          error: valueType.error,
          node: null,
        };
      }

      const unit = getOptionalText(draft.unit);

      return {
        error: null,
        node: {
          ...baseNode,
          type: "user-input",
          valueType: valueType.valueType,
          ...(unit ? { unit } : {}),
        },
      };
    }
    case "constant": {
      const numberValueType = buildNumberValueType(draft.allowedValues);
      if (numberValueType.error) {
        return {
          error: numberValueType.error,
          node: null,
        };
      }

      return {
        error: null,
        node: {
          ...baseNode,
          type: "constant",
          valueType: numberValueType.valueType,
          symbol: trimText(draft.symbol),
        },
      };
    }
  }
};

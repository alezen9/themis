import type { NodeTypes } from "@xyflow/react";

import { CheckNode } from "../components/nodes/CheckNode";
import { CoefficientNode } from "../components/nodes/CoefficientNode";
import { ConstantNode } from "../components/nodes/ConstantNode";
import { FormulaNode } from "../components/nodes/FormulaNode";
import { TableNode } from "../components/nodes/TableNode";
import { UserInputNode } from "../components/nodes/UserInputNode";

export const nodeTypes = {
  check: CheckNode,
  coefficient: CoefficientNode,
  constant: ConstantNode,
  formula: FormulaNode,
  table: TableNode,
  "user-input": UserInputNode,
} satisfies NodeTypes;

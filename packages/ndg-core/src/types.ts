// ########################################
//              NODE UNION
// ########################################

export type Node =
  | CheckNode
  | FormulaNode
  | UserInputNode
  | TableNode
  | CoefficientNode
  | DerivedCoefficientNode
  | ConstantNode

// ########################################
//              BASE NODE
// ########################################

export type BaseNode = {
  id: NodeId
  label?: string
  children: Child[]
}

export type CheckNode = BaseNode & {
  type: "check"
  meta: NodeMeta
  payload: CheckPayload
}

export type FormulaNode = BaseNode & {
  type: "formula"
  meta: NodeMeta
  payload: FormulaPayload
}

export type UserInputNode = BaseNode & {
  type: "user-input"
  meta?: never
  payload: UserInputPayload
}

export type TableNode = BaseNode & {
  type: "table"
  meta: NodeMeta
  payload: TablePayload
}

export type CoefficientNode = BaseNode & {
  type: "coefficient"
  meta: NodeMeta
  payload: CoefficientPayload
}

export type DerivedCoefficientNode = BaseNode & {
  type: "derived-coefficient"
  meta: NodeMeta
  payload: DerivedCoefficientPayload
}

export type ConstantNode = BaseNode & {
  type: "constant"
  meta?: never
  payload: ConstantPayload
}

// ########################################
//              CHILD
// ########################################

export type Child = {
  nodeId: NodeId
  when?: Condition
}

// ########################################
//              PAYLOAD
// ########################################

export type CheckPayload = {
  label: string
  verificationExpression: string
  description?: string
}

export type FormulaPayload = {
  key: string
  latex: string
  unit?: string
}

export type UserInputPayload = {
  key: string
  label?: string
  value: number
  unit: string
}

export type TablePayload = {
  tableKey: string
  selectedRow?: string
  selectedColumn?: string
  unit?: string
}

export type CoefficientPayload = {
  key: string
  value: number
  unit?: string
}

export type DerivedCoefficientPayload = {
  key: string
  latex?: string
  unit?: string
}

export type ConstantPayload = {
  key: string
  value: number
  description?: string
}

// ########################################
//              PROPERTIES
// ########################################

export type NodeId = string

export type Condition =
  | { eq: [string, unknown] }
  | { lt: [string, number] }
  | { lte: [string, number] }
  | { gt: [string, number] }
  | { gte: [string, number] }
  | { and: Condition[] }
  | { or: Condition[] }

export type NodeMeta = {
  sectionId?: string
  paragraphId?: string
  subParagraphId?: string
  formulaId?: string
  verificationConditionId?: string
  tableId?: string
}

export type NodeType =
  | "check"
  | "user-input"
  | "formula"
  | "table"
  | "coefficient"
  | "derived-coefficient"
  | "constant"

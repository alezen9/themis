import type { Condition, ConditionTuple } from "@ndg/ndg-core";
import { Fragment, type ReactNode } from "react";

import { formatOperand, OPERATOR_SYMBOL } from "./format";

const renderComparison = (
  operator: keyof typeof OPERATOR_SYMBOL,
  [key, operand]: ConditionTuple,
) => (
  <span className="text-purple-700">
    {key} {OPERATOR_SYMBOL[operator]} {formatOperand(operand)}
  </span>
);

const wrapNested = (condition: Condition): ReactNode => {
  if ("and" in condition || "or" in condition)
    return (
      <>
        <span className="text-sand-400">(</span>
        {renderCondition(condition)}
        <span className="text-sand-400">)</span>
      </>
    );
  return renderCondition(condition);
};

const renderGroup = (
  conditions: readonly Condition[],
  connective: string,
): ReactNode =>
  conditions.map((condition, index) => (
    // eslint-disable-next-line @eslint-react/no-array-index-key -- static, non-reordered render of a condition tree
    <Fragment key={index}>
      {index > 0 && (
        <span className="font-semibold text-sand-500"> {connective} </span>
      )}
      {wrapNested(condition)}
    </Fragment>
  ));

const renderCondition = (condition: Condition): ReactNode => {
  if ("eq" in condition) return renderComparison("eq", condition.eq);
  if ("ne" in condition) return renderComparison("ne", condition.ne);
  if ("lt" in condition) return renderComparison("lt", condition.lt);
  if ("lte" in condition) return renderComparison("lte", condition.lte);
  if ("gt" in condition) return renderComparison("gt", condition.gt);
  if ("gte" in condition) return renderComparison("gte", condition.gte);
  if ("and" in condition) return renderGroup(condition.and, "AND");
  return renderGroup(condition.or, "OR");
};

export const ConditionText = (props: { condition: Condition }) => (
  <span className="font-mono">{renderCondition(props.condition)}</span>
);

import type { NDGValue, NodeMeta } from "@ndg/ndg-core";
import type { VerificationRow } from "@ndg/ndg-ec3-1-1";
import { twMerge } from "tailwind-merge";

import { Drawer } from "@components/Drawer";
import { Latex } from "@components/Latex";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { formatNumber } from "@formatters/number";

import {
  InfoTable,
  InfoTableHeaderCell,
  InfoTableLabelCell,
  InfoTableUnitCell,
  InfoTableValueCell,
} from "../Form/shared";

type VerificationTraceDrawerProps = {
  verification?: VerificationRow;
  onClose: () => void;
};

export const VerificationTraceDrawer = (
  props: VerificationTraceDrawerProps,
) => {
  const { verification, onClose } = props;

  return (
    <Drawer
      open={!!verification}
      onOpenChange={open => {
        if (!open) onClose();
      }}
      title={verification?.name}
    >
      {verification && <VerificationTrace verification={verification} />}
    </Drawer>
  );
};

const formatValue = (value: NDGValue) =>
  typeof value === "number" ? formatNumber(value) : value;

const stepEquation = (
  symbol: string | undefined,
  expression: string,
  value: NDGValue,
  unit: string | undefined,
) => {
  const lhs = symbol ? `${symbol} = ` : "";
  const tail = unit ? `\\,${unit}` : "";
  return `${lhs}${expression} = \\text{${formatValue(value)}}${tail}`;
};

const clauseRef = (meta: NodeMeta | undefined) => {
  if (!meta) return undefined;
  const parts: string[] = [];
  if (meta.sectionRef) parts.push(`§${meta.sectionRef}`);
  if (meta.formulaRef) parts.push(meta.formulaRef);
  return parts.length > 0 ? parts.join(" · ") : undefined;
};

type VerificationTraceProps = { verification: VerificationRow };

const VerificationTrace = (props: VerificationTraceProps) => {
  const { verification } = props;
  const { payload } = verification;

  if (payload.error)
    return <p className="text-sm text-red-700">{payload.error.message}</p>;

  const { check, passed, ratio, trace } = payload.data;

  const values = trace.flatMap(entry =>
    entry.symbol === undefined
      ? []
      : [
          {
            id: entry.nodeId,
            symbol: entry.symbol,
            value: entry.value,
            unit: entry.unit,
          },
        ],
  );

  const steps = trace.flatMap(entry =>
    entry.expression === undefined
      ? []
      : [
          {
            id: entry.nodeId,
            symbol: entry.symbol,
            expression: entry.expression,
            value: entry.value,
            unit: entry.unit,
            ref: clauseRef(entry.meta),
          },
        ],
  );

  return (
    <div className="flex flex-col gap-8 text-sand-900">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <span
            className={twMerge(
              "inline-flex items-center rounded-sm px-3 py-1 text-sm font-semibold",
              passed ? "bg-envy-100 text-envy-900" : "bg-red-100 text-red-800",
            )}
          >
            {passed ? "Pass" : "Fail"}
          </span>
          <span className="text-sm text-sand-600">
            Utilisation{" "}
            <span className="font-semibold tabular-nums text-sand-900">
              {formatNumber(ratio)}
            </span>
          </span>
        </div>
        <Latex
          displayMode
          tex={check.verificationExpression}
          className="justify-start text-2xl"
        />
      </div>

      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Values</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map(value => (
            <TableRow key={value.id}>
              <InfoTableLabelCell>
                <Latex tex={value.symbol} />
              </InfoTableLabelCell>
              <InfoTableValueCell>
                {formatValue(value.value)}
              </InfoTableValueCell>
              <InfoTableUnitCell>
                {value.unit && <Latex tex={value.unit} />}
              </InfoTableUnitCell>
            </TableRow>
          ))}
        </TableBody>
      </InfoTable>

      <div className="flex flex-col gap-3">
        {steps.map(step => (
          <div
            key={step.id}
            className="rounded-sm border border-sand-200 bg-white p-4"
          >
            {step.ref && (
              <p className="mb-3 text-xs tracking-widest text-sand-500 uppercase">
                {step.ref}
              </p>
            )}
            <Latex
              displayMode
              tex={stepEquation(
                step.symbol,
                step.expression,
                step.value,
                step.unit,
              )}
              className="justify-start text-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

import type { NDGValue, NodeMeta } from "@ndg/ndg-core";
import type { VerificationRow } from "@ndg/ndg-ec3-1-1";
import { twMerge } from "tailwind-merge";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@components/Drawer";
import { Latex } from "@components/Latex";
import { TableBody, TableRow } from "@components/Table";
import { formatNumber } from "@formatters/number";

import {
  InfoTable,
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
  const data = verification?.payload.data;

  const hasPassed = !!data?.passed;

  return (
    <Drawer
      open={!!verification}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DrawerHeader>
        <DrawerTitle>{verification?.name}</DrawerTitle>
        <div className="flex items-center justify-between">
          <span
            className={twMerge(
              "rounded-sm px-4 text-center",
              hasPassed && "bg-envy-100 text-envy-700",
              !hasPassed && "bg-red-100 text-red-700",
            )}
          >
            {hasPassed ? "Pass" : "Fail"}
          </span>
          <span className="font-light tabular-nums text-sand-900 text-3xl">
            {formatNumber(data?.ratio ?? 0)}
          </span>
        </div>
      </DrawerHeader>
      <DrawerContent>
        {verification && <VerificationTrace verification={verification} />}
      </DrawerContent>
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

  const { check, trace } = payload.data;

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
  values.sort((a, b) => {
    if (a.unit === b.unit) return 0;
    if (a.unit === undefined) return 1;
    if (b.unit === undefined) return -1;
    return a.unit.localeCompare(b.unit);
  });

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
    <div className="flex flex-col gap-6 text-sand-900">
      <div className="rounded-md border border-sand-100 bg-sand-50 p-5">
        <Latex
          displayMode
          tex={check.verificationExpression}
          className="justify-start text-3xl"
        />
      </div>

      <Accordion>
        <AccordionHeader className="px-0 py-2">
          <span className="text-xs font-semibold tracking-widest text-sand-600 uppercase">
            Values
          </span>
        </AccordionHeader>
        <AccordionContent className="px-0">
          <InfoTable>
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
        </AccordionContent>
      </Accordion>

      <div className="flex flex-col gap-3">
        {steps.map(step => (
          <div
            key={step.id}
            className="overflow-hidden rounded-md border border-sand-100 bg-sand-50"
          >
            {step.ref && (
              <div className="border-b border-sand-100 bg-sand-100 px-4 py-2 text-xs font-semibold tracking-widest text-sand-600 uppercase">
                {step.ref}
              </div>
            )}
            <div className="p-4">
              <Latex
                displayMode
                tex={stepEquation(
                  step.symbol,
                  step.expression,
                  step.value,
                  step.unit,
                )}
                className="justify-start text-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

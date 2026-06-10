import type { NodeMeta } from "@ndg/ndg-core";
import { applyDisplayUnit, type VerificationRow } from "@ndg/ndg-ec3-1-1";
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
import { formatValue, stepEquation } from "./traceEquation";

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
      className="max-w-max"
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
            {formatNumber(data?.utilisation ?? 0)}
          </span>
        </div>
      </DrawerHeader>
      <DrawerContent>
        {verification && <VerificationTrace verification={verification} />}
      </DrawerContent>
    </Drawer>
  );
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

  const reversedTrace = [...trace].reverse();
  const entryByKey = new Map(trace.map(entry => [entry.key, entry]));
  const absorbedKeys = new Set(
    trace.flatMap(entry => (entry.resolvedFrom ? [entry.resolvedFrom] : [])),
  );

  const checkEntry = trace.find(entry => entry.nodeId === check.id);
  const checkTex =
    checkEntry?.template &&
    stepEquation(
      {
        symbol: checkEntry.symbol,
        template: checkEntry.template,
        value: checkEntry.value,
        key: checkEntry.key,
        displayUnit: checkEntry.displayUnit,
      },
      entryByKey,
    );

  const values = reversedTrace.flatMap(entry => {
    if (
      !entry.symbol ||
      entry.nodeId === check.id ||
      absorbedKeys.has(entry.key)
    )
      return [];
    const { value, tex } = applyDisplayUnit(
      entry.value,
      entry.key,
      entry.displayUnit,
    );
    return [{ id: entry.nodeId, symbol: entry.symbol, value, unit: tex }];
  });

  const steps = reversedTrace.flatMap(entry =>
    !entry.template || entry.nodeId === check.id || absorbedKeys.has(entry.key)
      ? []
      : [
          {
            id: entry.nodeId,
            symbol: entry.symbol,
            template: entry.template,
            value: entry.value,
            key: entry.key,
            displayUnit: entry.displayUnit,
            ref: clauseRef(entry.meta),
          },
        ],
  );

  return (
    <div className="flex flex-col gap-6 text-sand-900">
      {checkTex && (
        <div className="rounded-md border border-sand-100 bg-sand-50 p-5">
          <Latex displayMode tex={checkTex} className="text-3xl" />
        </div>
      )}

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
                tex={stepEquation(step, entryByKey)}
                className="text-2xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

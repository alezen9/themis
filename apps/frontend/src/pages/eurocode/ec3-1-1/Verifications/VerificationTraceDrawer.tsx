import { scaleToUnit, type NodeMeta } from "@ndg/ndg-core";
import type { VerificationRow } from "@ndg/ndg-ec3-1-1";
import { useState, type MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

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
import {
  buildStepParts,
  formatValue,
  tagVar,
  varClass,
  type StepParts,
} from "./traceEquation";

type Status = "pass" | "fail" | "error";

const clauseRef = (meta: NodeMeta | undefined) => {
  if (!meta) return undefined;
  const parts: string[] = [];
  if (meta.sectionRef) parts.push(`§${meta.sectionRef}`);
  if (meta.formulaRef) parts.push(meta.formulaRef);
  return parts.length > 0 ? parts.join(" · ") : undefined;
};

type VerificationTraceDrawerProps = {
  verification?: VerificationRow;
  onClose: () => void;
};

export const VerificationTraceDrawer = (
  props: VerificationTraceDrawerProps,
) => {
  const { verification, onClose } = props;
  const payload = verification?.payload;
  const data = payload?.data;

  const status: Status = payload?.error
    ? "error"
    : data?.passed
      ? "pass"
      : "fail";

  const checkEntry = data?.trace.find(entry => entry.nodeId === data.check.id);
  const clause = clauseRef(checkEntry?.meta);

  return (
    <Drawer
      className="w-[640px] max-w-[640px]"
      open={!!verification}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DrawerHeader
        className={twMerge(
          "gap-4 border-b-0",
          status === "pass" && "bg-envy-50",
          status === "fail" && "bg-red-50",
          status === "error" && "bg-sand-50",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {status !== "error" && (
            <span
              className={twMerge(
                "text-5xl font-light tabular-nums leading-none",
                status === "pass" ? "text-envy-700" : "text-red-600",
              )}
            >
              {formatNumber(data?.utilisation ?? 0)}
            </span>
          )}
          <StatusPill status={status} />
        </div>
        <div className="flex flex-col gap-1">
          <DrawerTitle>{verification?.name}</DrawerTitle>
          {clause && <span className="text-xs text-sand-500">{clause}</span>}
        </div>
      </DrawerHeader>
      <DrawerContent>
        {verification && <VerificationTrace verification={verification} />}
      </DrawerContent>
    </Drawer>
  );
};

const StatusPill = (props: { status: Status }) => {
  const { status } = props;
  const label =
    status === "pass" ? "Pass" : status === "fail" ? "Fail" : "Unavailable";

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium",
        status === "pass" && "bg-envy-100 text-envy-700",
        status === "fail" && "bg-red-100 text-red-700",
        status === "error" && "bg-sand-100 text-sand-600",
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
};

type VerificationTraceProps = { verification: VerificationRow };

const VerificationTrace = (props: VerificationTraceProps) => {
  const { verification } = props;
  const { payload } = verification;

  const [pinned, setPinned] = useState<ReadonlySet<string>>(() => new Set());

  if (payload.error)
    return <p className="text-sm text-sand-600">{payload.error.message}</p>;

  const { check, trace } = payload.data;

  const entryByKey = new Map(trace.map(entry => [entry.key, entry]));
  const absorbedKeys = new Set(
    trace.flatMap(entry => (entry.resolvedFrom ? [entry.resolvedFrom] : [])),
  );

  const checkEntry = trace.find(entry => entry.nodeId === check.id);
  const resultEntry = checkEntry?.template
    ? checkEntry
    : trace.find(entry => entry.nodeId === checkEntry?.children[0]);
  const checkParts = resultEntry && {
    ...buildStepParts(resultEntry, entryByKey),
    symbolTex: tagVar(check.key, checkEntry?.symbol ?? "u_r"),
  };
  const hiddenIds = new Set([check.id, resultEntry?.nodeId]);

  const values = trace.flatMap(entry => {
    if (
      !entry.symbol ||
      hiddenIds.has(entry.nodeId) ||
      absorbedKeys.has(entry.key)
    )
      return [];
    const { value, tex } = scaleToUnit(
      entry.value,
      entry.key,
      entry.displayUnit,
    );
    return [
      {
        id: entry.nodeId,
        key: entry.key,
        symbol: entry.symbol,
        value,
        unit: tex,
      },
    ];
  });

  const steps = [...trace]
    .reverse()
    .filter(
      entry =>
        entry.template &&
        !hiddenIds.has(entry.nodeId) &&
        !absorbedKeys.has(entry.key),
    );

  const togglePin = (cls: string) =>
    setPinned(current => {
      const next = new Set(current);
      if (next.has(cls)) next.delete(cls);
      else next.add(cls);
      return next;
    });
  const onFormulaClick = (event: MouseEvent<HTMLDivElement>) => {
    const element = (event.target as Element).closest('[class*="var-"]');
    const cls = element
      ? Array.from(element.classList).find(name => name.startsWith("var-"))
      : undefined;
    if (cls) togglePin(cls);
  };

  const badge = (selector: string) =>
    `${selector} rect[data-bgcolor]{fill:var(--color-plum-400);rx:4px}` +
    `${selector}{color:var(--color-plum-50)}`;
  const hoverCss = [...new Set(trace.map(entry => varClass(entry.key)))]
    .map(
      cls =>
        badge(`.trace-scope:has(.${cls}:hover) .trace-formula .${cls}`) +
        `.trace-scope:has(.${cls}:hover) tr.${cls}{background-color:var(--color-plum-100)}`,
    )
    .join("");
  const pinCss = [...pinned]
    .map(
      cls =>
        badge(`.trace-formula .${cls}`) +
        `tr.${cls}{background-color:var(--color-plum-100)}`,
    )
    .join("");

  return (
    <div className="trace-scope flex flex-col gap-6 text-sand-900">
      <style>{hoverCss + pinCss}</style>

      <InfoTable>
        <TableBody>
          {values.map(value => {
            const cls = varClass(value.key);
            return (
              <TableRow
                key={value.id}
                onClick={() => togglePin(cls)}
                className={twMerge(cls, "cursor-pointer")}
              >
                <InfoTableLabelCell>
                  <Latex tex={tagVar(value.key, value.symbol)} />
                </InfoTableLabelCell>
                <InfoTableValueCell>
                  {formatValue(value.value)}
                </InfoTableValueCell>
                <InfoTableUnitCell>
                  {value.unit && <Latex tex={value.unit} />}
                </InfoTableUnitCell>
              </TableRow>
            );
          })}
        </TableBody>
      </InfoTable>

      {checkParts && (
        <div className="overflow-x-auto rounded-md border border-sand-100 bg-sand-50 px-4 py-3">
          <TraceStep parts={checkParts} onClick={onFormulaClick} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {steps.map(step => {
          const ref = clauseRef(step.meta);
          return (
            <div
              key={step.nodeId}
              className="flex flex-col gap-2 rounded-md border border-sand-100 px-4 py-3"
            >
              {ref && (
                <span className="self-end rounded bg-sand-100 px-1.5 py-0.5 text-[10px] tracking-wide text-sand-500 uppercase">
                  {ref}
                </span>
              )}
              <div className="overflow-x-auto">
                <TraceStep
                  parts={buildStepParts(step, entryByKey)}
                  onClick={onFormulaClick}
                />
              </div>
              {step.description && (
                <p className="text-xs text-sand-600">{step.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const alignedTex = (parts: StepParts) => {
  const lines = [parts.symbolicTex, parts.numericTex, parts.resultTex].filter(
    (line, index, all) => !!line && line !== all[index - 1],
  );
  const [first, ...rest] = lines;
  const body = [
    `${parts.symbolTex} &= ${first}`,
    ...rest.map(line => `&= ${line}`),
  ].join(" \\\\[0.45em] ");

  return `\\displaystyle\\begin{aligned} ${body} \\end{aligned}`;
};

type TraceStepProps = {
  parts: StepParts;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

const TraceStep = (props: TraceStepProps) => {
  const { parts, onClick } = props;

  return (
    <div className="trace-formula w-fit" onClick={onClick}>
      <Latex tex={alignedTex(parts)} className="text-xl" />
    </div>
  );
};

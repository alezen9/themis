import { SubmitEvent, useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { Button } from "@components/Button";
import { InputTextarea } from "@components/inputs/InputTextarea";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@components/Table";

import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import {
  tableKeyValues,
  tableKeys,
  userInputKeys,
} from "../../document/keyCatalog";
import { userInputCatalog } from "../../document/userInputCatalog";
import { ConditionText } from "../../conditions/ConditionText";
import { formatCondition } from "../../conditions/format";
import { parseCondition, type ParseResult } from "../../conditions/parse";
import { findUnknownConditionKeys } from "../../conditions/validate";

type KeyRow = { key: string; values: string };

const formatValues = (values: readonly (string | number | boolean)[]) =>
  values.map(v => (typeof v === "string" ? `"${v}"` : String(v))).join(", ");

const describeInputKey = (key: string) => {
  const entry = userInputCatalog[key];
  if (!entry) return "";
  if (entry.values) return formatValues(entry.values);
  if (entry.valueType === "number")
    return entry.positive ? "positive number" : "number";
  return "string";
};

export const EditEdgeModal = () => {
  const modal = useNdgEditorModalStore(s => s.modal);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const edgeId = modal?.mode === "edit-edge" ? modal.edgeId : undefined;

  return (
    <Dialog
      open={edgeId !== undefined}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Edge condition</DialogTitle>
          <Button type="submit" form="edit-edge-form">
            Save
          </Button>
        </DialogHeader>
      }
    >
      <DialogContent className="gap-4">
        {edgeId !== undefined && (
          <EditEdgeForm key={edgeId} edgeId={edgeId} onClose={closeModal} />
        )}
      </DialogContent>
    </Dialog>
  );
};

const EditEdgeForm = (props: { edgeId: string; onClose: () => void }) => {
  const { edgeId, onClose } = props;
  const getEdgeById = useNdgEditorStore(s => s.getEdgeById);
  const setEdgeCondition = useNdgEditorStore(s => s.setEdgeCondition);
  const nodes = useNdgEditorStore(s => s.nodes);

  const savedCondition = getEdgeById(edgeId)?.data?.condition;
  const [text, setText] = useState(() => formatCondition(savedCondition));
  const parsed = useMemo(() => parseCondition(text), [text]);

  const inputRows: KeyRow[] = userInputKeys.map(key => ({
    key,
    values: describeInputKey(key),
  }));
  const tableRows: KeyRow[] = tableKeys.map(key => ({
    key,
    values: formatValues(tableKeyValues[key]),
  }));
  const graphRows: KeyRow[] = useMemo(() => {
    const standard = new Set([...userInputKeys, ...tableKeys]);
    const seen = new Set<string>();
    const rows: KeyRow[] = [];
    for (const node of nodes) {
      const key = node.data.key;
      if (standard.has(key) || seen.has(key)) continue;
      seen.add(key);
      rows.push({ key, values: node.data.valueType.type });
    }
    return rows;
  }, [nodes]);

  const availableKeys = new Set([
    ...userInputKeys,
    ...tableKeys,
    ...graphRows.map(row => row.key),
  ]);
  const unknownKeys = parsed.ok
    ? findUnknownConditionKeys(parsed.condition, availableKeys)
    : [];
  const canSave = parsed.ok && unknownKeys.length === 0;

  const onRemove = () => {
    setEdgeCondition(edgeId, undefined);
    onClose();
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    setEdgeCondition(edgeId, parsed.condition);
    onClose();
  };

  return (
    <form
      id="edit-edge-form"
      onSubmit={onSubmit}
      className="flex flex-col gap-4"
    >
      <InputTextarea
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder={'e.g. section_class = 1 AND (shape = "I" OR shape = "H")'}
        spellCheck={false}
        autoFocus
      />
      <ConditionStatus parsed={parsed} unknownKeys={unknownKeys} />
      <p className="text-xs text-sand-600">
        Leave empty to remove the condition.
      </p>
      <Accordion>
        <AccordionHeader iconPosition="left" className="px-0">
          <span className="text-xs text-sand-800">Available keys</span>
        </AccordionHeader>
        <AccordionContent className="px-0">
          <div className="flex flex-col gap-4 pt-2">
            <KeyGroup label="Inputs" rows={inputRows} />
            <KeyGroup label="Tables" rows={tableRows} />
            {graphRows.length > 0 && (
              <KeyGroup label="This graph" rows={graphRows} />
            )}
          </div>
        </AccordionContent>
      </Accordion>
      {savedCondition !== undefined && (
        <Button
          type="button"
          variant="danger"
          onClick={onRemove}
          className="mr-auto"
        >
          Remove
        </Button>
      )}
    </form>
  );
};

const ConditionStatus = (props: {
  parsed: ParseResult;
  unknownKeys: string[];
}) => {
  const { parsed, unknownKeys } = props;

  if (!parsed.ok) return <p className="text-xs text-red-700">{parsed.error}</p>;

  if (!parsed.condition)
    return (
      <p className="text-xs text-sand-600">
        No condition — this link is always active.
      </p>
    );

  if (unknownKeys.length > 0)
    return (
      <p className="text-xs text-red-700">
        Unknown {unknownKeys.length > 1 ? "keys" : "key"}:{" "}
        {unknownKeys.join(", ")}
      </p>
    );

  return (
    <p className="text-xs">
      <ConditionText condition={parsed.condition} />
    </p>
  );
};

const KeyGroup = (props: { label: string; rows: KeyRow[] }) => {
  const { label, rows } = props;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-sand-800">{label}</span>
      <div className="overflow-hidden rounded-sm border border-sand-100">
        <Table className="text-xs [&_tr]:border-sand-400/25">
          <TableHeader>
            <TableRow className="bg-sand-100">
              <TableHeaderCell className="w-64 px-2 py-1 text-xs uppercase tracking-widest text-sand-900">
                Key
              </TableHeaderCell>
              <TableHeaderCell className="px-2 py-1 text-xs uppercase tracking-widest text-sand-900">
                Accepted values
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.key}>
                <TableDataCell className="font-mono text-sand-800">
                  {row.key}
                </TableDataCell>
                <TableDataCell className="font-mono text-sand-600">
                  {row.values}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

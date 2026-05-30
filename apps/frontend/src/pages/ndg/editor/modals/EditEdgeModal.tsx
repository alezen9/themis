import { useEffect, useMemo, useState } from "react";

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

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { tableKeys, userInputKeys } from "../document/keyCatalog";
import { ConditionText } from "../conditions/ConditionText";
import { formatCondition } from "../conditions/format";
import { parseCondition, type ParseResult } from "../conditions/parse";
import { findUnknownConditionKeys } from "../conditions/validate";

export const EditEdgeModal = () => {
  const modal = useNdgEditorModalStore(s => s.modal);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const edgeId = modal?.mode === "edit-edge" ? modal.edgeId : undefined;

  return (
    <Dialog
      open={edgeId !== undefined}
      onOpenChange={closeModal}
      header={
        <DialogHeader>
          <DialogTitle>Edge condition</DialogTitle>
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

  const initialText = useMemo(() => {
    const condition = getEdgeById(edgeId)?.data?.condition;
    return condition ? formatCondition(condition) : "";
  }, [edgeId, getEdgeById]);

  const [text, setText] = useState(initialText);
  const [parsed, setParsed] = useState<ParseResult>(() =>
    parseCondition(initialText),
  );

  const graphKeys = useMemo(() => {
    const standard = new Set([...userInputKeys, ...tableKeys]);
    const keys = new Set(nodes.map(node => node.data.key));
    return [...keys].filter(key => !standard.has(key));
  }, [nodes]);

  const availableKeys = useMemo(
    () => new Set([...userInputKeys, ...tableKeys, ...graphKeys]),
    [graphKeys],
  );

  useEffect(() => {
    const timeout = setTimeout(() => setParsed(parseCondition(text)), 250);
    return () => clearTimeout(timeout);
  }, [text]);

  const unknownKeys = parsed.ok
    ? findUnknownConditionKeys(parsed.condition, availableKeys)
    : [];
  const canSave = parsed.ok && unknownKeys.length === 0;

  const onSave = () => {
    if (!parsed.ok || unknownKeys.length > 0) return;
    setEdgeCondition(edgeId, parsed.condition);
    onClose();
  };

  const onRemove = () => {
    setEdgeCondition(edgeId, undefined);
    onClose();
  };

  return (
    <>
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
      <KeyReference graphKeys={graphKeys} />
      <div className="flex items-center justify-end gap-2">
        {initialText !== "" && (
          <Button
            onClick={onRemove}
            className="mr-auto bg-transparent text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            Remove
          </Button>
        )}
        <Button onClick={onSave} disabled={!canSave}>
          Save
        </Button>
      </div>
    </>
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

const KeyReference = (props: { graphKeys: string[] }) => {
  const { graphKeys } = props;

  return (
    <Accordion>
      <AccordionHeader iconPosition="left" className="px-0">
        <span className="text-xs text-sand-800">Available keys</span>
      </AccordionHeader>
      <AccordionContent className="px-0">
        <div className="flex flex-col gap-2 pt-2">
          <KeyGroup label="Inputs" keys={userInputKeys} />
          <KeyGroup label="Tables" keys={tableKeys} />
          {graphKeys.length > 0 && (
            <KeyGroup label="This graph" keys={graphKeys} />
          )}
        </div>
      </AccordionContent>
    </Accordion>
  );
};

const KeyGroup = (props: { label: string; keys: string[] }) => {
  const { label, keys } = props;

  return (
    <div className="grid grid-cols-[5rem_1fr] gap-2 text-xs">
      <span className="font-medium text-sand-800">{label}</span>
      <span className="font-mono text-sand-600">{keys.join(", ")}</span>
    </div>
  );
};

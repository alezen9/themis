import { useEffect, useState, type ComponentProps } from "react";
import type { Condition } from "@ndg/ndg-core";
import {
  buildConditionFromDraft,
  conditionToDraft,
  createDefaultConditionDraft,
  createDefaultGroupDraft,
  createDefaultRuleDraft,
  withGroup,
  withRule,
  type ComparisonOperator,
  type ConditionDraftEntry,
  type ConditionDraftRule,
  type GroupOperator,
  type OperandMode,
  type OperandValueType,
} from "../condition";

type ConditionPopoverProps = {
  condition?: Condition;
  onApply: (condition: Condition) => void;
  onClear: () => void;
  onClose: () => void;
};

type ConditionEntryEditorProps = {
  entry: ConditionDraftEntry;
  isRoot: boolean;
  parentGroupId?: string;
  onAddGroupToGroup: (groupId: string) => void;
  onAddRuleToGroup: (groupId: string) => void;
  onRemoveFromGroup: (groupId: string, itemId: string) => void;
  onUpdateGroupOperator: (groupId: string, operator: GroupOperator) => void;
  onUpdateRule: (
    ruleId: string,
    updater: (entry: ConditionDraftRule) => ConditionDraftRule,
  ) => void;
  onWrapRootInGroup: (operator: GroupOperator) => void;
};

const inputClassName =
  "w-full rounded-sm border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";

const buttonClassByTone: Record<"neutral" | "danger" | "primary", string> = {
  neutral:
    "border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  danger:
    "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
  primary:
    "border-teal-800 bg-teal-700 text-white hover:border-teal-900 hover:bg-teal-800",
};

const Input = (props: ComponentProps<"input">) => (
  <input className={inputClassName} {...props} />
);

const Select = (props: ComponentProps<"select">) => (
  <select className={inputClassName} {...props} />
);

const Button = ({
  tone = "neutral",
  className,
  ...rest
}: ComponentProps<"button"> & { tone?: "neutral" | "danger" | "primary" }) => (
  <button
    type="button"
    className={`rounded-sm border px-2 py-1 text-[11px] font-semibold transition-colors ${buttonClassByTone[tone]} ${className ?? ""}`}
    {...rest}
  />
);

const operatorOptions: ReadonlyArray<{
  value: ComparisonOperator;
  label: string;
}> = [
  { value: "eq", label: "=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
];

const ConditionEntryEditor = ({
  entry,
  isRoot,
  parentGroupId,
  onAddGroupToGroup,
  onAddRuleToGroup,
  onRemoveFromGroup,
  onUpdateGroupOperator,
  onUpdateRule,
  onWrapRootInGroup,
}: ConditionEntryEditorProps) => {
  if (entry.kind === "group") {
    return (
      <div className="rounded-sm border border-slate-200 bg-white p-2">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-700">Group</span>
          <Select
            value={entry.operator}
            onChange={(event) =>
              onUpdateGroupOperator(entry.id, event.target.value as GroupOperator)
            }
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </Select>
          {!isRoot && parentGroupId && (
            <Button
              tone="danger"
              className="ml-auto"
              onClick={() => onRemoveFromGroup(parentGroupId, entry.id)}
            >
              Remove
            </Button>
          )}
        </div>

        <div className="space-y-2 border-l border-slate-200 pl-2">
          {entry.items.map((item) => (
            <ConditionEntryEditor
              key={item.id}
              entry={item}
              isRoot={false}
              parentGroupId={entry.id}
              onAddGroupToGroup={onAddGroupToGroup}
              onAddRuleToGroup={onAddRuleToGroup}
              onRemoveFromGroup={onRemoveFromGroup}
              onUpdateGroupOperator={onUpdateGroupOperator}
              onUpdateRule={onUpdateRule}
              onWrapRootInGroup={onWrapRootInGroup}
            />
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button onClick={() => onAddRuleToGroup(entry.id)}>+ Rule</Button>
          <Button onClick={() => onAddGroupToGroup(entry.id)}>+ Group</Button>
        </div>
      </div>
    );
  }

  const isNumericComparison = entry.operator !== "eq";

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-2">
      <div className="grid gap-1.5 sm:grid-cols-[1fr_auto]">
        <Input
          value={entry.leftKey}
          placeholder="Left key"
          onChange={(event) =>
            onUpdateRule(entry.id, (currentEntry) => ({
              ...currentEntry,
              leftKey: event.target.value,
            }))
          }
        />
        <Select
          value={entry.operator}
          onChange={(event) =>
            onUpdateRule(entry.id, (currentEntry) => ({
              ...currentEntry,
              operator: event.target.value as ComparisonOperator,
              ...(event.target.value === "eq"
                ? null
                : { rightValueType: "number" as OperandValueType }),
            }))
          }
        >
          {operatorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-1.5 grid gap-1.5 sm:grid-cols-[auto_1fr]">
        <Select
          value={entry.rightMode}
          onChange={(event) =>
            onUpdateRule(entry.id, (currentEntry) => ({
              ...currentEntry,
              rightMode: event.target.value as OperandMode,
              ...(event.target.value === "key"
                ? null
                : {
                    rightValueType:
                      currentEntry.operator === "eq"
                        ? currentEntry.rightValueType
                        : "number",
                  }),
            }))
          }
        >
          <option value="value">value</option>
          <option value="key">key</option>
        </Select>

        {entry.rightMode === "key" && (
          <Input
            value={entry.rightKey}
            placeholder="Right key"
            onChange={(event) =>
              onUpdateRule(entry.id, (currentEntry) => ({
                ...currentEntry,
                rightKey: event.target.value,
              }))
            }
          />
        )}

        {entry.rightMode === "value" && (
          <div className="grid gap-1.5 sm:grid-cols-[auto_1fr]">
            {isNumericComparison && <Input disabled value="number" />}
            {!isNumericComparison && (
              <Select
                value={entry.rightValueType}
                onChange={(event) =>
                  onUpdateRule(entry.id, (currentEntry) => ({
                    ...currentEntry,
                    rightValueType: event.target.value as OperandValueType,
                  }))
                }
              >
                <option value="string">string</option>
                <option value="number">number</option>
              </Select>
            )}

            <Input
              value={entry.rightValue}
              placeholder="Right value"
              inputMode={
                isNumericComparison || entry.rightValueType === "number"
                  ? "decimal"
                  : "text"
              }
              onChange={(event) =>
                onUpdateRule(entry.id, (currentEntry) => ({
                  ...currentEntry,
                  rightValue: event.target.value,
                }))
              }
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap justify-end gap-1.5">
        {!isRoot && parentGroupId && (
          <Button tone="danger" onClick={() => onRemoveFromGroup(parentGroupId, entry.id)}>
            Remove
          </Button>
        )}
        {isRoot && <Button onClick={() => onWrapRootInGroup("and")}>Wrap AND</Button>}
        {isRoot && <Button onClick={() => onWrapRootInGroup("or")}>Wrap OR</Button>}
      </div>
    </div>
  );
};

export const ConditionPopover = ({
  condition,
  onApply,
  onClear,
  onClose,
}: ConditionPopoverProps) => {
  const [draft, setDraft] = useState<ConditionDraftEntry>(() =>
    condition ? conditionToDraft(condition) : createDefaultConditionDraft(),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(condition ? conditionToDraft(condition) : createDefaultConditionDraft());
    setError(null);
  }, [condition]);

  const updateDraft = (
    updater: (currentDraft: ConditionDraftEntry) => ConditionDraftEntry,
  ) => {
    setDraft((currentDraft) => updater(currentDraft));
    setError(null);
  };

  const onAddRuleToGroup = (groupId: string) => {
    updateDraft((currentDraft) =>
      withGroup(currentDraft, groupId, (groupEntry) => ({
        ...groupEntry,
        items: [...groupEntry.items, createDefaultRuleDraft()],
      })),
    );
  };

  const onAddGroupToGroup = (groupId: string) => {
    updateDraft((currentDraft) =>
      withGroup(currentDraft, groupId, (groupEntry) => ({
        ...groupEntry,
        items: [...groupEntry.items, createDefaultGroupDraft("and")],
      })),
    );
  };

  const onRemoveFromGroup = (groupId: string, itemId: string) => {
    updateDraft((currentDraft) =>
      withGroup(currentDraft, groupId, (groupEntry) => ({
        ...groupEntry,
        items: groupEntry.items.filter((item) => item.id !== itemId),
      })),
    );
  };

  const onUpdateGroupOperator = (groupId: string, operator: GroupOperator) => {
    updateDraft((currentDraft) =>
      withGroup(currentDraft, groupId, (groupEntry) => ({
        ...groupEntry,
        operator,
      })),
    );
  };

  const onUpdateRule = (
    ruleId: string,
    updater: (entry: ConditionDraftRule) => ConditionDraftRule,
  ) => {
    updateDraft((currentDraft) => withRule(currentDraft, ruleId, updater));
  };

  const onWrapRootInGroup = (operator: GroupOperator) => {
    const groupDraft = createDefaultGroupDraft(operator);
    updateDraft((currentDraft) => ({
      ...groupDraft,
      items: [currentDraft, createDefaultRuleDraft()],
    }));
  };

  const onApplyClick = () => {
    const parsedCondition = buildConditionFromDraft(draft);
    if (parsedCondition.error || !parsedCondition.condition) {
      setError(parsedCondition.error ?? "Condition is invalid");
      return;
    }

    onApply(parsedCondition.condition);
    onClose();
  };

  const onClearClick = () => {
    onClear();
    onClose();
  };

  return (
    <div className="nodrag nopan absolute top-full right-0 z-40 mt-2 w-[360px] rounded-md border border-slate-300 bg-white p-3 shadow-xl shadow-slate-300/40">
      <p className="mb-2 text-[11px] font-semibold text-slate-700">Condition</p>

      <ConditionEntryEditor
        entry={draft}
        isRoot
        onAddGroupToGroup={onAddGroupToGroup}
        onAddRuleToGroup={onAddRuleToGroup}
        onRemoveFromGroup={onRemoveFromGroup}
        onUpdateGroupOperator={onUpdateGroupOperator}
        onUpdateRule={onUpdateRule}
        onWrapRootInGroup={onWrapRootInGroup}
      />

      {error && (
        <p className="mt-2 rounded-sm border border-red-200 bg-red-50 px-2 py-1 text-[11px] text-red-700">
          {error}
        </p>
      )}

      <div className="mt-2 flex flex-wrap justify-end gap-1.5">
        <Button onClick={onClose}>Cancel</Button>
        <Button tone="danger" onClick={onClearClick}>
          Clear
        </Button>
        <Button tone="primary" onClick={onApplyClick}>
          Apply
        </Button>
      </div>
    </div>
  );
};

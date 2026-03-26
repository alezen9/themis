import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  createNodeDraft,
  isNumericOnlyNodeType,
  nodeTypeOptions,
  type EditorNode,
  type NodeDraft,
} from "../node-factory";
import { NodeDialogField } from "./NodeDialogField";
import { NodeDialogSection } from "./NodeDialogSection";

type NodeDialogProps = {
  node: EditorNode;
  error: string | null;
  onClose: () => void;
  onSave: (draft: NodeDraft) => void;
};

const inputClassName =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:bg-slate-50 disabled:text-slate-500";

const textareaClassName = `${inputClassName} min-h-[76px] resize-y`;

const buttonClassName =
  "rounded-[10px] border px-3 py-2 text-[12px] font-semibold transition-colors";

const nodeTypesWithReferences = new Set<NodeDraft["nodeType"]>([
  "check",
  "formula",
  "derived",
  "table",
  "coefficient",
]);

const nodeTypesWithUnit = new Set<NodeDraft["nodeType"]>([
  "formula",
  "derived",
  "table",
  "coefficient",
  "user-input",
]);

const nodeTypesWithExpression = new Set<NodeDraft["nodeType"]>([
  "formula",
  "derived",
]);

export const NodeDialog = ({
  node,
  error,
  onClose,
  onSave,
}: NodeDialogProps) => {
  const [draft, setDraft] = useState(() => createNodeDraft(node));
  const nodeTypeSelectOptions =
    node.type === "check"
      ? nodeTypeOptions.filter((option) => option.value === "check")
      : nodeTypeOptions.filter((option) => option.value !== "check");

  useEffect(() => {
    setDraft(createNodeDraft(node));
  }, [node]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const updateDraft = (field: keyof NodeDraft, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const onFieldChange =
    (field: keyof NodeDraft) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      updateDraft(field, event.target.value);
    };

  const onBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    onClose();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(draft);
  };

  const onNodeTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextNodeType = event.target.value as NodeDraft["nodeType"];

    setDraft((currentDraft) => ({
      ...currentDraft,
      nodeType: nextNodeType,
      valueType: isNumericOnlyNodeType(nextNodeType)
        ? "number"
        : currentDraft.valueType,
    }));
  };

  const showReferences = nodeTypesWithReferences.has(draft.nodeType);
  const showValueType = !isNumericOnlyNodeType(draft.nodeType);
  const showUnit = nodeTypesWithUnit.has(draft.nodeType);
  const showExpression = nodeTypesWithExpression.has(draft.nodeType);

  const dialog = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/25 p-6 backdrop-blur-sm"
      onMouseDown={onBackdropMouseDown}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="max-h-[80vh] w-[min(560px,calc(100vw-32px))] overflow-auto rounded-[20px] border border-slate-300 bg-white/95 shadow-[0_20px_44px_rgba(15,23,42,0.22)]"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-[18px]">
          <div>
            <h2 className="text-[20px] leading-[1.1] font-semibold text-slate-900">
              Edit node
            </h2>
            <p className="mt-1.5 text-[13px] text-slate-600">
              Tailored NDG node editing.
            </p>
          </div>

          <button
            className={`${buttonClassName} border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50`}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <form className="px-5 py-5" onSubmit={onSubmit}>
          <NodeDialogSection title="Core">
            <div className="grid gap-3.5 md:grid-cols-2">
              <NodeDialogField
                label="Type"
                hint="Node behavior in the verification graph"
              >
                <select
                  className={inputClassName}
                  disabled={node.type === "check"}
                  onChange={onNodeTypeChange}
                  value={draft.nodeType}
                >
                  {nodeTypeSelectOptions.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </NodeDialogField>

              <NodeDialogField
                label="Key"
                hint="Stable id used in formulas and exports"
              >
                <input
                  className={inputClassName}
                  onChange={onFieldChange("key")}
                  placeholder="check_uls_tension"
                  value={draft.key}
                />
              </NodeDialogField>

              {draft.nodeType === "check" ? (
                <NodeDialogField
                  className="md:col-span-2"
                  label="Verification formula"
                  hint="KaTeX/LaTeX inequality used for pass/fail"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("verificationExpression")}
                    placeholder="\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0"
                    value={draft.verificationExpression}
                  />
                </NodeDialogField>
              ) : null}

              {showExpression ? (
                <NodeDialogField
                  className="md:col-span-2"
                  label="Formula"
                  hint="KaTeX/LaTeX expression for derived/calculated values"
                >
                  <input
                    className={inputClassName}
                    placeholder="\\frac{M_{Ed}}{M_{Rd}}"
                    onChange={onFieldChange("expression")}
                    value={draft.expression}
                  />
                </NodeDialogField>
              ) : null}

              {draft.nodeType === "table" ? (
                <NodeDialogField
                  className="md:col-span-2"
                  label="Source"
                  hint="Where the table data comes from"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("source")}
                    placeholder="EN 1993-1-1 Table 6.2"
                    value={draft.source}
                  />
                </NodeDialogField>
              ) : null}
            </div>
          </NodeDialogSection>

          <NodeDialogSection title="Node Details">
            <div className="grid gap-3.5 md:grid-cols-2">
              <NodeDialogField
                label="Name"
                hint="Human-readable label shown in the editor"
              >
                <input
                  className={inputClassName}
                  onChange={onFieldChange("name")}
                  placeholder="Plastic tensile resistance"
                  value={draft.name}
                />
              </NodeDialogField>

              <NodeDialogField
                label="Symbol"
                hint="Short notation used in formulas"
              >
                <input
                  className={inputClassName}
                  onChange={onFieldChange("symbol")}
                  placeholder="N_{pl,Rd}"
                  value={draft.symbol}
                />
              </NodeDialogField>

              {showUnit ? (
                <NodeDialogField
                  label="Unit"
                  hint="Output unit for this value (plain text or LaTeX)"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("unit")}
                    placeholder="\\mathrm{kN}"
                    value={draft.unit}
                  />
                </NodeDialogField>
              ) : null}

              <NodeDialogField
                label="Value type"
                hint="Numeric or text output type"
              >
                {showValueType ? (
                  <select
                    className={inputClassName}
                    onChange={onFieldChange("valueType")}
                    value={draft.valueType}
                  >
                    <option value="number">number</option>
                    <option value="string">string</option>
                  </select>
                ) : (
                  <input className={inputClassName} disabled value="number" />
                )}
              </NodeDialogField>

              <NodeDialogField
                className="md:col-span-2"
                label="Allowed values"
                hint="Optional list of accepted values"
              >
                <input
                  className={inputClassName}
                  onChange={onFieldChange("allowedValues")}
                  placeholder="1, 2, 3 or S235, S355"
                  value={draft.allowedValues}
                />
              </NodeDialogField>
            </div>
          </NodeDialogSection>

          {showReferences ? (
            <NodeDialogSection title="References">
              <div className="grid gap-3.5 md:grid-cols-2">
                <NodeDialogField label="Section ref" hint="Standard section id">
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("sectionRef")}
                    placeholder="6.2.4"
                    value={draft.sectionRef}
                  />
                </NodeDialogField>

                <NodeDialogField
                  label="Paragraph ref"
                  hint="Paragraph identifier"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("paragraphRef")}
                    placeholder="(1)"
                    value={draft.paragraphRef}
                  />
                </NodeDialogField>

                <NodeDialogField
                  label="Sub-paragraph ref"
                  hint="Sub-item within a paragraph"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("subParagraphRef")}
                    placeholder="(a)"
                    value={draft.subParagraphRef}
                  />
                </NodeDialogField>

                <NodeDialogField
                  label="Formula ref"
                  hint="Referenced equation label"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("formulaRef")}
                    placeholder="(6.8)"
                    value={draft.formulaRef}
                  />
                </NodeDialogField>

                <NodeDialogField
                  label="Table ref"
                  hint="Referenced table label"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("tableRef")}
                    placeholder="Table 6.2"
                    value={draft.tableRef}
                  />
                </NodeDialogField>

                <NodeDialogField
                  label="Verification ref"
                  hint="Project-specific check reference"
                >
                  <input
                    className={inputClassName}
                    onChange={onFieldChange("verificationRef")}
                    placeholder="ULS-Tension-01"
                    value={draft.verificationRef}
                  />
                </NodeDialogField>
              </div>
            </NodeDialogSection>
          ) : null}

          <NodeDialogSection title="Description">
            <div className="grid gap-3.5">
              <NodeDialogField
                label="Description"
                hint="Optional context and assumptions for this node"
              >
                <textarea
                  className={textareaClassName}
                  onChange={onFieldChange("description")}
                  placeholder="Explain what this node represents and any assumptions."
                  value={draft.description}
                />
              </NodeDialogField>
            </div>
          </NodeDialogSection>

          {draft.nodeType === "user-input" && node.children.length > 0 ? (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[13px] text-blue-700">
              Saving as user input detaches this node&apos;s direct children.
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex justify-end gap-2.5">
            <button
              className={`${buttonClassName} border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50`}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`${buttonClassName} border-teal-800 bg-teal-700 text-white hover:border-teal-900 hover:bg-teal-800 disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-400`}
              type="submit"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") return dialog;

  return createPortal(dialog, document.body);
};

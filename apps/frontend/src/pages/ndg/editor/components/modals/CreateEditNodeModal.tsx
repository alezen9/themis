import { Dialog, DialogHeader, DialogTitle } from "@components/Dialog";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";
import { FormField } from "@components/inputs/shared";
import { Latex } from "@components/Latex";
import { useReactFlow } from "@xyflow/react";
import type { ReactNode } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import type { AddNodeInput } from "../../controller/actions";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import type { EditorEdge, EditorNode } from "../../document/types";

type NodeFormValues = Omit<AddNodeInput, "position" | "sourceNodeId">;
type Register = ReturnType<typeof useForm<NodeFormValues>>["register"];

const emptyValues: NodeFormValues = {
  expression: "",
  formulaRef: "",
  key: "",
  paragraphRef: "",
  sectionRef: "",
  source: "",
  subParagraphRef: "",
  symbol: "",
  tableRef: "",
  type: "user-input",
  unit: "",
  valueType: "number",
  verificationExpression: "",
  verificationRef: "",
};

const nodeTypeOptions = [
  { label: "User input", value: "user-input" },
  { label: "Formula", value: "formula" },
  { label: "Coefficient", value: "coefficient" },
  { label: "Constant", value: "constant" },
  { label: "Table", value: "table" },
] as const;

const valueTypeOptions = [
  { label: "Number", value: "number" },
  { label: "String", value: "string" },
] as const;

export const CreateEditNodeModal = () => {
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const closeModal = useNdgEditorStore((state) => state.closeModal);
  const modal = useNdgEditorStore((state) => state.modal);
  const isOpen = modal?.mode === "create-node" || modal?.mode === "edit-node";
  const editNode =
    modal?.mode === "edit-node" ? reactFlow.getNode(modal.nodeId) : undefined;

  if (isOpen && modal.mode === "edit-node" && !editNode) return null;

  const formKey =
    modal?.mode === "edit-node" ? `edit-${modal.nodeId}` : "create-node";
  const defaultValues = editNode ? toFormValues(editNode) : emptyValues;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
      className="flex max-h-[calc(100dvh-3rem)] max-w-2xl flex-col overflow-hidden"
    >
      <DialogHeader className="shrink-0 border-b border-sand-200 pb-4">
        <DialogTitle>
          {modal?.mode === "edit-node" ? "Edit node" : "Add node"}
        </DialogTitle>
      </DialogHeader>

      {(modal?.mode === "create-node" || modal?.mode === "edit-node") && (
        <NodeForm
          key={formKey}
          defaultValues={defaultValues}
          editNode={editNode}
          modal={modal}
        />
      )}
    </Dialog>
  );
};

type NodeFormProps = {
  defaultValues: NodeFormValues;
  editNode: EditorNode | undefined;
  modal:
    | { mode: "create-node"; sourceNodeId?: string }
    | { mode: "edit-node"; nodeId: string };
};

const NodeForm = (props: NodeFormProps) => {
  const { defaultValues, editNode, modal } = props;
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const addNode = useNdgEditorStore((state) => state.addNode);
  const closeModal = useNdgEditorStore((state) => state.closeModal);
  const updateNode = useNdgEditorStore((state) => state.updateNode);
  const form = useForm<NodeFormValues>({ defaultValues, mode: "onChange" });
  const { control, handleSubmit, register, reset, trigger } = form;
  const [expression, symbol, type, unit, verificationExpression] = useWatch({
    control,
    name: ["expression", "symbol", "type", "unit", "verificationExpression"],
  });

  const isCheckNode = type === "check";
  const isFormulaNode = type === "formula";
  const isUserInputNode = type === "user-input";
  const isCoefficientNode = type === "coefficient";
  const isConstantNode = type === "constant";
  const isTableNode = type === "table";
  const isRootCheckNode = editNode?.type === "check";
  const canEditValueType = isFormulaNode || isTableNode || isUserInputNode;
  const hasMetadata =
    isCheckNode || isFormulaNode || isTableNode || isCoefficientNode;

  const onTypeChange = (type: NodeFormValues["type"]) => {
    reset({ ...emptyValues, type });
    void trigger();
  };

  const onSubmit = (values: NodeFormValues) => {
    switch (modal.mode) {
      case "create-node": {
        const { sourceNodeId } = modal;
        const sourceNode = sourceNodeId
          ? reactFlow.getNode(sourceNodeId)
          : undefined;
        const { position } = sourceNode ?? {};

        addNode({
          ...values,
          position: { x: position?.x ?? 0, y: position ? position.y + 170 : 0 },
          sourceNodeId,
        });
        break;
      }

      case "edit-node":
        updateNode({ ...values, id: modal.nodeId });
        break;
    }

    closeModal();
  };

  return (
    <FormProvider {...form}>
      <form className="flex min-h-0 flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-6">
          <Section title="Type">
            {isRootCheckNode && (
              <InputText
                value="Check"
                disabled
                readOnly
                className="max-w-none md:col-span-1"
              />
            )}

            {!isRootCheckNode && (
              <div className="grid grid-cols-5 gap-3 md:col-span-4">
                {nodeTypeOptions.map((option) => {
                  return (
                    <InputRadio
                      key={option.value}
                      {...register("type")}
                      className="w-full max-w-none justify-center"
                      onChange={() => onTypeChange(option.value)}
                      value={option.value}
                      label={option.label}
                    />
                  );
                })}
              </div>
            )}
          </Section>

          <Section title="Identity">
            <div className="col-span-2">
              <FormField
                name="key"
                label={
                  <FieldLabel
                    label="Key"
                    description="Unique id used by formulas"
                  />
                }
              >
                <InputText
                  {...register("key", { required: "Required" })}
                  className="max-w-none"
                />
              </FormField>
            </div>

            {canEditValueType && (
              <div className="col-span-2">
                <FormField
                  name="valueType"
                  label={
                    <FieldLabel
                      label="Value"
                      description="Expected runtime value"
                    />
                  }
                >
                  <div className="grid grid-cols-2 gap-3">
                    {valueTypeOptions.map((option) => {
                      return (
                        <InputRadio
                          key={option.value}
                          {...register("valueType")}
                          className="w-full max-w-none justify-center"
                          value={option.value}
                          label={option.label}
                        />
                      );
                    })}
                  </div>
                </FormField>
              </div>
            )}
          </Section>

          <Section title="Definition">
            {isCheckNode && (
              <LatexField
                className="md:col-span-4"
                name="verificationExpression"
                label="Verification"
                description="LaTeX condition rendered in the check node"
                register={register}
                value={verificationExpression}
                required
              />
            )}

            {isFormulaNode && (
              <>
                <LatexField
                  className="md:col-span-2"
                  name="expression"
                  label="Expression"
                  description="LaTeX formula shown as symbol = expression"
                  register={register}
                  value={expression}
                />
                <LatexField
                  compact
                  name="symbol"
                  label="Symbol"
                  description="Expression symbol"
                  register={register}
                  value={symbol}
                />
                <LatexField
                  compact
                  name="unit"
                  label="Unit"
                  description="Display unit"
                  register={register}
                  value={unit}
                />
              </>
            )}

            {isUserInputNode && (
              <>
                <LatexField
                  name="symbol"
                  label="Symbol"
                  description="Expression symbol"
                  register={register}
                  value={symbol}
                />
                <LatexField
                  name="unit"
                  label="Unit"
                  description="Display unit"
                  register={register}
                  value={unit}
                />
              </>
            )}

            {isCoefficientNode && (
              <>
                <LatexField
                  compact
                  name="symbol"
                  label="Symbol"
                  description="Expression symbol"
                  register={register}
                  value={symbol}
                />
                <LatexField
                  compact
                  name="unit"
                  label="Unit"
                  description="Display unit"
                  register={register}
                  value={unit}
                />
              </>
            )}

            {isConstantNode && (
              <LatexField
                compact
                name="symbol"
                label="Symbol"
                description="Expression symbol"
                register={register}
                value={symbol}
                required
              />
            )}

            {isTableNode && (
              <>
                <LatexField
                  compact
                  name="symbol"
                  label="Symbol"
                  description="Expression symbol"
                  register={register}
                  value={symbol}
                />
                <LatexField
                  compact
                  name="unit"
                  label="Unit"
                  description="Display unit"
                  register={register}
                  value={unit}
                />
              </>
            )}
          </Section>

          {hasMetadata && (
            <Section title="Metadata">
              <FormField
                name="sectionRef"
                label={<FieldLabel label="Section" />}
              >
                <InputText {...register("sectionRef")} className="max-w-none" />
              </FormField>
              <FormField
                name="paragraphRef"
                label={<FieldLabel label="Paragraph" />}
              >
                <InputText
                  {...register("paragraphRef")}
                  className="max-w-none"
                />
              </FormField>
              <FormField
                name="subParagraphRef"
                label={<FieldLabel label="Subparagraph" />}
              >
                <InputText
                  {...register("subParagraphRef")}
                  className="max-w-none"
                />
              </FormField>
              <FormField
                name="formulaRef"
                label={<FieldLabel label="Formula" />}
              >
                <InputText {...register("formulaRef")} className="max-w-none" />
              </FormField>
              <FormField name="tableRef" label={<FieldLabel label="Table" />}>
                <InputText {...register("tableRef")} className="max-w-none" />
              </FormField>
              {isTableNode && (
                <FormField name="source" label={<FieldLabel label="Source" />}>
                  <InputText
                    {...register("source", { required: "Required" })}
                    className="max-w-none"
                  />
                </FormField>
              )}
              {isCheckNode && (
                <FormField
                  name="verificationRef"
                  label={<FieldLabel label="Verification" />}
                >
                  <InputText
                    {...register("verificationRef")}
                    className="max-w-none"
                  />
                </FormField>
              )}
            </Section>
          )}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-sand-200 p-4">
          <button
            type="button"
            className="h-9 rounded-sm border border-sand-300 px-4 text-sm text-sand-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 rounded-sm bg-sand-900 px-4 text-sm text-white"
          >
            {modal.mode === "edit-node" ? "Save" : "Create"}
          </button>
        </footer>
      </form>
    </FormProvider>
  );
};

type SectionProps = { children: ReactNode; title: string };

const Section = (props: SectionProps) => {
  const { children, title } = props;

  return (
    <section className="grid grid-cols-4 gap-3 rounded-sm p-4 shadow-lg shadow-envy-100/25">
      <h3 className="col-span-4 mb-1 text-sm font-semibold uppercase tracking-widest text-sand-900">
        {title}
      </h3>
      {children}
    </section>
  );
};

type FieldLabelProps = { description?: string; label: string };

const FieldLabel = (props: FieldLabelProps) => {
  const { description, label } = props;

  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-md font-light text-sand-900">{label}</span>
      {description && (
        <span className="text-[11px] font-light tracking-wide text-slate-500/80">
          {description}
        </span>
      )}
    </span>
  );
};

type LatexFieldProps = {
  className?: string;
  compact?: boolean;
  description: string;
  label: string;
  name: "expression" | "symbol" | "unit" | "verificationExpression";
  register: Register;
  required?: boolean;
  value: string;
};

const LatexField = (props: LatexFieldProps) => {
  const {
    className,
    compact,
    description,
    label,
    name,
    register,
    required,
    value,
  } = props;
  const hasValue = value.trim().length > 0;

  return (
    <div className={className}>
      <FormField
        name={name}
        label={<FieldLabel label={label} description={description} />}
      >
        <InputText
          {...register(name, required ? { required: "Required" } : undefined)}
          className="max-w-none"
        />
        <div
          className={twMerge(
            "mt-2 flex min-h-14 items-center overflow-x-auto rounded-sm border border-sand-200 bg-sand-50 px-3 py-2 text-sand-900",
            "h-14 bg-white",
            "justify-center-safe",
            compact && "text-sm",
          )}
        >
          {hasValue && (
            <Latex displayMode tex={value} className="min-w-max shrink-0" />
          )}
          {!hasValue && (
            <span className="text-xs font-light text-slate-400">Preview</span>
          )}
        </div>
      </FormField>
    </div>
  );
};

const toFormValues = (node: EditorNode): NodeFormValues => {
  const data = node.data;
  const meta = "meta" in data ? data.meta : undefined;

  return {
    ...emptyValues,
    expression: "expression" in data ? (data.expression ?? "") : "",
    formulaRef: meta?.formulaRef ?? "",
    key: data.key,
    paragraphRef: meta?.paragraphRef ?? "",
    sectionRef: meta?.sectionRef ?? "",
    source: "source" in data ? data.source : "",
    subParagraphRef: meta?.subParagraphRef ?? "",
    symbol: data.symbol ?? "",
    tableRef: meta?.tableRef ?? "",
    type: node.type,
    unit: "unit" in data ? (data.unit ?? "") : "",
    valueType: data.valueType.type,
    verificationExpression:
      "verificationExpression" in data ? data.verificationExpression : "",
    verificationRef: meta?.verificationRef ?? "",
  };
};

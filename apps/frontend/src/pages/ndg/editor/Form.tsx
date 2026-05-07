import {
  useCallback,
  useEffect,
  type ComponentProps,
  type ReactNode,
} from "react";
import { FormProvider, get, useForm, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { LineDivider } from "@components/Dividers";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputLatex } from "@components/inputs/InputLatex";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputText } from "@components/inputs/InputText";
import { InputTextarea } from "@components/inputs/InputTextarea";
import { FormField, type Option } from "@components/inputs/shared";

import {
  createNodeDraft,
  isNumericOnlyNodeType,
  nodeTypeOptions,
  type EditorNode,
  type NodeDraft,
} from "./config/nodeFactory";

type Props = {
  error: string | null;
  inputKeyOptions?: Option[];
  node: EditorNode;
  onCancel: () => void;
  onSave: (draft: NodeDraft) => void;
};

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

type NodeDraftRegister = ReturnType<typeof useForm<NodeDraft>>["register"];
type NodeDraftFormName = Parameters<NodeDraftRegister>[0];

const setValueAsOptionalNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return undefined;

  const valueAsNumber = Number(value);

  if (Number.isNaN(valueAsNumber)) return undefined;

  return valueAsNumber;
};

const useNodeDraftFormContext = () => {
  const { register, ...rest } = useFormContext<NodeDraft>();

  const registerNumber = useCallback(
    (name: NodeDraftFormName) =>
      register(name, { setValueAs: setValueAsOptionalNumber }),
    [register],
  );

  const registerSelect = useCallback(
    (name: NodeDraftFormName) => ({
      ...register(name),
      defaultValue: get(rest.formState.defaultValues, name),
    }),
    [register, rest.formState.defaultValues],
  );

  return { register, registerNumber, registerSelect, ...rest };
};

export const Form = (props: Props) => {
  const { error, inputKeyOptions = [], node, onCancel, onSave } = props;

  const form = useForm<NodeDraft>({ defaultValues: createNodeDraft(node) });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    reset(createNodeDraft(node));
  }, [node, reset]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="flex flex-col gap-6 p-6">
          <FormCore node={node} inputKeyOptions={inputKeyOptions} />
          <LineDivider />

          <FormNodeDetails />
          <LineDivider />

          <FormReferences />

          <FormDescription />

          <FormWarnings node={node} error={error} />

          <FormActions onCancel={onCancel} />
        </div>
      </form>
    </FormProvider>
  );
};

type FormCoreProps = { inputKeyOptions: Option[]; node: EditorNode };

const FormCore = (props: FormCoreProps) => {
  const { inputKeyOptions, node } = props;
  const { register, registerSelect, watch } = useNodeDraftFormContext();

  const nodeType = watch("nodeType");

  const showExpression = nodeTypesWithExpression.has(nodeType);
  const showKeyAutocomplete = nodeType === "user-input";

  const nodeTypeSelectOptions =
    node.type === "check"
      ? nodeTypeOptions.filter((option) => option.value === "check")
      : nodeTypeOptions.filter((option) => option.value !== "check");

  return (
    <Section>
      <SectionTitle>Core</SectionTitle>

      <InputGrid>
        <FormField name="nodeType" label="Type">
          <InputSelect
            {...registerSelect("nodeType")}
            options={nodeTypeSelectOptions}
          />
        </FormField>

        <FormField name="key" label="Key">
          {showKeyAutocomplete ? (
            <InputAutocomplete
              {...registerSelect("key")}
              options={inputKeyOptions}
              placeholder="N_Ed_kN"
            />
          ) : (
            <InputText placeholder="check_uls_tension" {...register("key")} />
          )}
        </FormField>

        {nodeType === "check" ? (
          <div className="md:col-span-2">
            <FormField
              name="verificationExpression"
              label="Verification formula"
            >
              <InputLatex
                placeholder={String.raw`\frac{N_{Ed}}{N_{pl,Rd}} \leq 1.0`}
                {...register("verificationExpression")}
              />
            </FormField>
          </div>
        ) : null}

        {showExpression ? (
          <div className="md:col-span-2">
            <FormField name="expression" label="Formula">
              <InputLatex
                placeholder={String.raw`\frac{M_{Ed}}{M_{Rd}}`}
                {...register("expression")}
              />
            </FormField>
          </div>
        ) : null}

        {nodeType === "table" ? (
          <div className="md:col-span-2">
            <FormField name="source" label="Source">
              <InputText
                placeholder="EN 1993-1-1 Table 6.2"
                {...register("source")}
              />
            </FormField>
          </div>
        ) : null}
      </InputGrid>
    </Section>
  );
};

const FormNodeDetails = () => {
  const { register, watch } = useNodeDraftFormContext();

  const nodeType = watch("nodeType");

  const showUnit = nodeTypesWithUnit.has(nodeType);
  const showValueType = !isNumericOnlyNodeType(nodeType);

  return (
    <Section>
      <SectionTitle>Node details</SectionTitle>

      <InputGrid>
        <FormField name="name" label="Name">
          <InputText
            placeholder="Plastic tensile resistance"
            {...register("name")}
          />
        </FormField>

        <FormField name="symbol" label="Symbol">
          <InputText placeholder="N_{pl,Rd}" {...register("symbol")} />
        </FormField>

        {showUnit ? (
          <FormField name="unit" label="Unit">
            <InputLatex
              placeholder={String.raw`\mathrm{kN}`}
              {...register("unit")}
            />
          </FormField>
        ) : null}

        <FormField name="valueType" label="Value type">
          {showValueType ? (
            <div className="flex items-center gap-1">
              <InputRadio
                {...register("valueType")}
                value="number"
                label="Number"
              />
              <InputRadio
                {...register("valueType")}
                value="string"
                label="String"
              />
            </div>
          ) : (
            <InputText disabled value="number" />
          )}
        </FormField>

        <div className="md:col-span-2">
          <FormField name="allowedValues" label="Allowed values">
            <InputText
              placeholder="1, 2, 3 or S235, S355"
              {...register("allowedValues")}
            />
          </FormField>
        </div>
      </InputGrid>
    </Section>
  );
};

const FormReferences = () => {
  const { register, watch } = useNodeDraftFormContext();

  const nodeType = watch("nodeType");
  const showReferences = nodeTypesWithReferences.has(nodeType);

  if (!showReferences) return null;

  return (
    <>
      <Section>
        <SectionTitle>References</SectionTitle>

        <InputGrid>
          <FormField name="sectionRef" label="Section ref">
            <InputText placeholder="6.2.4" {...register("sectionRef")} />
          </FormField>

          <FormField name="paragraphRef" label="Paragraph ref">
            <InputText placeholder="(1)" {...register("paragraphRef")} />
          </FormField>

          <FormField name="subParagraphRef" label="Sub-paragraph ref">
            <InputText placeholder="(a)" {...register("subParagraphRef")} />
          </FormField>

          <FormField name="formulaRef" label="Formula ref">
            <InputText placeholder="(6.8)" {...register("formulaRef")} />
          </FormField>

          <FormField name="tableRef" label="Table ref">
            <InputText placeholder="Table 6.2" {...register("tableRef")} />
          </FormField>

          <FormField name="verificationRef" label="Verification ref">
            <InputText
              placeholder="ULS-Tension-01"
              {...register("verificationRef")}
            />
          </FormField>
        </InputGrid>
      </Section>
      <LineDivider />
    </>
  );
};

const FormDescription = () => {
  const { register } = useNodeDraftFormContext();

  return (
    <Section>
      <SectionTitle>Description</SectionTitle>

      <FormField name="description" label="Description">
        <InputTextarea
          placeholder="Explain what this node represents and any assumptions."
          {...register("description")}
        />
      </FormField>
    </Section>
  );
};

type FormWarningsProps = { error: string | null; node: EditorNode };

const FormWarnings = (props: FormWarningsProps) => {
  const { error, node } = props;
  const { watch } = useNodeDraftFormContext();

  const nodeType = watch("nodeType");

  const showDetachedChildrenWarning =
    nodeType === "user-input" && node.children.length > 0;

  if (!showDetachedChildrenWarning && !error) return null;

  return (
    <div className="flex flex-col gap-3">
      {showDetachedChildrenWarning ? (
        <Alert variant="info">
          Saving as user input detaches this node&apos;s direct children.
        </Alert>
      ) : null}

      {error ? <Alert variant="error">{error}</Alert> : null}
    </div>
  );
};

type FormActionsProps = { onCancel: () => void };

const FormActions = (props: FormActionsProps) => {
  const { onCancel } = props;

  return (
    <div className="flex justify-end gap-2.5">
      <Button onClick={onCancel}>Cancel</Button>
      <Button variant="primary" type="submit">
        Save changes
      </Button>
    </div>
  );
};

type SectionProps = { children: ReactNode };

const Section = (props: SectionProps) => {
  const { children } = props;

  return <section className="flex flex-col gap-3.5">{children}</section>;
};

type SectionTitleProps = { children: ReactNode };

const SectionTitle = (props: SectionTitleProps) => {
  const { children } = props;

  return (
    <h3 className="text-xs font-semibold tracking-wide text-slate-950 uppercase">
      {children}
    </h3>
  );
};

type InputGridProps = { children: ReactNode };

const InputGrid = (props: InputGridProps) => {
  const { children } = props;

  return <div className="grid gap-3.5 md:grid-cols-2">{children}</div>;
};

type AlertProps = { children: ReactNode; variant: "error" | "info" };

const Alert = (props: AlertProps) => {
  const { children, variant } = props;

  return (
    <div
      className={twMerge(
        "rounded-sm border px-3 py-2 text-[13px]",
        variant === "info" && "border-blue-200 bg-blue-50 text-blue-700",
        variant === "error" && "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {children}
    </div>
  );
};

type ButtonProps = ComponentProps<"button"> & { variant?: "primary" };

const Button = (props: ButtonProps) => {
  const { className, type = "button", variant, ...buttonProps } = props;

  return (
    <button
      className={twMerge(
        "cursor-pointer rounded-sm border px-3 py-2 text-xs font-medium transition-colors",
        variant === "primary"
          ? "border-envy-700 bg-envy-700 text-white hover:border-envy-800 hover:bg-envy-800"
          : "border-sand-300 bg-white text-slate-900 hover:border-sand-400 hover:bg-sand-50",
        className,
      )}
      type={type}
      {...buttonProps}
    />
  );
};

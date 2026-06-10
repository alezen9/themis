import type { EditorNodeInput } from "../../document/editorNodeSchema";
import { CheckForm } from "./CheckForm";
import { CoefficientForm } from "./CoefficientForm";
import { ConstantForm } from "./ConstantForm";
import { FormulaForm } from "./FormulaForm";
import { TableForm } from "./TableForm";
import { UserInputForm } from "./UserInputForm";

type Props = {
  seed: EditorNodeInput;
  formId: string;
  onSubmit: (values: EditorNodeInput) => void;
};

export const NodeForm = (props: Props) => {
  const { seed, formId, onSubmit } = props;

  switch (seed.type) {
    case "user-input":
      return (
        <UserInputForm
          formId={formId}
          defaultValues={seed}
          onSubmit={onSubmit}
        />
      );
    case "coefficient":
      return (
        <CoefficientForm
          formId={formId}
          defaultValues={seed}
          onSubmit={onSubmit}
        />
      );
    case "constant":
      return (
        <ConstantForm
          formId={formId}
          defaultValues={seed}
          onSubmit={onSubmit}
        />
      );
    case "table":
      return (
        <TableForm formId={formId} defaultValues={seed} onSubmit={onSubmit} />
      );
    case "formula":
      return (
        <FormulaForm formId={formId} defaultValues={seed} onSubmit={onSubmit} />
      );
    case "check":
      return (
        <CheckForm formId={formId} defaultValues={seed} onSubmit={onSubmit} />
      );
  }
};

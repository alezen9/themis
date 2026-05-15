import { FormShape } from "./FormShape";
import { LineDivider } from "@components/Dividers";
import { FormSection } from "./FormSection";
import { FormGeometry } from "./FormGeometry";
import { FormMaterial } from "./FormMaterial";
import { FormActions } from "./FormActions";
import { FormClassification } from "./FormClassification";
import { FormAnnex } from "./FormAnnex";
import { FormFlexuralBuckling } from "./FormFlexuralBuckling";
import { FormStabilityChecks } from "./FormStabilityChecks";

export const Form = () => {
  return (
    <div className="w-104 flex flex-col gap-8 h-full border-r border-slate-300 pr-4">
      <FormShape />
      <LineDivider />

      <FormSection />
      <LineDivider />

      <FormGeometry />
      <LineDivider />

      <FormMaterial />
      <LineDivider />

      <FormActions />
      <LineDivider />

      <FormClassification />
      <LineDivider />

      <FormFlexuralBuckling />
      <LineDivider />

      <FormStabilityChecks />
      <LineDivider />

      <FormAnnex />
    </div>
  );
};

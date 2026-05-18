import { FormShape } from "./FormShape";
import { LineDivider } from "@components/Dividers";
import { FormSection } from "./FormSection";
import { FormGeometry } from "./FormGeometry";
import { FormMaterial } from "./FormMaterial";
import { FormActions } from "./FormActions";
import { FormClassification } from "./FormClassification";
import { FormAnnex } from "./FormAnnex";
import { FormFlexuralBuckling } from "./FormFlexuralBuckling";
import { FormLateralTorsionalBuckling } from "./FormLateralTorsionalBuckling";

export const Form = () => {
  return (
    <div className="w-104 flex flex-col gap-8 h-full pr-4">
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

      <FormLateralTorsionalBuckling />
      <LineDivider />

      <FormAnnex />
    </div>
  );
};

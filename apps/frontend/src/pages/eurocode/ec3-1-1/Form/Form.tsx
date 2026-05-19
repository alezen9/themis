import { FormShape } from "./FormShape";
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
    <div className="w-106 flex flex-col gap-4 h-full">
      <FormShape />
      <FormSection />
      <FormGeometry />
      <FormMaterial />
      <FormActions />
      <FormClassification />
      <FormFlexuralBuckling />
      <FormLateralTorsionalBuckling />
      <FormAnnex />
    </div>
  );
};

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
    <aside className="flex h-full w-full flex-col gap-4">
      <FormShape />
      <FormSection />
      <FormGeometry />
      <FormMaterial />
      <FormActions />
      <FormClassification />
      <FormFlexuralBuckling />
      <FormLateralTorsionalBuckling />
      <FormAnnex />
    </aside>
  );
};

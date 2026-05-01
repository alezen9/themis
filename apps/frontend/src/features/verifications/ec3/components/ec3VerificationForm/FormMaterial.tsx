import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import {
  Ec3FormSection,
  Ec3FormSectionContent,
  Ec3FormSectionTitle,
} from "./Ec3FormLayout";
import { gradesByNorm } from "./shared";

export const FormMaterial = () => {
  return (
    <Ec3FormSection>
      <Ec3FormSectionTitle>Material</Ec3FormSectionTitle>
      <Ec3FormSectionContent>
        <InputAutocomplete
          label="Steel Grade"
          name="gradeId"
          options={gradesByNorm.flatMap((group) =>
            group.grades.map((grade) => ({
              label: `${group.norm} / ${grade.id} (fy=${grade.fy})`,
              value: `${grade.norm}:${grade.id}`,
            })),
          )}
        />
      </Ec3FormSectionContent>
    </Ec3FormSection>
  );
};

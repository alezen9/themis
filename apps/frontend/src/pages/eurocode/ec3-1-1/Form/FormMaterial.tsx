import React, { useContext } from "react";
import { Section, SectionTitle, TextLabel } from "./shared";
import { HorizontalInput } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { steelGradeOptions } from "./options";
import { Ec311CustomRegisterContext } from "./Form";

const FormMaterial = () => {
  const { registerSelect } = useContext(Ec311CustomRegisterContext);
  return (
    <Section>
      <SectionTitle>Material</SectionTitle>
      <HorizontalInput
        name="gradeId"
        label={<TextLabel>Steel grade</TextLabel>}
      >
        <InputAutocomplete
          {...registerSelect?.("gradeId")}
          options={steelGradeOptions}
        />
      </HorizontalInput>
    </Section>
  );
};

export default FormMaterial;

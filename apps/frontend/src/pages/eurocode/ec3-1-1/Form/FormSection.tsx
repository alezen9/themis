import { HorizontalInput } from "@components/inputs/shared";
import { Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import { sectionClassOptions } from "./options";
import { useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";

export const FormSection = () => {
  const { registerSelect } = useContext(Ec311CustomRegisterContext);
  return (
    <Section>
      <SectionTitle>Section</SectionTitle>
      <ul>
        <li>Profile, autocomplete</li>
        <li>Fabrication, radio</li>
      </ul>
      <HorizontalInput
        name="section_class"
        label={<TextLabel>Class</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("section_class")}
          options={sectionClassOptions}
        />
      </HorizontalInput>
    </Section>
  );
};

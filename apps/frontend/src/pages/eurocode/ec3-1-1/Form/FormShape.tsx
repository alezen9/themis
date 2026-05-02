import { Section, SectionTitle } from "./shared";
import { useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";
import { shapeOptions } from "./options";
import { InputRadio } from "@components/inputs/InputRadio";

export const FormShape = () => {
  const { register } = useContext(Ec311CustomRegisterContext);

  return (
    <Section>
      <SectionTitle>Shape</SectionTitle>
      <div className="flex items-center w-full gap-1">
        {shapeOptions.map((option) => {
          return (
            <InputRadio
              key={option.value}
              {...register?.("shape")}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </div>
    </Section>
  );
};

import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { InputToggle } from "@components/inputs/InputToggle";

export const FormTorsionalBuckling = () => {
  const { registerBoolean, registerNumber } = useContext(
    Ec311CustomRegisterContext,
  );
  const { watch } = useFormContext<Ec3FormValues>();
  const isActive = watch("active_T");

  return (
    <Section>
      <div className="flex items-center justify-between gap-4 w-full mb-2">
        <SectionTitle className="mb-0">Torsional Buckling</SectionTitle>
        <InputToggle {...registerBoolean?.("active_T")} className="h-6 w-12" />
      </div>

      {isActive && (
        <HorizontalInput name="k_T" label={<LatexLabel tex="k_T" />}>
          <InputNumber {...registerNumber?.("k_T")} />
        </HorizontalInput>
      )}
    </Section>
  );
};

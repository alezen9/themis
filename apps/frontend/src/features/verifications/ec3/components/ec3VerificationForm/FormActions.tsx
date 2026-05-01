import { useFormContext } from "react-hook-form";
import { InputNumber } from "@components/inputs/InputNumber";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  Ec3FormSection,
  Ec3FormSectionContent,
  Ec3FormSectionTitle,
} from "./Ec3FormLayout";
import { Ec3FieldLabel, getError } from "./shared";

export const FormActions = () => {
  const {
    formState: { errors },
  } = useFormContext<Ec3FormValues>();

  return (
    <Ec3FormSection>
      <Ec3FormSectionTitle>Actions</Ec3FormSectionTitle>
      <Ec3FormSectionContent>
        <InputNumber
          name="N_Ed"
          label={<Ec3FieldLabel text="Axial Force" tex="N_{Ed}" />}
          suffix="kN"
          step="any"
          error={getError(errors, "N_Ed")}
        />
        <InputNumber
          name="M_y_Ed"
          label={<Ec3FieldLabel text="Major-Axis Moment" tex="M_{y,Ed}" />}
          suffix="kNm"
          step="any"
          error={getError(errors, "M_y_Ed")}
        />
        <InputNumber
          name="M_z_Ed"
          label={<Ec3FieldLabel text="Minor-Axis Moment" tex="M_{z,Ed}" />}
          suffix="kNm"
          step="any"
          error={getError(errors, "M_z_Ed")}
        />
        <InputNumber
          name="V_y_Ed"
          label={<Ec3FieldLabel text="Major-Axis Shear" tex="V_{y,Ed}" />}
          suffix="kN"
          step="any"
          error={getError(errors, "V_y_Ed")}
        />
        <InputNumber
          name="V_z_Ed"
          label={<Ec3FieldLabel text="Minor-Axis Shear" tex="V_{z,Ed}" />}
          suffix="kN"
          step="any"
          error={getError(errors, "V_z_Ed")}
        />
      </Ec3FormSectionContent>
    </Ec3FormSection>
  );
};

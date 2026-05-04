import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, SpacingDivider } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { DrawingIShape } from "./DrawingIShape";
import { DrawingRhsShape } from "./DrawingRhsShape";
import { DrawingChsShape } from "./DrawingChsShape";

export const FormGeometry = () => {
  const { registerNumber } = useContext(Ec311CustomRegisterContext);
  const { watch } = useFormContext<Ec3FormValues>();
  const shape = watch("shape");

  return (
    <Section>
      <SectionTitle>Geometry</SectionTitle>

      {shape === "I" && <DrawingIShape />}
      {shape === "RHS" && <DrawingRhsShape />}
      {shape === "CHS" && <DrawingChsShape />}

      <SpacingDivider />

      {shape === "I" && (
        <>
          <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
            <InputNumber {...registerNumber?.("i_geometry.h")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
            <InputNumber {...registerNumber?.("i_geometry.b")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
            <InputNumber {...registerNumber?.("i_geometry.tw")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tf" label={<LatexLabel tex="t_f" />}>
            <InputNumber {...registerNumber?.("i_geometry.tf")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="r" label={<LatexLabel tex="r" />}>
            <InputNumber {...registerNumber?.("i_geometry.r")} suffix="mm" />
          </HorizontalInput>
        </>
      )}

      {shape === "RHS" && (
        <>
          <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.h")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.b")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.tw")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="ri" label={<LatexLabel tex="r_i" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.ri")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="ro" label={<LatexLabel tex="r_o" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.ro")} suffix="mm" />
          </HorizontalInput>
        </>
      )}

      {shape === "CHS" && (
        <>
          <HorizontalInput name="d" label={<LatexLabel tex="d" />}>
            <InputNumber {...registerNumber?.("chs_geometry.d")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="t" label={<LatexLabel tex="t" />}>
            <InputNumber {...registerNumber?.("chs_geometry.t")} suffix="mm" />
          </HorizontalInput>
        </>
      )}
    </Section>
  );
};

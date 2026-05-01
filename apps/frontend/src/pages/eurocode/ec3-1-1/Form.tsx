import { InputNumber } from "@components/inputs/InputNumber";
import { HorizontalInput } from "@components/inputs/shared";
import { Latex } from "@components/Latex";
import {
  ComponentProps,
  ComponentPropsWithRef,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { FormProvider, get, useForm, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { DEFAULT_EC3_FORM_VALUES } from "../../../features/verifications/ec3/components/ec3VerificationForm/config";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ec3FormValues,
  formSchema,
} from "../../../features/verifications/ec3/domain/formSchema";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  ANNEX_OPTIONS,
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SUPPORT_CONDITION_OPTIONS,
} from "./constants";

export const Form = () => {
  const form = useForm<Ec3FormValues>({
    defaultValues: DEFAULT_EC3_FORM_VALUES,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });
  const {
    register,
    formState: { defaultValues },
  } = form;

  const registerNumber = (name: Parameters<typeof register>[0]) =>
    register(name, { valueAsNumber: true });

  const registerSelect = (name: Parameters<typeof register>[0]) => ({
    ...register(name),
    defaultValue: get(defaultValues, name),
  });

  return (
    <FormProvider {...form}>
      <Observer>
        <div className="w-96 flex flex-col gap-8 h-full border-r border-slate-300 pr-6">
          <Section>
            <SectionTitle>Shape</SectionTitle>
            <ul>
              <li>Shape, radio cards</li>
            </ul>
          </Section>

          <SectionSeparator />

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
                {...registerSelect("section_class")}
                options={SECTION_CLASS_OPTIONS}
              />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Geometry</SectionTitle>

            {/* Shared by I and RHS */}
            <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
              <InputNumber {...registerNumber("h")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
              <InputNumber {...registerNumber("b")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
              <InputNumber {...registerNumber("tw")} suffix="mm" />
            </HorizontalInput>

            <Separator />

            {/* I section only */}
            <HorizontalInput name="tf" label={<LatexLabel tex="t_f" />}>
              <InputNumber {...registerNumber("tf")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="r" label={<LatexLabel tex="r" />}>
              <InputNumber {...registerNumber("r")} suffix="mm" />
            </HorizontalInput>

            <Separator />

            {/* RHS section only */}
            <HorizontalInput name="ro" label={<LatexLabel tex="r_o" />}>
              <InputNumber {...registerNumber("ro")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="ri" label={<LatexLabel tex="r_i" />}>
              <InputNumber {...registerNumber("ri")} suffix="mm" />
            </HorizontalInput>

            <Separator />

            {/* CHS section only */}
            <HorizontalInput name="d" label={<LatexLabel tex="d" />}>
              <InputNumber {...registerNumber("d")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="t" label={<LatexLabel tex="t" />}>
              <InputNumber {...registerNumber("t")} suffix="mm" />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Material</SectionTitle>
            <ul>
              <li>Steel grade, autocomplete</li>
            </ul>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Actions</SectionTitle>

            <HorizontalInput name="N_Ed" label={<LatexLabel tex="N_{Ed}" />}>
              <InputNumber {...registerNumber("N_Ed")} suffix="kN" />
            </HorizontalInput>

            <Separator />

            <HorizontalInput
              name="M_y_Ed"
              label={<LatexLabel tex="M_{y,Ed}" />}
            >
              <InputNumber {...registerNumber("M_y_Ed")} suffix="kNm" />
            </HorizontalInput>

            <HorizontalInput
              name="M_z_Ed"
              label={<LatexLabel tex="M_{z,Ed}" />}
            >
              <InputNumber {...registerNumber("M_z_Ed")} suffix="kNm" />
            </HorizontalInput>

            <Separator />

            <HorizontalInput
              name="V_y_Ed"
              label={<LatexLabel tex="V_{y,Ed}" />}
            >
              <InputNumber {...registerNumber("V_y_Ed")} suffix="kN" />
            </HorizontalInput>

            <HorizontalInput
              name="V_z_Ed"
              label={<LatexLabel tex="V_{z,Ed}" />}
            >
              <InputNumber {...registerNumber("V_z_Ed")} suffix="kN" />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Buckling Lengths</SectionTitle>

            <HorizontalInput name="L" label={<LatexLabel tex="L" />}>
              <InputNumber {...registerNumber("L")} suffix="mm" />
            </HorizontalInput>

            <HorizontalInput name="k_y" label={<LatexLabel tex="k_y" />}>
              <InputNumber {...registerNumber("k_y")} />
            </HorizontalInput>

            <HorizontalInput name="k_z" label={<LatexLabel tex="k_z" />}>
              <InputNumber {...registerNumber("k_z")} />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Stability</SectionTitle>

            <ul>
              <li>Torsional deformations, toggle</li>
            </ul>

            <HorizontalInput name="k_LT" label={<LatexLabel tex="k_{LT}" />}>
              <InputNumber {...registerNumber("k_LT")} />
            </HorizontalInput>

            <HorizontalInput name="k_T" label={<LatexLabel tex="k_T" />}>
              <InputNumber {...registerNumber("k_T")} />
            </HorizontalInput>

            <HorizontalInput
              name="interaction_factor_method"
              label={<TextLabel>Method</TextLabel>}
            >
              <InputSelect
                {...registerSelect("interaction_factor_method")}
                options={INTERACTION_FACTOR_METHOD_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput
              name="coefficient_f_method"
              label={<LatexLabel tex="f" />}
            >
              <InputSelect
                {...registerSelect("coefficient_f_method")}
                options={COEFFICIENT_F_METHOD_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput
              name="buckling_curves_LT_policy"
              label={<TextLabel>LT curve policy</TextLabel>}
            >
              <InputSelect
                {...registerSelect("buckling_curves_LT_policy")}
                options={BUCKLING_CURVES_LT_POLICY_OPTIONS}
              />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>Moment Shape</SectionTitle>

            <HorizontalInput
              name="moment_shape_y"
              label={<TextLabel>Moment y</TextLabel>}
            >
              <InputSelect
                {...registerSelect("moment_shape_y")}
                options={MOMENT_SHAPE_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput name="psi_y" label={<LatexLabel tex="\psi_y" />}>
              <InputNumber {...registerNumber("psi_y")} />
            </HorizontalInput>

            <HorizontalInput
              name="support_condition_y"
              label={<TextLabel>Support y</TextLabel>}
            >
              <InputSelect
                {...registerSelect("support_condition_y")}
                options={SUPPORT_CONDITION_OPTIONS}
              />
            </HorizontalInput>

            <Separator />

            <HorizontalInput
              name="moment_shape_z"
              label={<TextLabel>Moment z</TextLabel>}
            >
              <InputSelect
                {...registerSelect("moment_shape_z")}
                options={MOMENT_SHAPE_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput name="psi_z" label={<LatexLabel tex="\psi_z" />}>
              <InputNumber {...registerNumber("psi_z")} />
            </HorizontalInput>

            <HorizontalInput
              name="support_condition_z"
              label={<TextLabel>Support z</TextLabel>}
            >
              <InputSelect
                {...registerSelect("support_condition_z")}
                options={SUPPORT_CONDITION_OPTIONS}
              />
            </HorizontalInput>

            <Separator />

            <HorizontalInput
              name="moment_shape_LT"
              label={<TextLabel>Moment LT</TextLabel>}
            >
              <InputSelect
                {...registerSelect("moment_shape_LT")}
                options={MOMENT_SHAPE_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput
              name="psi_LT"
              label={<LatexLabel tex="\psi_{LT}" />}
            >
              <InputNumber {...registerNumber("psi_LT")} />
            </HorizontalInput>

            <HorizontalInput
              name="support_condition_LT"
              label={<TextLabel>Support LT</TextLabel>}
            >
              <InputSelect
                {...registerSelect("support_condition_LT")}
                options={SUPPORT_CONDITION_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput
              name="load_application_LT"
              label={<TextLabel>Load LT</TextLabel>}
            >
              <InputSelect
                {...registerSelect("load_application_LT")}
                options={LOAD_APPLICATION_LT_OPTIONS}
              />
            </HorizontalInput>
          </Section>

          <SectionSeparator />

          <Section>
            <SectionTitle>National Annex</SectionTitle>
            <HorizontalInput
              name="annexId"
              label={<TextLabel>Annex</TextLabel>}
            >
              <InputSelect
                {...registerSelect("annexId")}
                options={ANNEX_OPTIONS}
              />
            </HorizontalInput>

            <HorizontalInput
              name="gamma_M0"
              label={<LatexLabel tex="\gamma_{M0}" />}
            >
              <InputNumber {...registerNumber("gamma_M0")} />
            </HorizontalInput>

            <HorizontalInput
              name="gamma_M1"
              label={<LatexLabel tex="\gamma_{M1}" />}
            >
              <InputNumber {...registerNumber("gamma_M1")} />
            </HorizontalInput>

            <HorizontalInput
              name="lambda_LT_0"
              label={<LatexLabel tex="\lambda_{LT,0}" />}
            >
              <InputNumber {...registerNumber("lambda_LT_0")} />
            </HorizontalInput>

            <HorizontalInput
              name="beta_LT"
              label={<LatexLabel tex="\beta_{LT}" />}
            >
              <InputNumber {...registerNumber("beta_LT")} />
            </HorizontalInput>
          </Section>
        </div>
      </Observer>
    </FormProvider>
  );
};

const LatexLabel = (props: ComponentProps<typeof Latex>) => (
  <Latex {...props} className="text-2xl" />
);

const TextLabel = (props: ComponentProps<"span">) => (
  <span {...props} className="text-md font-light" />
);

const Section = (props: ComponentPropsWithRef<"section">) => {
  return (
    <section className={twMerge("w-full flex flex-col gap-2")} {...props} />
  );
};

const SectionTitle = (props: ComponentPropsWithRef<"h4">) => {
  return (
    <h4
      className={twMerge("w-full uppercase font-semibold tracking-widest mb-2")}
      {...props}
    />
  );
};

const SectionSeparator = () => <div className="w-full h-px bg-slate-300" />;

const Separator = () => <div className="h-4" />;

const Observer = ({ children }: { children: ReactNode }) => {
  const { subscribe } = useFormContext();

  const onChange = useCallback<Parameters<typeof subscribe>[0]["callback"]>(
    ({ values }) => {
      console.log(values);
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: onChange,
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, onChange]);

  return children;
};

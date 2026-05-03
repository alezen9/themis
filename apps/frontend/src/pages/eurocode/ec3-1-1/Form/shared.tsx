import { Latex } from "@components/Latex";
import { ComponentProps, ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export const LatexLabel = (props: ComponentProps<typeof Latex>) => (
  <Latex {...props} className="text-2xl" />
);

export const TextLabel = (props: ComponentProps<"span">) => (
  <span {...props} className="text-md font-light" />
);

export const Section = (props: ComponentPropsWithRef<"section">) => {
  return (
    <section className={twMerge("w-full flex flex-col gap-2")} {...props} />
  );
};

export const SectionTitle = (props: ComponentPropsWithRef<"h4">) => {
  const { className, ...rest } = props;
  return (
    <h4
      className={twMerge(
        "w-full uppercase font-semibold tracking-widest mb-2",
        className,
      )}
      {...rest}
    />
  );
};

export const LineDivider = () => <div className="w-full h-px bg-slate-300" />;

export const SpacingDivider = () => <div className="h-4" />;

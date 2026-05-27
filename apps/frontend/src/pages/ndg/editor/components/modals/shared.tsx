import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export const Section = (props: ComponentPropsWithRef<"section">) => {
  return (
    <section
      className="w-full flex flex-col gap-2 shadow-envy-100/25 shadow-lg rounded-sm p-4"
      {...props}
    />
  );
};

export const SectionTitle = (props: ComponentPropsWithRef<"h4">) => {
  const { className, ...rest } = props;
  return (
    <h4
      className={twMerge(
        "w-full uppercase font-semibold tracking-widest mb-2 text-sand-900",
        className,
      )}
      {...rest}
    />
  );
};

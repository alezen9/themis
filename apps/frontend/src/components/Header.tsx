import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export const Header = (props: ComponentPropsWithoutRef<"h1">) => {
  const { className, ...headingProps } = props;

  return (
    <h1
      className={twMerge("text-4xl font-fredoka text-sand-900", className)}
      {...headingProps}
    />
  );
};

export const SubHeader = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...paragraphProps } = props;

  return (
    <p
      className={twMerge(
        "mt-3 text-sm leading-none font-extralight text-slate-600",
        className,
      )}
      {...paragraphProps}
    />
  );
};

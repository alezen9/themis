import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export const Header = (props: ComponentPropsWithoutRef<"h1">) => {
  const { className, ...headingProps } = props;

  return (
    <h1
      className={twMerge("text-4xl font-bold", className)}
      {...headingProps}
    />
  );
};

export const SubHeader = (props: ComponentPropsWithoutRef<"p">) => {
  const { className, ...paragraphProps } = props;

  return (
    <p
      className={twMerge(
        "mt-2 text-[1.15rem] leading-none font-extralight text-slate-600",
        className,
      )}
      {...paragraphProps}
    />
  );
};

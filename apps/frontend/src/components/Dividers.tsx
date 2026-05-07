import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const LineDivider = (props: ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge("h-px w-full bg-slate-300", className)}
      {...rest}
    />
  );
};

export const SpacingDivider = (props: ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return <div className={twMerge("h-4", className)} {...rest} />;
};

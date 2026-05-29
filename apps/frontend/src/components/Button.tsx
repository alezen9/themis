import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Button = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<"button">
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      ref={ref}
      className={twMerge(
        "bg-sand-800 text-white hover:bg-sand-900",
        "px-4 py-2 rounded-sm grid place-content-center",
        "text-sm",
        "cursor-pointer",
        "disabled:bg-transparent disabled:text-sand-200 disabled:cursor-not-allowed",
        "active:scale-[97.5%] transition-transform transition-color",
        className,
      )}
    />
  );
});

Button.displayName = "Button";

export const IconButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<"button">
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Button
      {...rest}
      ref={ref}
      className={twMerge("rounded-full p-0", className)}
    />
  );
});

IconButton.displayName = "IconButton";

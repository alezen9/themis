import { ComponentPropsWithRef, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva(
  "grid place-content-center rounded-sm cursor-pointer disabled:cursor-not-allowed active:scale-[97.5%] transition-[transform,colors]",
  {
    variants: {
      variant: {
        primary:
          "bg-sand-800 text-white hover:bg-sand-900 disabled:bg-transparent disabled:text-sand-200",
        secondary:
          "bg-sand-100 text-sand-900 hover:bg-sand-200 disabled:opacity-40",
        accent: "bg-envy-600 text-white hover:bg-envy-700 disabled:opacity-40",
        ghost:
          "bg-transparent text-sand-800 hover:bg-sand-100 disabled:opacity-40",
        danger:
          "bg-transparent text-red-700 hover:bg-red-50 hover:text-red-800 disabled:opacity-40",
      },
      size: { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ComponentPropsWithRef<"button"> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, variant, size, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      ref={ref}
      className={twMerge(button({ variant, size }), className)}
    />
  );
});

Button.displayName = "Button";

export const IconButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
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

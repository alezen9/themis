import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "grid place-content-center rounded-full cursor-pointer w-auto",
  {
    variants: {
      variant: {
        default: "bg-white/35 backdrop-blur-md",
        outline: "border border-gray-400",
        destructive: "bg-red-700 text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
      iconButton: { true: "aspect-square p-0" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconButton = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, iconButton }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

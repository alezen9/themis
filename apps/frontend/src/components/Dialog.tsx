import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type DialogProps = ComponentProps<typeof BaseDialog.Root> & {
  className?: string;
  children: ReactNode;
};

export const Dialog = (props: DialogProps) => {
  const { children, className, ...rootProps } = props;

  return (
    <BaseDialog.Root {...rootProps}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-sand-950/25 backdrop-blur-sm min-h-dvh" />
        <BaseDialog.Viewport className="fixed inset-0 py-6 overflow-y-auto">
          <BaseDialog.Popup
            className={twMerge(
              "m-auto w-full max-w-3xl",
              "rounded-sm border border-sand-200 bg-white",
              "shadow-xl shadow-sand-600/20",
              "focus:outline-none",
              className,
            )}
          >
            {children}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

type DialogHeaderProps = ComponentPropsWithoutRef<"header">;

export const DialogHeader = forwardRef<HTMLElement, DialogHeaderProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <header ref={ref} className={twMerge("px-6 pt-6", className)} {...rest} />
    );
  },
);

DialogHeader.displayName = "DialogHeader";

type DialogTitleProps = Omit<
  ComponentProps<typeof BaseDialog.Title>,
  "className"
> & { className?: string };

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <BaseDialog.Title
        ref={ref}
        className={twMerge(
          "text-[20px] leading-[1.1] font-semibold text-slate-950",
          className,
        )}
        {...rest}
      />
    );
  },
);

DialogTitle.displayName = "DialogTitle";

type DialogDescriptionProps = Omit<
  ComponentProps<typeof BaseDialog.Description>,
  "className"
> & { className?: string };

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <BaseDialog.Description
      ref={ref}
      className={twMerge(
        "mt-1.5 text-[13px] font-light text-slate-500",
        className,
      )}
      {...rest}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

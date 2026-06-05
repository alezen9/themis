import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type DialogProps = ComponentProps<typeof BaseDialog.Root> & {
  className?: string;
  children: ReactNode;
  header: ReactNode;
  footer?: ReactNode;
};

export const Dialog = (props: DialogProps) => {
  const { children, className, header, footer, ...rootProps } = props;

  return (
    <BaseDialog.Root {...rootProps}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-sand-950/25 backdrop-blur-sm min-h-dvh" />
        <BaseDialog.Viewport className="fixed inset-0 py-6 overflow-y-auto grid place-items-center">
          <BaseDialog.Popup
            className={twMerge(
              "w-full max-w-3xl max-h-full min-h-0 flex flex-col",
              "rounded-sm border border-sand-200 bg-white",
              "shadow-xl shadow-sand-600/20",
              "focus:outline-none",
              className,
            )}
          >
            {header}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
            {footer}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

export const DialogHeader = (props: ComponentPropsWithRef<"header">) => {
  const { className, ref, ...rest } = props;

  return (
    <header
      ref={ref}
      className={twMerge("shrink-0 p-4 border-b border-sand-400", className)}
      {...rest}
    />
  );
};

export const DialogFooter = (props: ComponentPropsWithRef<"footer">) => {
  const { className, ref, ...rest } = props;

  return (
    <footer
      ref={ref}
      className={twMerge("shrink-0 p-4 border-t border-sand-400", className)}
      {...rest}
    />
  );
};

type DialogTitleProps = Omit<
  ComponentProps<typeof BaseDialog.Title>,
  "className"
> & { className?: string };

export const DialogTitle = (props: DialogTitleProps) => {
  const { className, ref, ...rest } = props;

  return (
    <BaseDialog.Title
      ref={ref}
      className={twMerge(
        "text-[20px] leading-[1.1] font-semibold text-sand-900",
        className,
      )}
      {...rest}
    />
  );
};

export const DialogContent = (props: ComponentPropsWithRef<"div">) => {
  const { className, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={twMerge("shrink-0 p-4 flex flex-col", className)}
      {...rest}
    />
  );
};

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type DrawerProps = ComponentProps<typeof BaseDialog.Root> & {
  children: ReactNode;
  className?: string;
};

export const Drawer = (props: DrawerProps) => {
  const { children, className, ...rootProps } = props;

  return (
    <BaseDialog.Root {...rootProps}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-sand-950/25 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <BaseDialog.Viewport className="fixed inset-0 flex justify-end">
          <BaseDialog.Popup
            className={twMerge(
              "flex h-dvh w-full max-w-[560px] flex-col bg-white",
              "border-l border-sand-200 shadow-xl shadow-sand-600/20",
              "transition-transform duration-200 ease-out",
              "data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
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

export const DrawerHeader = (props: ComponentPropsWithRef<"header">) => {
  const { className, ref, ...rest } = props;

  return (
    <header
      ref={ref}
      className={twMerge(
        "flex shrink-0 flex-col gap-4 border-b border-sand-400 p-6",
        className,
      )}
      {...rest}
    />
  );
};

type DrawerTitleProps = Omit<
  ComponentProps<typeof BaseDialog.Title>,
  "className"
> & { className?: string };

export const DrawerTitle = (props: DrawerTitleProps) => {
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

export const DrawerContent = (props: ComponentPropsWithRef<"div">) => {
  const { className, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={twMerge(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain p-6",
        className,
      )}
      {...rest}
    />
  );
};

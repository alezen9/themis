import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { type ComponentProps, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { IconClose } from "@components/Icons";

type DrawerProps = ComponentProps<typeof BaseDialog.Root> & {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export const Drawer = (props: DrawerProps) => {
  const { title, children, className, ...rootProps } = props;

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
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sand-400 p-6">
              <BaseDialog.Title className="text-[20px] leading-[1.1] font-semibold text-sand-900">
                {title}
              </BaseDialog.Title>
              <BaseDialog.Close className="rounded-sm p-1 text-sand-600 hover:bg-sand-100 hover:text-sand-900 focus:outline-none">
                <IconClose className="size-5" />
              </BaseDialog.Close>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
              {children}
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

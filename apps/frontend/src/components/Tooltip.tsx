import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { type ReactElement, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  className?: string;
  sideOffset?: number;
};

export const Tooltip = (props: TooltipProps) => {
  const { content, children, className, sideOffset = 6 } = props;

  return (
    <BaseTooltip.Provider delay={200}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={sideOffset} className="z-50">
            <BaseTooltip.Popup
              className={twMerge(
                "max-w-xs rounded-sm border border-sand-200 bg-white px-2 py-1",
                "text-xs text-slate-800 shadow-lg shadow-sand-600/20",
                className,
              )}
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};

import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type PopoverProps = ComponentProps<typeof BasePopover.Root> & {
  children: ReactNode;
};

export const Popover = (props: PopoverProps) => {
  const { children, ...rootProps } = props;

  return <BasePopover.Root {...rootProps}>{children}</BasePopover.Root>;
};

type PopoverTriggerProps = Omit<
  ComponentProps<typeof BasePopover.Trigger>,
  "className"
> & { className?: string; unstyled?: boolean };

export const PopoverTrigger = (props: PopoverTriggerProps) => {
  const { className, unstyled = false, ref, ...rest } = props;

  return (
    <BasePopover.Trigger
      ref={ref}
      className={twMerge(
        !unstyled && [
          "inline-flex cursor-pointer items-center justify-center rounded-sm",
          "text-slate-800 transition-colors",
          "hover:text-slate-950",
        ],
        className,
      )}
      {...rest}
    />
  );
};

type PopoverPopupProps = Omit<
  ComponentProps<typeof BasePopover.Popup>,
  "className"
> & {
  children: ReactNode;
  className?: string;
  positionerProps?: Omit<
    ComponentProps<typeof BasePopover.Positioner>,
    "className"
  > & { className?: string };
  withArrow?: boolean;
};

export const PopoverPopup = (props: PopoverPopupProps) => {
  const {
    children,
    className,
    positionerProps,
    withArrow = true,
    ref,
    ...popupProps
  } = props;
  const {
    className: positionerClassName,
    collisionPadding = 12,
    sideOffset = 8,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        className={twMerge("outline-none", positionerClassName)}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        {...restPositionerProps}
      >
        <BasePopover.Popup
          ref={ref}
          className={twMerge(
            "max-w-sm rounded-sm border border-sand-200 bg-white",
            "px-3 py-2 text-sm text-slate-800",
            "shadow-xl shadow-sand-600/20",
            "focus:outline-none",
            className,
          )}
          {...popupProps}
        >
          {withArrow && (
            <BasePopover.Arrow className="data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180">
              <ArrowSvg />
            </BasePopover.Arrow>
          )}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
};

type PopoverTitleProps = Omit<
  ComponentProps<typeof BasePopover.Title>,
  "className"
> & { className?: string };

export const PopoverTitle = (props: PopoverTitleProps) => {
  const { className, ref, ...rest } = props;

  return (
    <BasePopover.Title
      ref={ref}
      className={twMerge(
        "text-sm leading-tight font-semibold text-slate-950",
        className,
      )}
      {...rest}
    />
  );
};

type PopoverDescriptionProps = Omit<
  ComponentProps<typeof BasePopover.Description>,
  "className"
> & { className?: string };

export const PopoverDescription = (props: PopoverDescriptionProps) => {
  const { className, ref, ...rest } = props;

  return (
    <BasePopover.Description
      ref={ref}
      className={twMerge(
        "mt-1 text-xs leading-relaxed font-light text-slate-500",
        className,
      )}
      {...rest}
    />
  );
};

type PopoverCloseProps = ComponentPropsWithRef<typeof BasePopover.Close> & {
  className?: string;
};

export const PopoverClose = (props: PopoverCloseProps) => {
  const { className, type = "button", ref, ...rest } = props;

  return (
    <BasePopover.Close
      ref={ref}
      className={twMerge(
        "inline-flex cursor-pointer items-center justify-center rounded-sm",
        "border border-sand-300 bg-white px-2 py-1",
        "text-xs font-medium text-slate-800 transition-colors",
        "hover:border-sand-400 hover:bg-sand-50 hover:text-slate-950",
        className,
      )}
      type={type}
      {...rest}
    />
  );
};

const ArrowSvg = (props: React.ComponentProps<"svg">) => {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-sand-50"
      />

      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="fill-sand-300"
      />
    </svg>
  );
};

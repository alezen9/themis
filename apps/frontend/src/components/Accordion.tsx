import { IconChevron } from "@components/Icons";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type AccordionProps = Omit<
  ComponentProps<typeof BaseCollapsible.Root>,
  "className"
> & { canExpand?: boolean; className?: string };

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => {
    const { canExpand = true, className, ...rest } = props;

    return (
      <BaseCollapsible.Root
        ref={ref}
        className={twMerge("group", className)}
        data-expandable={canExpand}
        {...rest}
        {...(!canExpand && { open: false })}
      />
    );
  },
);

Accordion.displayName = "Accordion";

type AccordionHeaderProps = Omit<
  ComponentProps<typeof BaseCollapsible.Trigger>,
  "className"
> & { className?: string; iconPosition?: "left" | "right" | "none" };

export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  AccordionHeaderProps
>((props, ref) => {
  const { children, className, iconPosition = "right", ...rest } = props;

  return (
    <BaseCollapsible.Trigger
      ref={ref}
      className={twMerge(
        "group/trigger flex w-full list-none items-center gap-3 bg-transparent p-3 text-left",
        "group-data-[expandable=true]:cursor-pointer",
        "group-data-[expandable=false]:pointer-events-none",
        className,
      )}
      {...rest}
    >
      {iconPosition === "left" && <Chevron />}
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      {iconPosition === "right" && <Chevron />}
    </BaseCollapsible.Trigger>
  );
});

AccordionHeader.displayName = "AccordionHeader";

type AccordionContentProps = Omit<
  ComponentProps<typeof BaseCollapsible.Panel>,
  "className"
> & { className?: string };

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>((props, ref) => {
  const { className, keepMounted = true, ...rest } = props;

  return (
    <BaseCollapsible.Panel
      ref={ref}
      className={twMerge(
        "px-3",
        "[&[hidden]:not([hidden='until-found'])]:hidden h-(--collapsible-panel-height) justify-end overflow-hidden text-sm transition-all ease-in-out data-ending-style:h-0 data-starting-style:h-0 duration-450",
        className,
      )}
      keepMounted={keepMounted}
      {...rest}
    />
  );
});

AccordionContent.displayName = "AccordionContent";

const Chevron = () => (
  <IconChevron className="size-3.5 shrink-0 overflow-visible stroke-2 transition-transform duration-200 group-data-open:rotate-180 group-data-[expandable=false]:hidden" />
);

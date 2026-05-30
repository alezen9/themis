import { IconChevron } from "@components/Icons";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { type ComponentProps, type CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

const accordionTransitionDurationClass =
  "[transition-duration:var(--accordion-duration)]";

type AccordionProps = Omit<
  ComponentProps<typeof BaseCollapsible.Root>,
  "className" | "style"
> & {
  canExpand?: boolean;
  className?: string;
  duration?: string;
  style?: CSSProperties & { "--accordion-duration"?: string };
};

export const Accordion = (props: AccordionProps) => {
  const {
    canExpand = true,
    className,
    duration = "200ms",
    style,
    ref,
    ...rest
  } = props;
  const accordionStyle: AccordionProps["style"] = {
    ...style,
    "--accordion-duration": style?.["--accordion-duration"] ?? duration,
  };

  return (
    <BaseCollapsible.Root
      ref={ref}
      className={twMerge("group", className)}
      style={
        accordionStyle as ComponentProps<typeof BaseCollapsible.Root>["style"]
      }
      data-expandable={canExpand}
      {...rest}
      {...(!canExpand && { open: false })}
    />
  );
};

type AccordionHeaderProps = Omit<
  ComponentProps<typeof BaseCollapsible.Trigger>,
  "className"
> & { className?: string; iconPosition?: "left" | "right" | "none" };

export const AccordionHeader = (props: AccordionHeaderProps) => {
  const { children, className, iconPosition = "right", ref, ...rest } = props;

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
};

type AccordionContentProps = Omit<
  ComponentProps<typeof BaseCollapsible.Panel>,
  "className"
> & { className?: string };

export const AccordionContent = (props: AccordionContentProps) => {
  const { children, className, keepMounted = true, ref, ...rest } = props;

  return (
    <BaseCollapsible.Panel
      ref={ref}
      className={twMerge(
        "px-3",
        "[&[hidden]:not([hidden='until-found'])]:hidden grid grid-rows-[1fr] overflow-hidden text-sm transition-[grid-template-rows] ease-in-out data-ending-style:grid-rows-[0fr] data-starting-style:grid-rows-[0fr]",
        accordionTransitionDurationClass,
        className,
      )}
      keepMounted={keepMounted}
      {...rest}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </BaseCollapsible.Panel>
  );
};

const Chevron = () => (
  <IconChevron
    className={twMerge(
      "size-3.5 shrink-0 overflow-visible stroke-2 transition-transform group-data-open:rotate-180 group-data-[expandable=false]:hidden",
      accordionTransitionDurationClass,
    )}
  />
);

import { IconChevron } from "@components/Icons";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type AccordionProps = ComponentPropsWithoutRef<"details"> & {
  canExpand?: boolean;
};

export const Accordion = forwardRef<HTMLDetailsElement, AccordionProps>(
  (props, ref) => {
    const { canExpand = true, className, ...rest } = props;

    return (
      <details
        ref={ref}
        className={twMerge("group border border-sand-100 bg-white", className)}
        data-expandable={canExpand}
        {...rest}
        {...(!canExpand && { open: false })}
      />
    );
  },
);

Accordion.displayName = "Accordion";

type AccordionHeaderProps = ComponentPropsWithoutRef<"summary"> & {
  iconPosition?: "left" | "right" | "none";
};

export const AccordionHeader = forwardRef<
  HTMLElement,
  AccordionHeaderProps
>((props, ref) => {
  const { children, className, iconPosition = "right", ...rest } = props;

  return (
    <summary
      ref={ref}
      className={twMerge(
        "flex list-none items-center gap-3 bg-transparent p-3",
        "group-data-[expandable=true]:cursor-pointer",
        "group-data-[expandable=false]:pointer-events-none",
        "[&::-webkit-details-marker]:hidden",
        className,
      )}
      {...rest}
    >
      {iconPosition === "left" && <Chevron />}
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      {iconPosition === "right" && <Chevron />}
    </summary>
  );
});

AccordionHeader.displayName = "AccordionHeader";

type AccordionContentProps = ComponentPropsWithoutRef<"div">;

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <div ref={ref} className={twMerge("p-3", className)} {...rest} />
  );
});

AccordionContent.displayName = "AccordionContent";

const Chevron = () => (
  <IconChevron className="size-3.5 shrink-0 overflow-visible stroke-2 transition-transform duration-200 group-open:rotate-180 group-data-[expandable=false]:hidden" />
);

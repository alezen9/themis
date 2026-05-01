import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Ec3FormPanelProps = ComponentPropsWithoutRef<"div">;
type Ec3FormSectionProps = ComponentPropsWithoutRef<"section">;
type Ec3FormSectionContentProps = ComponentPropsWithoutRef<"div">;
type Ec3FormSectionTitleProps = { children: ReactNode; className?: string };

export const Ec3FormPanel = (props: Ec3FormPanelProps) => {
  const { children, className, ...panelProps } = props;

  return (
    <div
      className={twMerge(
        "w-[31rem] shrink-0 border-r border-slate-200 bg-white pr-10 pb-10",
        className,
      )}
      {...panelProps}
    >
      {children}
    </div>
  );
};

export const Ec3FormSection = (props: Ec3FormSectionProps) => {
  const { children, className, ...sectionProps } = props;

  return (
    <section
      className={twMerge("flex flex-col gap-3", className)}
      {...sectionProps}
    >
      {children}
    </section>
  );
};

export const Ec3FormSectionTitle = (props: Ec3FormSectionTitleProps) => {
  const { children, className } = props;

  return (
    <h2
      className={twMerge(
        "text-xs font-semibold tracking-[0.16em] text-slate-900 uppercase",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const Ec3FormSectionContent = (props: Ec3FormSectionContentProps) => {
  const { children, className, ...contentProps } = props;

  return (
    <div
      className={twMerge("flex flex-col gap-1", className)}
      {...contentProps}
    >
      {children}
    </div>
  );
};

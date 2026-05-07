import { Latex } from "@components/Latex";
import { Table, TableDataCell, TableHeaderCell } from "@components/Table";
import { ComponentProps, ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export const LatexLabel = (props: ComponentProps<typeof Latex>) => {
  const { className, ...rest } = props;
  return <Latex className={twMerge("text-2xl", className)} {...rest} />;
};

export const TextLabel = (props: ComponentProps<"span">) => (
  <span {...props} className="text-md font-light" />
);

export const Section = (props: ComponentPropsWithRef<"section">) => {
  return (
    <section className={twMerge("w-full flex flex-col gap-2")} {...props} />
  );
};

export const SectionTitle = (props: ComponentPropsWithRef<"h4">) => {
  const { className, ...rest } = props;
  return (
    <h4
      className={twMerge(
        "w-full uppercase font-semibold tracking-widest mb-2",
        className,
      )}
      {...rest}
    />
  );
};

export const InfoTable = (props: ComponentProps<typeof Table>) => {
  const { className, ...rest } = props;

  return (
    <div className="overflow-hidden rounded-sm border border-sand-100">
      <Table
        className={twMerge(
          "overflow-hidden rounded-sm [&_tr]:border-none",
          className,
        )}
        {...rest}
      />
    </div>
  );
};

export const InfoTableHeaderCell = (
  props: ComponentProps<typeof TableHeaderCell>,
) => {
  const { className, colSpan = 3, ...rest } = props;

  return (
    <TableHeaderCell
      colSpan={colSpan}
      className={twMerge(
        "px-2 py-1 text-xs uppercase tracking-widest text-sand-900",
        className,
      )}
      {...rest}
    />
  );
};

export const InfoTableLabelCell = (
  props: ComponentProps<typeof TableHeaderCell>,
) => {
  const { className, scope = "row", ...rest } = props;

  return (
    <TableHeaderCell
      scope={scope}
      className={twMerge("w-14 font-normal text-xl leading-1", className)}
      {...rest}
    />
  );
};

export const InfoTableValueCell = (
  props: ComponentProps<typeof TableDataCell>,
) => {
  const { align = "right", className, ...rest } = props;

  return (
    <TableDataCell
      align={align}
      className={twMerge("min-w-0 tabular-nums", className)}
      {...rest}
    />
  );
};

export const InfoTableUnitCell = (
  props: ComponentProps<typeof TableDataCell>,
) => {
  const { className, ...rest } = props;

  return (
    <TableDataCell
      className={twMerge("w-16 text-sm opacity-50", className)}
      {...rest}
    />
  );
};

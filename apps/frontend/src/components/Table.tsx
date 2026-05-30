import { cva } from "class-variance-authority";
import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type TableProps = ComponentPropsWithRef<"table">;

export const Table = (props: TableProps) => {
  const { className, ref, ...rest } = props;

  return (
    <table
      ref={ref}
      className={twMerge(
        "relative box-border w-full border-collapse text-sm",
        className,
      )}
      {...rest}
    />
  );
};

const tableHeaderVariants = cva("relative box-border", {
  variants: { sticky: { true: "sticky top-0 z-10 bg-white" } },
});

type TableHeaderProps = ComponentPropsWithRef<"thead"> & { sticky?: boolean };

export const TableHeader = (props: TableHeaderProps) => {
  const { className, sticky = false, ref, ...rest } = props;

  return (
    <thead
      ref={ref}
      className={twMerge(tableHeaderVariants({ sticky }), className)}
      {...rest}
    />
  );
};

type TableBodyProps = ComponentPropsWithRef<"tbody">;

export const TableBody = (props: TableBodyProps) => {
  const { className, ref, ...rest } = props;

  return (
    <tbody
      ref={ref}
      className={twMerge("relative box-border", className)}
      {...rest}
    />
  );
};

const tableFooterVariants = cva("relative box-border", {
  variants: { sticky: { true: "sticky bottom-0 z-10 bg-white" } },
});

type TableFooterProps = ComponentPropsWithRef<"tfoot"> & { sticky?: boolean };

export const TableFooter = (props: TableFooterProps) => {
  const { className, sticky = false, ref, ...rest } = props;

  return (
    <tfoot
      ref={ref}
      className={twMerge(tableFooterVariants({ sticky }), className)}
      {...rest}
    />
  );
};

const tableRowVariants = cva(
  "relative box-border border-b border-sand-800 last:border-b-0 transition-colors",
  { variants: { active: { true: "bg-sand-50" } } },
);

type TableRowProps = ComponentPropsWithRef<"tr"> & { active?: boolean };

export const TableRow = (props: TableRowProps) => {
  const { active = false, className, ref, ...rest } = props;

  return (
    <tr
      ref={ref}
      className={twMerge(tableRowVariants({ active }), className)}
      {...rest}
    />
  );
};

const tableCellVariants = cva("relative box-border px-2 py-1 align-middle", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: { align: "left" },
});

type TableCellAlign = "left" | "center" | "right" | "justify";

type TableHeaderCellProps = ComponentPropsWithRef<"th"> & {
  align?: TableCellAlign;
};

export const TableHeaderCell = (props: TableHeaderCellProps) => {
  const { align = "left", className, ref, ...rest } = props;

  return (
    <th
      ref={ref}
      className={twMerge(
        tableCellVariants({ align }),
        "font-semibold",
        className,
      )}
      {...rest}
    />
  );
};

type TableDataCellProps = ComponentPropsWithRef<"td"> & {
  align?: TableCellAlign;
};

export const TableDataCell = (props: TableDataCellProps) => {
  const { align = "left", className, ref, ...rest } = props;

  return (
    <td
      ref={ref}
      className={twMerge(tableCellVariants({ align }), className)}
      {...rest}
    />
  );
};

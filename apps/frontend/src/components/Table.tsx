import { cva } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type TableProps = ComponentPropsWithoutRef<"table">;

export const Table = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const { className, ...rest } = props;

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
});

Table.displayName = "Table";

const tableHeaderVariants = cva("relative box-border", {
  variants: { sticky: { true: "sticky top-0 z-10 bg-white" } },
});

type TableHeaderProps = ComponentPropsWithoutRef<"thead"> & {
  sticky?: boolean;
};

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>((props, ref) => {
  const { className, sticky = false, ...rest } = props;

  return (
    <thead
      ref={ref}
      className={twMerge(tableHeaderVariants({ sticky }), className)}
      {...rest}
    />
  );
});

TableHeader.displayName = "TableHeader";

type TableBodyProps = ComponentPropsWithoutRef<"tbody">;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <tbody
        ref={ref}
        className={twMerge("relative box-border", className)}
        {...rest}
      />
    );
  },
);

TableBody.displayName = "TableBody";

const tableFooterVariants = cva("relative box-border", {
  variants: { sticky: { true: "sticky bottom-0 z-10 bg-white" } },
});

type TableFooterProps = ComponentPropsWithoutRef<"tfoot"> & {
  sticky?: boolean;
};

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>((props, ref) => {
  const { className, sticky = false, ...rest } = props;

  return (
    <tfoot
      ref={ref}
      className={twMerge(tableFooterVariants({ sticky }), className)}
      {...rest}
    />
  );
});

TableFooter.displayName = "TableFooter";

const tableRowVariants = cva(
  "relative box-border border-b border-sand-800 last:border-b-0 transition-colors",
  { variants: { active: { true: "bg-sand-50" } } },
);

type TableRowProps = ComponentPropsWithoutRef<"tr"> & { active?: boolean };

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    const { active = false, className, ...rest } = props;

    return (
      <tr
        ref={ref}
        className={twMerge(tableRowVariants({ active }), className)}
        {...rest}
      />
    );
  },
);

TableRow.displayName = "TableRow";

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

type TableHeaderCellProps = ComponentPropsWithoutRef<"th"> & {
  align?: TableCellAlign;
};

export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>((props, ref) => {
  const { align = "left", className, ...rest } = props;

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
});

TableHeaderCell.displayName = "TableHeaderCell";

type TableDataCellProps = ComponentPropsWithoutRef<"td"> & {
  align?: TableCellAlign;
};

export const TableDataCell = forwardRef<
  HTMLTableCellElement,
  TableDataCellProps
>((props, ref) => {
  const { align = "left", className, ...rest } = props;

  return (
    <td
      ref={ref}
      className={twMerge(tableCellVariants({ align }), className)}
      {...rest}
    />
  );
});

TableDataCell.displayName = "TableDataCell";

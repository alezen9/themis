import type { ReactNode } from "react";

type NodeDialogFieldProps = {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const NodeDialogField = ({
  label,
  hint,
  className,
  children,
}: NodeDialogFieldProps) => {
  const classes = ["flex flex-col gap-1.5", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes}>
      <span className="text-[12px] font-bold text-slate-700">{label}</span>
      {hint ? (
        <span className="text-[11px] leading-tight text-slate-500">{hint}</span>
      ) : null}
      {children}
    </label>
  );
};

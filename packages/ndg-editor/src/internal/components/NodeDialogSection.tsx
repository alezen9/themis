import type { ReactNode } from "react";

type NodeDialogSectionProps = { title: string; children: ReactNode };

export const NodeDialogSection = ({
  title,
  children,
}: NodeDialogSectionProps) => {
  return (
    <div className="mt-[18px]">
      <h3 className="mb-2.5 text-[14px] font-bold text-slate-900">{title}</h3>
      {children}
    </div>
  );
};

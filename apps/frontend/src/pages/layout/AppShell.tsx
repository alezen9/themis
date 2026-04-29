import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

type AppShellProps = { children: ReactNode };

export const AppShell = (props: AppShellProps) => {
  const { children } = props;

  return (
    <div className="min-h-screen text-slate-950 flex flex-nowrap relative">
      <AppSidebar />
      <main className="min-h-screen box-border ml-90 w-full">{children}</main>
    </div>
  );
};

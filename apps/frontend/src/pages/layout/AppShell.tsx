import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

type AppShellProps = { children: ReactNode };

export const AppShell = (props: AppShellProps) => {
  const { children } = props;

  return (
    <div className="relative flex h-full flex-nowrap overflow-hidden text-slate-950">
      <AppSidebar />
      <main className="ml-(--sidebar-width) flex min-w-0 flex-1 flex-col overflow-y-auto px-4 py-8 [--shell-padding-x:1rem] [--shell-padding-y:2.25rem]">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
};

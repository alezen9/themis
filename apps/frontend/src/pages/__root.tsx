import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "./layout/AppShell";
import { NotFoundPage } from "./layout/NotFoundPage";

export const Route = createRootRoute({
  shellComponent: AppShell,
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

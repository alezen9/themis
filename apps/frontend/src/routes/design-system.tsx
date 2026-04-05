/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { PageDesignSystem } from "../pages/design-system/PageDesignSystem";

type DesignSystemSearch = { component?: string };

export const Route = createFileRoute("/design-system")({
  validateSearch: (search: Record<string, unknown>): DesignSystemSearch => ({
    component:
      typeof search.component === "string" ? search.component : undefined,
  }),
  component: DesignSystemRoute,
});

function DesignSystemRoute() {
  const { component } = Route.useSearch();

  return <PageDesignSystem componentId={component} />;
}

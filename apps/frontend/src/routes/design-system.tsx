import { createFileRoute } from "@tanstack/react-router";
import { PageDesignSystem } from "../pages/design-system/PageDesignSystem";

export const Route = createFileRoute("/design-system")({
  component: PageDesignSystem,
});

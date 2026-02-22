import { createFileRoute } from "@tanstack/react-router";
import { PageAboutUs } from "../pages/about/PageAboutUs";

export const Route = createFileRoute("/about")({
  component: PageAboutUs,
});

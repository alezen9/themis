import { createFileRoute } from "@tanstack/react-router";
import { PageHome } from "./PageHome";

export const Route = createFileRoute("/")({ component: PageHome });

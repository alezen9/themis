import { createFileRoute } from "@tanstack/react-router";
import { PageHome } from "../pages/home/PageHome";

export const Route = createFileRoute("/")({ component: PageHome });

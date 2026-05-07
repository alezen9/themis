import { createFileRoute } from "@tanstack/react-router";
import { IndexRoute } from "./IndexRoute";

export const Route = createFileRoute("/")({ component: IndexRoute });

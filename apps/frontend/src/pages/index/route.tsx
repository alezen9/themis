import { createFileRoute, Navigate } from "@tanstack/react-router";
import { DEFAULT_LANDING_ROUTE } from "../routeDefaults";

const IndexRoute = () => <Navigate replace to={DEFAULT_LANDING_ROUTE} />;

export const Route = createFileRoute("/")({ component: IndexRoute });

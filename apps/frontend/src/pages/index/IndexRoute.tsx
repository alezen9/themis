import { Navigate } from "@tanstack/react-router";
import { DEFAULT_LANDING_ROUTE } from "../routeDefaults";

export const IndexRoute = () => <Navigate replace to={DEFAULT_LANDING_ROUTE} />;

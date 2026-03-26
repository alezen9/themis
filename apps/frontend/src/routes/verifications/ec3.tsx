import { createFileRoute } from "@tanstack/react-router";
import { Ec3VerificationsPage } from "../../features/verifications/ec3/Ec3VerificationsPage";

export const Route = createFileRoute("/verifications/ec3")({
  component: Ec3VerificationsPage,
});

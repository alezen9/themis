import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "../pages/editor/PageEditor";

export const Route = createFileRoute("/editor")({ component: PageEditor });

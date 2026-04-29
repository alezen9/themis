import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "./PageEditor";

export const Route = createFileRoute("/ndg/editor")({ component: PageEditor });

import { VerificationSchema } from "@ndg/ndg-ec3";
import type { Node } from "@ndg/ndg-ec3";

const modules = import.meta.glob<{ default: unknown }>(
  "../verifications/**/*.json",
  { eager: false },
);

// "../verifications/ec3/uls-compression.json" → { section: "ec3", key: "uls-compression" }
function parsePath(path: string): { section: string; key: string } {
  const parts = path.split("/");
  return {
    section: parts[parts.length - 2],
    key: parts[parts.length - 1].replace(".json", ""),
  };
}

export function getVerificationKeys(section: string): string[] {
  return Object.keys(modules)
    .filter((p) => p.includes(`/verifications/${section}/`))
    .map((p) => parsePath(p).key);
}

export function getSections(): string[] {
  return [...new Set(Object.keys(modules).map((p) => parsePath(p).section))];
}

export async function loadVerification(
  section: string,
  key: string,
): Promise<Node[]> {
  const path = `../verifications/${section}/${key}.json`;
  const loader = modules[path];
  if (!loader) throw new Error(`"${section}/${key}" not found`);
  const raw = await loader();
  return VerificationSchema.parse(raw.default);
}

import type { Ec3WorkbenchSessionState } from "./use-ec3-workbench";

const EC3_DEBUG_SESSION_KIND = "ec3-workbench";

type Ec3DebugSessionEnvelope = {
  kind: typeof EC3_DEBUG_SESSION_KIND;
  version: 1;
  session: Ec3WorkbenchSessionState;
};

const toBase64Url = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
};

const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = padded.length % 4;
  const normalized =
    remainder === 0 ? padded : `${padded}${"=".repeat(4 - remainder)}`;
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
};

export const encodeEc3DebugSession = (
  session: Ec3WorkbenchSessionState,
): string => {
  const envelope: Ec3DebugSessionEnvelope = {
    kind: EC3_DEBUG_SESSION_KIND,
    version: 1,
    session,
  };

  return toBase64Url(JSON.stringify(envelope));
};

export const decodeEc3DebugSession = (
  value: string | undefined | null,
): Partial<Ec3WorkbenchSessionState> | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(value)) as Partial<Ec3DebugSessionEnvelope>;

    if (
      parsed.kind !== EC3_DEBUG_SESSION_KIND ||
      parsed.version !== 1 ||
      !parsed.session ||
      typeof parsed.session !== "object"
    ) {
      return null;
    }

    return parsed.session;
  } catch {
    return null;
  }
};

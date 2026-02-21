import { useQueries } from "@tanstack/react-query";
import { getVerificationKeys, loadVerification } from "../lib/verifications";

export function useVerifications(section: string) {
  const keys = getVerificationKeys(section);

  return useQueries({
    queries: keys.map((key) => ({
      queryKey: ["verification", section, key],
      queryFn: () => loadVerification(section, key),
      staleTime: Infinity,
    })),
  });
}

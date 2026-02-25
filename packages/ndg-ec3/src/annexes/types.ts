import type { NationalAnnex } from "@ndg/ndg-core";

/** EC3-specific national annex with NDP parameters beyond partial factors. */
export interface Ec3NationalAnnex extends NationalAnnex {
  name: string;
  /** "A" | "B" | "both" — Annex A (Method 1) vs Annex B (Method 2) for interaction factors */
  interactionFactorMethod: "A" | "B" | "both";
}

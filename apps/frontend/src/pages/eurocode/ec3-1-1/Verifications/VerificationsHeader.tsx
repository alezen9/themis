import { twMerge } from "tailwind-merge";
import { useEc311DerivedStore } from "../useEc311DerivedStore";
import { formatNumber } from "@formatters/number";
import { useMemo } from "react";

export const VerificationsHeader = () => {
  const verifications = useEc311DerivedStore(state => state.verifications);
  const verificationsState = useEc311DerivedStore(
    state => state.verificationsState,
  );
  const threshold = useEc311DerivedStore(state => state.threshold);

  const { status, formattedValue, reason } = useMemo(() => {
    if (!verificationsState.isValid) {
      return {
        formattedValue: "N/A",
        reason: verificationsState.reason,
        status: "invalid",
      };
    }

    const utilisationFactors = verifications
      .map(verification => verification.payload.data?.utilisation)
      .filter(utilisationFactor => utilisationFactor !== undefined);

    if (!utilisationFactors.length)
      return { formattedValue: "N/A", reason: undefined, status: "empty" };

    const maxUtilisationFactor = Math.max(...utilisationFactors);

    return {
      formattedValue: formatNumber(maxUtilisationFactor),
      reason: undefined,
      status: maxUtilisationFactor <= threshold ? "pass" : "fail",
    };
  }, [threshold, verifications, verificationsState]);

  return (
    <div
      className={twMerge(
        "h-full w-full flex flex-col justify-center items-end px-2 rounded-sm",
        "max-h-32",
      )}
    >
      <span
        data-testid="verification-max-utilisation"
        className={twMerge(
          "text-8xl tabular-nums font-light",
          (status === "invalid" || status === "empty") && "text-gray-400",
          status === "pass" && "text-envy-400",
          status === "fail" && "text-red-400",
        )}
      >
        {formattedValue}
      </span>
      <span
        className="min-h-5 text-sm tracking-widest text-red-500 uppercase"
        data-testid="verification-state-reason"
      >
        {reason}
      </span>
    </div>
  );
};

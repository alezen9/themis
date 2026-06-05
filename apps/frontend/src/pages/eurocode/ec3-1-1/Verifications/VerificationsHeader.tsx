import { twMerge } from "tailwind-merge";
import { useEc311DerivedStore } from "../useEc311DerivedStore";
import { formatNumber } from "@formatters/number";

export const VerificationsHeader = () => {
  const verifications = useEc311DerivedStore(state => state.verifications);
  const threshold = useEc311DerivedStore(state => state.threshold);

  const ratios = verifications.flatMap(verification =>
    verification.payload.data ? [verification.payload.data.utilisation] : [],
  );
  const maxRatio = ratios.length > 0 ? Math.max(...ratios) : undefined;
  const formattedMaxRatio =
    maxRatio === undefined ? "N/A" : formatNumber(maxRatio);
  const status =
    maxRatio === undefined ? "empty" : maxRatio < threshold ? "pass" : "fail";

  return (
    <div
      className={twMerge(
        "h-full w-full flex justify-end items-center px-2 rounded-sm",
        "max-h-32",
        // isSatisfied && "bg-envy-100/50",
        // !isSatisfied && "bg-red-100/50",
      )}
    >
      <span
        className={twMerge(
          "text-8xl tabular-nums font-light",
          status === "empty" && "text-sand-300",
          status === "pass" && "text-envy-400",
          status === "fail" && "text-red-400",
        )}
      >
        {formattedMaxRatio}
      </span>
    </div>
  );
};

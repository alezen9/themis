import { twMerge } from "tailwind-merge";
import { useEc311DerivedStore } from "../useEc311DerivedStore";
import { formatNumber } from "@formatters/number";

export const VerificationsHeader = () => {
  const verifications = useEc311DerivedStore(state => state.verifications);
  const threshold = useEc311DerivedStore(state => state.threshold);

  const ratios = verifications.flatMap(verification =>
    verification.payload.data ? [verification.payload.data.utilisation] : [],
  );
  const maxRatio = Math.max(...ratios);
  const formattdMaxRatio = maxRatio ? formatNumber(maxRatio) : "N/A";
  const isSatisfied = maxRatio < threshold;

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
          isSatisfied && "text-envy-400",
          !isSatisfied && "text-red-400",
        )}
      >
        {formattdMaxRatio}
      </span>
    </div>
  );
};

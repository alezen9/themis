import { useEc311DerivedStore } from "../useEc311DerivedStore";

export const VerificationsHeader = () => {
  const verifications = useEc311DerivedStore((state) => state.verifications);
  const ratios = verifications.flatMap((verification) =>
    verification.payload.data ? [verification.payload.data.ratio] : [],
  );
  const maxRatio = ratios.length > 0 ? Math.max(...ratios).toFixed(2) : "N/A";

  return (
    <div className="h-full w-full flex justify-end px-2">
      <span className="text-8xl text-red-400 text-shadow-lg tabular-nums font-light text-shadow-sand-800/10">
        {maxRatio}
      </span>
    </div>
  );
};

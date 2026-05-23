import { fakeVerifications } from "./fake-verifications";

export const VerificationsHeader = () => {
  const ratios = fakeVerifications
    .map(({ ratio }) => ratio)
    .filter((ratio) => typeof ratio === "number");
  const maxRatio = Math.max(...ratios);
  return (
    <div className="h-full w-full flex justify-end px-2">
      <span className="text-8xl text-red-400 text-shadow-lg tabular-nums font-light text-shadow-sand-800/10">
        {maxRatio}
      </span>
    </div>
  );
};

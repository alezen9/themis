import { VerificationBarChart } from "./VerificationBarChart";
import { VerificationsHeader } from "./VerificationsHeader";

export const Verifications = () => {
  return (
    <div className="flex h-full w-full flex-col items-end justify-between pl-2">
      <VerificationsHeader />
      <VerificationBarChart />
    </div>
  );
};

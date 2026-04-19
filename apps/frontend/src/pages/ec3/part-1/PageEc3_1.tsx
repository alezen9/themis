import { Ec3VerificationForm } from "../../../features/verifications/ec3/components/ec3VerificationForm/Ec3VerificationForm";

export const PageEc3_1 = () => {
  return (
    <main className="grid grid-cols-[minmax(200px,500px)_1fr] gap-10 p-10">
      <Ec3VerificationForm />
      <div>Rest</div>
    </main>
  );
};

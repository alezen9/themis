import { Header, SubHeader } from "@components/Header";
import { Form } from "./Form";

export const PageEc3_1_1 = () => {
  return (
    <main className="flex flex-col gap-8">
      <header>
        <Header>Steel members</Header>
        <SubHeader>EC3-1-1 · Member checks according to EN 1993-1-1</SubHeader>
      </header>

      <div className="flex items-start gap-10">
        {/* <Ec3VerificationForm /> */}
        <Form />
        <div className="min-w-0 flex-1">Rest</div>
      </div>
    </main>
  );
};

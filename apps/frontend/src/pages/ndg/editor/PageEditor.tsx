import { Header, SubHeader } from "@components/Header";

export const PageEditor = () => {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <header className="shrink-0">
        <Header>NDG editor</Header>
        <SubHeader>Draft and inspect verification graphs</SubHeader>
      </header>

      <section
        aria-label="NDG editor workspace"
        className="min-h-0 flex-1 rounded-sm border border-dashed border-sand-300 bg-sand-50/40"
      />
    </main>
  );
};

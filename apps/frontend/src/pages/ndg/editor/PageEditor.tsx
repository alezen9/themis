import { Header, SubHeader } from "@components/Header";
import { NdgEditor } from "./NdgEditor";
import { NdgEditorToolbar } from "./components/NdgEditorToolbar";

export const PageEditor = () => {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <header className="flex shrink-0 items-start justify-between gap-6">
        <div>
          <Header>Normative Directed Graph Editor</Header>
          <SubHeader>Draft and inspect verification graphs</SubHeader>
        </div>
        <NdgEditorToolbar />
      </header>

      <section
        aria-label="NDG editor workspace"
        className="min-h-0 flex-1 overflow-hidden rounded-sm border border-sand-200 bg-white"
      >
        <NdgEditor />
      </section>
    </main>
  );
};

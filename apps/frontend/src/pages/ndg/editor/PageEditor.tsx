import { Header, SubHeader } from "@components/Header";
import { NdgEditor } from "./NdgEditor";
import { useNdgEditorStore } from "./controller/useNdgEditorStore";

export const PageEditor = () => {
  const exportDocument = useNdgEditorStore((state) => state.exportDocument);

  const onExportDocument = () => {
    const document = exportDocument();
    const blob = new Blob([JSON.stringify(document, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `ndg-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <header className="flex shrink-0 items-start justify-between gap-6">
        <div>
          <Header>Normative Directed Graph Editor</Header>
          <SubHeader>Draft and inspect verification graphs</SubHeader>
        </div>
        <button
          type="button"
          className="h-9 rounded-sm bg-sand-900 px-4 text-sm text-white"
          onClick={onExportDocument}
        >
          Export JSON
        </button>
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

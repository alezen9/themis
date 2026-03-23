import { NdgEditor, type NdgEditorDocument } from "@ndg/ndg-editor";

const starterDocument: NdgEditorDocument<{ label: string }> = {
  viewport: { x: 0, y: 0, zoom: 1 },
  nodes: [
    {
      id: "node_1",
      position: { x: 160, y: 120 },
      data: { label: "Starter node" },
    },
  ],
  edges: [],
};

export function PageEditor() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-950">Editor</h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Boilerplate route for the new internal editor package. The package
            already exports a minimal React Flow shell plus base document types.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <NdgEditor document={starterDocument} className="h-[70vh]" />
        </section>
      </div>
    </div>
  );
}

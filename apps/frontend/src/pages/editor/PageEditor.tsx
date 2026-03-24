import { NdgEditor } from "@ndg/ndg-editor";

export const PageEditor = () => {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-950">Editor</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Minimal React Flow boilerplate from <code>@ndg/ndg-editor</code>.
        </p>
      </header>

      <section className="h-[70vh] border border-slate-200 bg-white flex">
        <NdgEditor fitView className="h-full" />
      </section>
    </div>
  );
};

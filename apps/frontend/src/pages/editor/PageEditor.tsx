import { useRef, useState, type ChangeEvent } from "react";
import {
  NdgEditor,
  type NdgEditorDraftV1,
  type NdgEditorRef,
} from "@ndg/ndg-editor";

const downloadTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const PageEditor = () => {
  const editorRef = useRef<NdgEditorRef>(null);
  const [error, setError] = useState<string | null>(null);

  const onSaveDraft = () => {
    try {
      const draft = editorRef.current?.save();
      if (!draft) {
        setError("Editor is not ready");
        return;
      }

      downloadTextFile("verification.ndg.json", `${JSON.stringify(draft, null, 2)}\n`);
      setError(null);
    } catch (saveError) {
      const errorMessage =
        saveError instanceof Error ? saveError.message : "Could not save draft";
      setError(errorMessage);
    }
  };

  const onLoadDraft = async (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const rawText = await file.text();
      const parsedDraft = JSON.parse(rawText) as NdgEditorDraftV1;
      editorRef.current?.load(parsedDraft);
      setError(null);
    } catch (loadError) {
      const errorMessage =
        loadError instanceof Error ? loadError.message : "Could not load draft";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8 grid grid-rows-[auto_1fr]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-950">Editor</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          NDG graph editor with manual save/load draft actions
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            className="rounded-md border border-teal-800 bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-teal-900 hover:bg-teal-800"
            onClick={onSaveDraft}
            type="button"
          >
            Save draft
          </button>
          <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50">
            Load draft
            <input
              accept=".ndg.json,.json"
              className="hidden"
              onChange={onLoadDraft}
              type="file"
            />
          </label>
        </div>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
      </header>

      <section className="h-full border border-slate-200 bg-white flex">
        <NdgEditor ref={editorRef} className="h-full w-full" />
      </section>
    </div>
  );
};

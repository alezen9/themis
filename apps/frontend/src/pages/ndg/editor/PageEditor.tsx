import { useRef, useState, type ChangeEvent, type ComponentProps } from "react";
import {
  NdgEditor,
  type NdgEditorDraftV1,
  type NdgEditorRef,
} from "./NdgEditor";
import { Header, SubHeader } from "@components/Header";
import { ec311InputKeyOptions } from "../../eurocode/ec3-1-1/Form/schema/options";
import { twMerge } from "tailwind-merge";

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

      downloadTextFile(
        "verification.ndg.json",
        `${JSON.stringify(draft, null, 2)}\n`,
      );
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
    <main className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <header className="flex shrink-0 items-start justify-between gap-6">
        <div>
          <Header>NDG editor</Header>
          <SubHeader>Draft and inspect verification graphs</SubHeader>
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <PageActionButton onClick={onSaveDraft}>Save draft</PageActionButton>
          <label
            className={twMerge(
              pageActionButtonClassName,
              "border-sand-300 bg-white text-slate-800 hover:border-sand-400 hover:bg-sand-50",
            )}
          >
            Load draft
            <input
              accept=".ndg.json,.json"
              className="hidden"
              onChange={onLoadDraft}
              type="file"
            />
          </label>
        </div>
      </header>

      {error ? (
        <p className="shrink-0 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}

      <NdgEditor
        ref={editorRef}
        inputKeyOptions={ec311InputKeyOptions}
        className="min-h-0 flex-1 rounded-sm border border-sand-200"
      />
    </main>
  );
};

const pageActionButtonClassName =
  "cursor-pointer rounded-sm border px-4 py-2 text-xs font-medium transition-colors";

const PageActionButton = (props: ComponentProps<"button">) => {
  const { className, type = "button", ...buttonProps } = props;

  return (
    <button
      className={twMerge(
        pageActionButtonClassName,
        "border-envy-700 bg-envy-700 text-white hover:border-envy-800 hover:bg-envy-800",
        className,
      )}
      type={type}
      {...buttonProps}
    />
  );
};

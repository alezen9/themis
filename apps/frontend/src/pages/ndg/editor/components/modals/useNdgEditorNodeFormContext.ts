import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

export const useNdgEditorNodeFormContext = () =>
  useTypedFormContext<EditorNodeInput>();

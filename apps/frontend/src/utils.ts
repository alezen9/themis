import type { Ref } from "react";

export const multipleRefs =
  <T>(...refs: Array<Ref<T> | null | undefined>) =>
  (node: T | null) => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      ref.current = node;
    });
  };

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export const downloadAs = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

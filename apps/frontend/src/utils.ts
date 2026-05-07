import type { Ref } from "react";

export const multipleRefs =
  <T>(...refs: Array<Ref<T> | null | undefined>) =>
  (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      ref.current = node;
    });
  };

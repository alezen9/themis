import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

const offsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetHeight",
);

Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
  configurable: true,
  get() {
    if (this.classList.contains("max-h-64")) return 256;
    if (this.getAttribute("role") === "option") return 44;

    return offsetHeight?.get?.call(this) ?? 0;
  },
});

afterEach(() => {
  cleanup();
});

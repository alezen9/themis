import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Latex } from "./Latex";

describe("Latex", () => {
  it("does not crash on invalid tex", () => {
    expect(() => {
      render(<Latex tex="\\notacommand{" />);
    }).not.toThrow();
  });
});

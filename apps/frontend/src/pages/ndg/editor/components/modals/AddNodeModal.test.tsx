import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { constantCatalog } from "@ndg/ndg-core";
import { coefficientCatalog, userInputCatalog } from "@ndg/ndg-ec3-1-1";

import { AddNodeModal } from "./AddNodeModal";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";

const addNode = vi.fn();

const submit = () =>
  fireEvent.submit(document.getElementById("add-node-form")!);

const pickFromSelect = (testid: string, value: string) => {
  fireEvent.click(screen.getByTestId(testid));
  fireEvent.mouseMove(screen.getByTestId(`option-${value}`));
  fireEvent.click(screen.getByTestId(`option-${value}`));
};

describe("AddNodeModal", () => {
  beforeEach(() => {
    addNode.mockReset();
    useNdgEditorStore.setState({ addNode });
    useNdgEditorModalStore.setState({ modal: { mode: "create-node" } });
    render(<AddNodeModal />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens on user-input with no error shown", () => {
    const radio = screen.getByRole<HTMLInputElement>("radio", {
      name: "User input",
    });
    expect(radio.checked).toBe(true);
    expect("error" in screen.getByTestId("field-key").dataset).toBe(false);
  });

  it("sets a coefficient key default after a type switch", async () => {
    fireEvent.click(screen.getByRole("radio", { name: "Coefficient" }));

    await waitFor(() =>
      expect("error" in screen.getByTestId("field-key").dataset).toBe(false),
    );

    submit();
    await waitFor(() =>
      expect(addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "coefficient",
          key: "gamma_M0",
          symbol: coefficientCatalog.gamma_M0.symbol,
          valueType: { type: "number" },
        }),
      ),
    );
  });

  it("sets a constant key default after a type switch", async () => {
    fireEvent.click(screen.getByRole("radio", { name: "Constant" }));
    await waitFor(() =>
      expect("error" in screen.getByTestId("field-key").dataset).toBe(false),
    );

    submit();
    await waitFor(() =>
      expect(addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "constant",
          key: "E",
          symbol: constantCatalog.E.symbol,
          valueType: { type: "number" },
        }),
      ),
    );
  });

  it("fills symbol when a constant preset is picked", async () => {
    fireEvent.click(screen.getByRole("radio", { name: "Constant" }));
    await waitFor(() =>
      expect("error" in screen.getByTestId("field-key").dataset).toBe(false),
    );
    pickFromSelect("input-constant-preset", "pi");

    submit();
    await waitFor(() =>
      expect(addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "constant",
          key: "pi",
          symbol: constantCatalog.pi.symbol,
          valueType: { type: "number" },
        }),
      ),
    );
  });

  it("derives symbol/unit/valueType from the catalog when a user-input key is picked", async () => {
    pickFromSelect("input-key-trigger", "M_y_Ed_Nmm");
    await waitFor(() =>
      expect("error" in screen.getByTestId("field-key").dataset).toBe(false),
    );

    submit();
    const entry = userInputCatalog.M_y_Ed_Nmm;
    await waitFor(() =>
      expect(addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "user-input",
          key: "M_y_Ed_Nmm",
          symbol: entry.symbol,
          unit: entry.unit,
          valueType: { type: entry.valueType },
        }),
      ),
    );
  });

  it("blocks formula save while the key is empty", async () => {
    fireEvent.click(screen.getByRole("radio", { name: "Formula" }));
    submit();
    await waitFor(() =>
      expect("error" in screen.getByTestId("field-key").dataset).toBe(true),
    );
    expect(addNode).not.toHaveBeenCalled();
  });

  it("submits a compute formula with a keyed template", async () => {
    fireEvent.click(screen.getByRole("radio", { name: "Formula" }));
    fireEvent.change(document.querySelector<HTMLInputElement>('[name="key"]')!, {
      target: { value: "resistance" },
    });
    fireEvent.change(
      document.querySelector<HTMLTextAreaElement>('[name="template"]')!,
      {
        target: {
          value: "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
        },
      },
    );

    submit();
    await waitFor(() =>
      expect(addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "formula",
          variant: "compute",
          key: "resistance",
          template: "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}",
        }),
      ),
    );
  });
});

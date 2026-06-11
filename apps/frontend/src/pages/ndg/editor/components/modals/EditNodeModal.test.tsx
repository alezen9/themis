import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { coefficientCatalog, userInputCatalog } from "@ndg/ndg-ec3-1-1";

import { EditNodeModal } from "./EditNodeModal";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import type { EditorNode } from "../../document/types";

const updateNode = vi.fn();

const seed = (node: EditorNode) => {
  useNdgEditorStore.setState({
    updateNode,
    _nodeById: new Map([[node.id, node]]),
  });
  useNdgEditorModalStore.setState({
    modal: { mode: "edit-node", nodeId: node.id },
  });
  render(<EditNodeModal />);
};

const userInputNode: EditorNode = {
  id: "n1",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: {
    type: "user-input",
    key: "N_Ed_N",
    valueType: { type: "number" },
    symbol: "X_CUSTOM",
  },
} as EditorNode;

const unitNode: EditorNode = {
  id: "u1",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: {
    type: "user-input",
    key: "M_y_Ed_Nmm",
    valueType: { type: "number" },
    symbol: "M_{y,Ed}",
    displayUnit: "kNm",
  },
} as EditorNode;

const checkNode: EditorNode = {
  id: "c1",
  position: { x: 0, y: 0 },
  type: "check",
  data: {
    type: "check",
    variant: "compute",
    key: "utilisation",
    name: "Old name",
    valueType: { type: "number" },
    template: "x \\leq 1",
    symbol: "u_r",
  },
} as EditorNode;

describe("EditNodeModal", () => {
  beforeEach(() => {
    updateNode.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads a stored node without re-deriving from the catalog", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "n1",
          key: "N_Ed_N",
          symbol: "X_CUSTOM",
        }),
      ),
    );
  });

  it("re-derives symbol when the key is changed", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByTestId("input-key-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-M_y_Ed_Nmm"));
    fireEvent.click(screen.getByTestId("option-M_y_Ed_Nmm"));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    const entry = userInputCatalog.M_y_Ed_Nmm;
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "n1",
          key: "M_y_Ed_Nmm",
          symbol: entry.symbol,
        }),
      ),
    );
  });

  it("sets defaults when changing node type", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByRole("radio", { name: "Coefficient" }));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "n1",
          type: "coefficient",
          key: "gamma_M0",
          symbol: coefficientCatalog.gamma_M0.symbol,
          valueType: { type: "number" },
        }),
      ),
    );
  });

  it("shows and preserves a stored display unit on open", async () => {
    seed(unitNode);

    expect(screen.getByTestId("input-displayUnit").textContent).toContain(
      "kNm",
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u1", displayUnit: "kNm" }),
      ),
    );
  });

  it("reseeds the base display unit when the key changes", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByTestId("input-key-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-M_y_Ed_Nmm"));
    fireEvent.click(screen.getByTestId("option-M_y_Ed_Nmm"));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({ key: "M_y_Ed_Nmm", displayUnit: "Nmm" }),
      ),
    );
  });

  it("hides the display unit when the key has no units", async () => {
    seed(unitNode);

    fireEvent.click(screen.getByTestId("input-key-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-section_class"));
    fireEvent.click(screen.getByTestId("option-section_class"));

    await waitFor(() =>
      expect(screen.queryByTestId("field-displayUnit")).toBeNull(),
    );
  });

  it("edits a check node name with no type selector", async () => {
    seed(checkNode);

    expect(screen.queryByRole("radio", { name: "Coefficient" })).toBeNull();
    fireEvent.change(
      within(screen.getByTestId("field-name")).getByRole("textbox"),
      { target: { value: "New name" } },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({ id: "c1", name: "New name" }),
      ),
    );
  });
});

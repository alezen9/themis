import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

const submit = () =>
  fireEvent.submit(document.getElementById("edit-node-form")!);

const inputByName = (name: string) =>
  document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;

const userInputNode: EditorNode = {
  id: "n1",
  position: { x: 0, y: 0 },
  type: "user-input",
  data: {
    type: "user-input",
    key: "N_Ed_N",
    valueType: { type: "number" },
    symbol: "X_CUSTOM",
    unit: "u_custom",
  },
} as EditorNode;

const checkNode: EditorNode = {
  id: "c1",
  position: { x: 0, y: 0 },
  type: "check",
  data: {
    type: "check",
    key: "utilisation",
    name: "Old name",
    valueType: { type: "number" },
    verificationExpression: "x \\leq 1",
    symbol: "u_r",
  },
} as EditorNode;

beforeEach(() => {
  updateNode.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EditNodeModal", () => {
  it("loads a stored node without re-deriving from the catalog", async () => {
    seed(userInputNode);

    submit();
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "n1",
          key: "N_Ed_N",
          symbol: "X_CUSTOM",
          unit: "u_custom",
        }),
      ),
    );
  });

  it("re-derives symbol/unit when the key is changed", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByTestId("input-key-trigger"));
    fireEvent.mouseMove(screen.getByTestId("option-M_y_Ed_Nmm"));
    fireEvent.click(screen.getByTestId("option-M_y_Ed_Nmm"));

    submit();
    const entry = userInputCatalog.M_y_Ed_Nmm;
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "n1",
          key: "M_y_Ed_Nmm",
          symbol: entry.symbol,
          unit: entry.unit,
        }),
      ),
    );
  });

  it("sets defaults when changing node type", async () => {
    seed(userInputNode);

    fireEvent.click(screen.getByRole("radio", { name: "Coefficient" }));

    submit();
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

  it("edits a check node name with no type selector", async () => {
    seed(checkNode);

    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    fireEvent.change(inputByName("name"), { target: { value: "New name" } });

    submit();
    await waitFor(() =>
      expect(updateNode).toHaveBeenCalledWith(
        expect.objectContaining({ id: "c1", name: "New name" }),
      ),
    );
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Condition } from "@ndg/ndg-core";

import { EditEdgeModal } from "./EditEdgeModal";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import type { EditorEdge } from "../../document/types";

const setEdgeCondition = vi.fn();

const seed = (data?: { condition?: Condition }) => {
  const edge = { id: "e1", source: "a", target: "b", data } as EditorEdge;
  useNdgEditorStore.setState({
    setEdgeCondition,
    nodes: [],
    _edgeById: new Map([[edge.id, edge]]),
  });
  useNdgEditorModalStore.setState({
    modal: { mode: "edit-edge", edgeId: "e1" },
  });
  render(<EditEdgeModal />);
};

describe("EditEdgeModal", () => {
  beforeEach(() => {
    setEdgeCondition.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("saves a valid parsed condition", () => {
    seed();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "section_class = 1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(setEdgeCondition).toHaveBeenCalledWith("e1", {
      eq: ["section_class", { value: 1 }],
    });
  });

  it("blocks save and flags an unknown key", () => {
    seed();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "nope = 1" },
    });
    expect(screen.getByText(/Unknown key/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(setEdgeCondition).not.toHaveBeenCalled();
  });

  it("blocks save and shows a parse error", () => {
    seed();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "section_class =" },
    });
    expect(screen.getByText("Expected a value")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(setEdgeCondition).not.toHaveBeenCalled();
  });

  it("removes an existing condition", () => {
    seed({ condition: { eq: ["section_class", { value: 1 }] } });
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(setEdgeCondition).toHaveBeenCalledWith("e1", undefined);
  });
});

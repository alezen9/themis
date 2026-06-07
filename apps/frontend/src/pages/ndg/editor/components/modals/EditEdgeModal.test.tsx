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

const type = (value: string) =>
  fireEvent.change(document.querySelector("textarea")!, { target: { value } });

const submit = () =>
  fireEvent.submit(document.getElementById("edit-edge-form")!);

beforeEach(() => {
  setEdgeCondition.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("EditEdgeModal", () => {
  it("saves a valid parsed condition", () => {
    seed();
    type("section_class = 1");
    submit();
    expect(setEdgeCondition).toHaveBeenCalledWith("e1", {
      eq: ["section_class", { value: 1 }],
    });
  });

  it("blocks save and flags an unknown key", () => {
    seed();
    type("nope = 1");
    expect(screen.getByText(/Unknown key/i)).toBeTruthy();
    submit();
    expect(setEdgeCondition).not.toHaveBeenCalled();
  });

  it("blocks save and shows a parse error", () => {
    seed();
    type("section_class =");
    expect(screen.getByText("Expected a value")).toBeTruthy();
    submit();
    expect(setEdgeCondition).not.toHaveBeenCalled();
  });

  it("removes an existing condition", () => {
    seed({ condition: { eq: ["section_class", { value: 1 }] } });
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(setEdgeCondition).toHaveBeenCalledWith("e1", undefined);
  });
});

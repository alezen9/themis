import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNdgEditorModalStore } from "../modals/useNdgEditorModalStore";
import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

const undo = vi.fn();
const redo = vi.fn();

beforeEach(() => {
  undo.mockReset();
  redo.mockReset();
  useNdgEditorStore.setState({ undo, redo });
  useNdgEditorModalStore.setState({ modal: undefined });
  render(
    <KeyboardShortcuts>
      <div />
    </KeyboardShortcuts>,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("KeyboardShortcuts", () => {
  it("runs undo on ctrl+z", () => {
    fireEvent.keyDown(window, { code: "KeyZ", ctrlKey: true });
    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).not.toHaveBeenCalled();
  });

  it("runs redo on ctrl+shift+z", () => {
    fireEvent.keyDown(window, { code: "KeyZ", ctrlKey: true, shiftKey: true });
    expect(redo).toHaveBeenCalledTimes(1);
    expect(undo).not.toHaveBeenCalled();
  });

  it("runs undo on meta+z (macOS)", () => {
    fireEvent.keyDown(window, { code: "KeyZ", metaKey: true });
    expect(undo).toHaveBeenCalledTimes(1);
  });

  it("does not fire when a modal is open", () => {
    useNdgEditorModalStore.setState({ modal: { mode: "create-node" } });
    fireEvent.keyDown(window, { code: "KeyZ", ctrlKey: true });
    expect(undo).not.toHaveBeenCalled();
  });

  it("ignores unhandled key codes", () => {
    fireEvent.keyDown(window, { code: "KeyS", ctrlKey: true });
    expect(undo).not.toHaveBeenCalled();
    expect(redo).not.toHaveBeenCalled();
  });

  it("ignores z without ctrl or meta", () => {
    fireEvent.keyDown(window, { code: "KeyZ" });
    expect(undo).not.toHaveBeenCalled();
  });
});

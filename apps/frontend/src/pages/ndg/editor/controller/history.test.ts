import { describe, expect, it } from "vitest";

import { HISTORY_LIMIT, emptyHistory, record, redo, undo } from "./history";

describe("history", () => {
  it("records the present onto the past and clears the future", () => {
    const history = record(record(emptyHistory<number>(), 1), 2);
    expect(history.past).toEqual([1, 2]);
    expect(history.future).toEqual([]);
  });

  it("undo returns the previous value and moves the present to the future", () => {
    const history = record(record(emptyHistory<number>(), 1), 2);
    const result = undo(history, 3);
    expect(result?.value).toBe(2);
    expect(result?.history.past).toEqual([1]);
    expect(result?.history.future).toEqual([3]);
  });

  it("undo returns null when there is no past", () => {
    expect(undo(emptyHistory<number>(), 1)).toBeNull();
  });

  it("redo replays the next value and pushes the present onto the past", () => {
    const undone = undo(record(emptyHistory<number>(), 1), 2);
    const result = redo(undone!.history, undone!.value);
    expect(result?.value).toBe(2);
    expect(result?.history.past).toEqual([1]);
    expect(result?.history.future).toEqual([]);
  });

  it("redo returns null when there is no future", () => {
    expect(redo(record(emptyHistory<number>(), 1), 2)).toBeNull();
  });

  it("caps the past at the history limit and drops the oldest entry", () => {
    let history = emptyHistory<number>();
    for (let value = 0; value < HISTORY_LIMIT + 5; value += 1)
      history = record(history, value);
    expect(history.past).toHaveLength(HISTORY_LIMIT);
    expect(history.past[0]).toBe(5);
  });
});

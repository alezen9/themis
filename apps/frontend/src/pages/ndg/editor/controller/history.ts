export const HISTORY_LIMIT = 50;

export type History<T> = { past: T[]; future: T[] };

export const emptyHistory = <T>(): History<T> => ({ past: [], future: [] });

export const record = <T>(history: History<T>, present: T): History<T> => ({
  past: [...history.past, present].slice(-HISTORY_LIMIT),
  future: [],
});

export const undo = <T>(history: History<T>, present: T) => {
  const previous = history.past.at(-1);
  if (!previous) return null;
  return {
    value: previous,
    history: {
      past: history.past.slice(0, -1),
      future: [present, ...history.future],
    },
  };
};

export const redo = <T>(history: History<T>, present: T) => {
  const next = history.future.at(0);
  if (!next) return null;
  return {
    value: next,
    history: {
      past: [...history.past, present],
      future: history.future.slice(1),
    },
  };
};
